import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'
import postcss from 'postcss'

function render(component, file, value) {
    const module = { exports: {} }
    const source = readFileSync(new URL(`../src/components/${file}.jsx`, import.meta.url), 'utf8')
    const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsxFactory: 'element', jsxFragment: 'Fragment' })
    runInNewContext(code, {
        module, exports: module.exports, Fragment: 'fragment',
        element: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
        require: name => name === 'react' ? {
            useEffect() {}, useState: v => [v, () => {}], useRef: () => ({ current: null }), useContext: () => value,
        } : {},
    })
    return module.exports[component]()
}
function nodes(tree) {
    return typeof tree === 'object' && tree !== null ? [tree, ...tree.children.flatMap(nodes)] : []
}
function text(tree) {
    return typeof tree === 'object' && tree !== null ? tree.children.map(text).join('') : String(tree ?? '')
}

const ctx = (over = {}) => ({
    profiles: [], profilesLoading: false, profilesError: '', profilesSaving: false,
    getProfiles: () => {}, currentPage: 1, itemsPerPage: 4, nextPage: () => {}, prevPage: () => {},
    putProfiles: () => {}, deleteProfiles: () => {},
    formAdd: { current: null }, formEdit: { current: null }, postProfiles: () => {}, actProfiles: () => {},
    modal: null, closeModal: () => {}, ...over,
})

test('Grid: tarjetas en rejilla con imagen, datos y acciones Update/Delete', () => {
    const tree = render('CarrouselDesigners', 'CarrouselDesigners/CarrouselDesigners', ctx({
        profiles: [{ _id: 'a', name: 'Ada', age: 30, design: 'UX', email: 'ada@x.com', src: '/a.jpg', disponible: true }],
    }))
    const grid = nodes(tree).find(node => node.props?.className === 'designers-grid')
    assert.ok(grid, 'Falta el grid de tarjetas')
    const cards = nodes(tree).filter(node => node.props?.className === 'designers-card')
    assert.equal(cards.length, 1)
    assert.ok(nodes(tree).some(node => node.type === 'img' && node.props.src === '/a.jpg'))
    const buttons = nodes(tree).filter(node => node.type === 'button').map(b => text(b))
    assert.ok(buttons.some(t => /update/i.test(t)) && buttons.some(t => /delete/i.test(t)))
    assert.match(text(tree), /Ada/)
})

test('Modal: abrir para añadir y para editar, con rol dialog y cierre', () => {
    const tree = render('Explore', 'Explore/Explore', ctx({ modal: 'add' }))
    const dialog = nodes(tree).find(node => node.props?.role === 'dialog')
    assert.ok(dialog, 'Falta el modal de añadir')
    assert.ok(nodes(tree).some(node => node.props?.className === 'modal-backdrop'))
    assert.ok(nodes(tree).some(node => node.props?.['aria-label'] === 'Close'), 'Falta cierre')
    assert.ok(nodes(tree).some(node => node.type === 'form'), 'El modal add renderiza un formulario')

    const editTree = render('Explore', 'Explore/Explore', ctx({ modal: 'edit' }))
    assert.ok(nodes(editTree).some(node => node.type === 'form'), 'El modal edit renderiza un formulario')
    assert.match(text(editTree), /Edit/i)
})

test('Sin modal: la página no renderiza formularios inline', () => {
    const tree = render('Explore', 'Explore/Explore', ctx({}))
    assert.ok(!nodes(tree).some(node => node.type === 'form'), 'No debe haber formularios fuera del modal')
    assert.ok(nodes(tree).some(node => node.props?.to === undefined && /add/.test(text(node) || '')) || text(tree).includes('add'), 'Debe existir un botón add')
})

test('Contexto: validación de campos vacíos en post y put', () => {
    const src = readFileSync(new URL('../src/components/Context/DesignersContext.jsx', import.meta.url), 'utf8')
    assert.match(src, /postProfiles[\s\S]*?trim\(\)[\s\S]*?return/, 'postProfiles debe validar vacíos')
    assert.match(src, /actProfiles[\s\S]*?trim\(\)[\s\S]*?return/, 'actProfiles debe validar vacíos')
})

test('Modal estilo OpenCode: mono, sin sombras, radios 4px y overlay dark', () => {
    const css = postcss.parse(readFileSync(new URL('../src/components/Explore/Explore.css', import.meta.url), 'utf8'))
    let overlay = 0
    css.walkRules(rule => rule.walkDecls(decl => {
        if (decl.prop === 'box-shadow') assert.fail(`sombra prohibida en ${rule.selector}`)
        if (decl.prop === 'font-family') assert.match(decl.value, /--fontMono/)
        if (decl.prop === 'border-radius') assert.ok(['4px', '9999px'].includes(decl.value), `radio ${decl.value}`)
        if ((decl.prop === 'background' || decl.prop === 'background-color') && (decl.value.includes('surfaceDark') || decl.value.includes('32, 29, 29'))) overlay++
    }))
    assert.ok(overlay >= 1, 'El overlay/modal debe usar la superficie dark')
    const card = postcss.parse(readFileSync(new URL('../src/components/CarrouselDesigners/CarrouselDesigners.css', import.meta.url), 'utf8'))
    card.walkRules(rule => rule.walkDecls(decl => {
        if (decl.prop === 'box-shadow') assert.fail(`sombra en tarjetas: ${rule.selector}`)
        if (decl.prop === 'font-family') assert.match(decl.value, /--fontMono/)
    }))
})