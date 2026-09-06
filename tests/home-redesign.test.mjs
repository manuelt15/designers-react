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
        require: name => name === 'react' ? { useRef: () => ({ current: {children: []} }), useContext: () => value } : {},
    })
    return module.exports[component]()
}
function nodes(tree) {
    return typeof tree === 'object' && tree !== null ? [tree, ...tree.children.flatMap(nodes)] : []
}
function text(tree) {
    return typeof tree === 'object' && tree !== null ? tree.children.map(text).join('') : String(tree ?? '')
}

test('Cabecera: sin logo, enlaces de texto y logout como icono no botón', () => {
    const tree = render('Cabecera', 'Cabecera/Cabecera', { logOut: () => {} })
    assert.ok(!nodes(tree).some(node => node.type === 'img'), 'La cabecera no debe tener logo')
    const buttons = nodes(tree).filter(node => node.type === 'button')
    assert.equal(buttons.length, 0, 'logout no debe ser un botón')
    const links = nodes(tree).filter(node => node.props?.to).map(l => l.props.to)
    assert.deepEqual([...new Set(links)].sort(), ['/explore', '/home'])
    const logout = nodes(tree).find(node => node.props?.onClick)
    assert.ok(logout, 'Falta el icono de logout')
    assert.ok(!['button'].includes(logout.type))
    assert.ok(logout.props.role === 'button' && logout.props.tabIndex === 0, 'logout debe ser accesible por teclado')
    assert.ok(logout.props['aria-label'])
})

test('Home: composición OpenCode con hero oscuro único y CTA', () => {
    const tree = render('Home', 'Home/Home', {})
    assert.ok(!nodes(tree).some(node => node.type === 'img'), 'Home sin imágenes raster')
    assert.ok(nodes(tree).some(node => node.props?.to === '/explore'), 'Falta CTA a explore')
    const t = text(tree)
    assert.match(t, /Not for designers/)
})

test('Footer: filas mono con marcadores ASCII y enlaces sociales', () => {
    const tree = render('Footer', 'Footer/Footer', {})
    const t = text(tree)
    assert.match(t, /\[\+\]/)
    assert.ok(nodes(tree).some(node => node.type === 'a' && (node.props.href || '').includes('instagram')))
    assert.ok(nodes(tree).some(node => node.type === 'a' && (node.props.href || '').includes('linkedin')))
})

test('Estilos home/footer/cabecera: mono, sin sombras, radios permitidos, fondo canvas', () => {
    for (const file of ['Home/Home.css', 'Footer/Footer.css', 'Cabecera/Cabecera.css']) {
        const css = postcss.parse(readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8'))
        let dark = 0
        css.walkRules(rule => rule.walkDecls(decl => {
            if (decl.prop === 'box-shadow') assert.fail(`${file}: sombra prohibida`)
            if (decl.prop === 'font-family') assert.match(decl.value, /--fontMono/, `${file}: fuente no mono`)
            if (decl.prop === 'border-radius') assert.ok(['4px', '9999px'].includes(decl.value), `${file}: radio ${decl.value}`)
            if ((decl.prop === 'background' || decl.prop === 'background-color') && decl.value === 'var(--surfaceDark)') dark++
        }))
        if (file !== 'Cabecera/Cabecera.css') assert.ok(dark <= 1, `${file}: panel oscuro repetido`)
    }
})
