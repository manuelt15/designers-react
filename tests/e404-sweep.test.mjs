import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, globSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'
import postcss from 'postcss'

test('404: sin imágenes, texto mono y enlace de vuelta', () => {
    const module = { exports: {} }
    const source = readFileSync(new URL('../src/components/404/Error404.jsx', import.meta.url), 'utf8')
    const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsxFactory: 'element', jsxFragment: 'Fragment' })
    runInNewContext(code, {
        module, exports: module.exports, Fragment: 'fragment',
        element: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
        require: () => ({}),
    })
    const tree = module.exports.Error404()
    const nodes = t => typeof t === 'object' && t !== null ? [t, ...t.children.flatMap(nodes)] : []
    const text = t => typeof t === 'object' && t !== null ? t.children.map(text).join('') : String(t ?? '')
    const all = nodes(tree)
    assert.ok(!all.some(n => n.type === 'img'), '404 sin imágenes raster')
    assert.ok(all.some(n => n.props?.to === '/home'), 'Enlace de vuelta a home')
    const t = text(tree)
    assert.match(t, /404/)
    assert.match(t, /exist/i)
})

test('Barrido global: cero tokens antiguos fuera de index.css y cero sombras', () => {
    const files = globSync('src/**/*.{css,jsx}', { cwd: new URL('../', import.meta.url) })
    for (const file of files) {
        const content = readFileSync(new URL('../' + file, import.meta.url), 'utf8')
        if (file.endsWith('index.css')) {
            assert.ok(!content.includes('wheat'), 'index.css no debe usar colores literales wheat')
            continue
        }
        for (const banned of ['wheat', '--color1', '--color2', '--color3', '--fontTitu', '--fontText', '--fontBtn1', '--fontBtn2', '--colorBase', 'star.webp', 'fondoF', 'logo.png', 'appStore', 'googlePlay', 'box-shadow']) {
            assert.ok(!content.includes(banned), `${file}: restos del diseño antiguo (${banned})`)
        }
    }
})