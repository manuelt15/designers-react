import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'

const avatars = ['avatar-1.png', 'avatar-2.png', 'avatar-3.png', 'avatar-4.png']
for (const file of avatars) {
    test(`Assets: existe public/${file}`, () => {
        assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), `Falta public/${file}`)
    })
}

function render(value) {
    const module = { exports: {} }
    const source = readFileSync(new URL('../src/components/Explore/Explore.jsx', import.meta.url), 'utf8')
    const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsxFactory: 'element', jsxFragment: 'Fragment' })
    runInNewContext(code, {
        module, exports: module.exports, Fragment: 'fragment',
        element: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
        require: name => name === 'react' ? {
            useEffect() {}, useRef: () => ({ current: null }), useContext: () => value,
        } : {},
    })
    return module.exports.Explore()
}
function nodes(tree) {
    return typeof tree === 'object' && tree !== null ? [tree, ...tree.children.flatMap(nodes)] : []
}
function text(tree) {
    return typeof tree === 'object' && tree !== null ? tree.children.map(text).join('') : String(tree ?? '')
}

test('Modal add: sin campo src, checkbox de avatar con label explicativo', () => {
    const tree = render({ modal: 'add', profilesSaving: false, profiles: [], formAdd: { current: null }, postProfiles: () => {} })
    const inputs = nodes(tree).filter(node => node.type === 'input')
    assert.ok(!inputs.some(i => i.props?.name === 'src'), 'No debe existir el campo src')
    const check = inputs.find(i => i.props?.name === 'avatarRandom')
    assert.ok(check, 'Falta el checkbox avatarRandom')
    const label = nodes(tree).find(n => n.type === 'label' && text(n).includes('random'))
    assert.ok(label, 'Falta label explicativo del avatar aleatorio')
})

test('Contexto: postProfiles elige avatar según el checkbox; act conserva src', () => {
    const src = readFileSync(new URL('../src/components/Context/DesignersContext.jsx', import.meta.url), 'utf8')
    assert.match(src, /avatarRandom/, 'Debe leer avatarRandom del formulario')
    assert.match(src, /avatar-/, 'Debe elegir entre avatares avatar-*.png')
    assert.match(src, /Math\.random/, 'Elección aleatoria')
    assert.match(src, /src\s*:\s*current\?\.src \|\| ['"]\/default\.jpg['"]/s, 'Al editar conserva el src existente o cae a default')
})

test('Grid: tarjeta sin src muestra default.jpg', () => {
    const src = readFileSync(new URL('../src/components/CarrouselDesigners/CarrouselDesigners.jsx', import.meta.url), 'utf8')
    assert.match(src, /profile\.src \|\| ["']\/default\.jpg["']/)
})