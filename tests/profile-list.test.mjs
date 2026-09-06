import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'

function render(value, component = 'CarrouselDesigners', file = 'CarrouselDesigners/CarrouselDesigners') {
    const module = { exports: {} }
    const source = readFileSync(new URL(`../src/components/${file}.jsx`, import.meta.url), 'utf8')
    const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsxFactory: 'element', jsxFragment: 'Fragment' })
    runInNewContext(code, {
        module, exports: module.exports, Fragment: 'fragment',
        element: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
        require: name => name === 'react' ? { useEffect() {}, useState: v => [v, () => {}], useContext: () => ({ profiles: [], currentPage: 1, itemsPerPage: 4, ...value }) } : {},
    })
    return module.exports[component]()
}
function nodes(tree) {
    return typeof tree === 'object' && tree !== null ? [tree, ...tree.children.flatMap(nodes)] : []
}
function text(tree) {
    return typeof tree === 'object' && tree !== null ? tree.children.map(text).join('') : String(tree ?? '')
}

test('Listado: distingue carga, error reintentable y vacío sin paginación 1/0', () => {
    const loading = render({ profilesLoading: true })
    assert.match(text(loading), /Loading/)
    assert.ok(nodes(loading).some(node => node.props.role === 'status'))
    let retries = 0
    const error = render({ profilesError: 'Offline', getProfiles: () => retries++ })
    assert.match(text(error), /Offline/)
    nodes(error).find(node => node.type === 'button').props.onClick()
    assert.equal(retries, 1)
    const empty = render({})
    assert.match(text(empty), /no profiles yet/)
    assert.ok(!nodes(empty).some(node => node.props.className === 'pagination-container'))
})

test('Listado: mantiene acciones e imagen de respaldo y bloquea acciones pendientes', () => {
    const tree = render({ profiles: [{ _id: 'one', name: 'Test', disponible: true }], profilesSaving: true })
    const image = nodes(tree).find(node => node.type === 'img')
    assert.equal(image.props.src, '/default.png')
    const buttons = nodes(tree).filter(node => node.props.className?.includes('card-modify'))
    assert.equal(buttons.length, 2)
    assert.ok(buttons.every(button => button.props.disabled))
})

test('Formularios: campos con nombre accesible y acciones explícitas', () => {
    for (const [component, value] of [['Login', {goodLogin: true, userNew: true, userExist: true, noUser: true}], ['Explore', {modal: 'add', profilesSaving: false, formAdd: {current: null}, postProfiles: () => {}}]]) {
        const tree = render(value, component, `${component}/${component}`)
        const inputs = nodes(tree).filter(node => node.type === 'input')
        assert.ok(inputs.length > 0)
        for (const input of inputs) {
            if (input.props.type === 'submit') assert.ok(input.props.value)
            else if (input.props.type !== 'checkbox') assert.ok(input.props['aria-label'])
        }
    }
})

test('Explore: guardar queda deshabilitado durante la petición', () => {
    const tree = render({profilesSaving: true}, 'Explore', 'Explore/Explore')
    assert.ok(nodes(tree).filter(node => node.props.type === 'submit').every(node => node.props.disabled))
})

test('Navegación: Home y 404 no anidan un enlace dentro de un botón', () => {
    for (const [component, file] of [['Home', 'Home/Home'], ['Error404', '404/Error404']]) {
        const tree = render({}, component, file)
        assert.ok(!nodes(tree).some(node => node.type === 'button' && nodes(node).some(child => child.props.to)))
        assert.ok(nodes(tree).some(node => node.props.to))
    }
})
