import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'
import postcss from 'postcss'

function render() {
    const module = { exports: {} }
    const source = readFileSync(new URL('../src/components/CarrouselCards/CarrouselCards.jsx', import.meta.url), 'utf8')
    const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsxFactory: 'element', jsxFragment: 'Fragment' })
    runInNewContext(code, {
        module, exports: module.exports, Fragment: 'fragment',
        element: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
        require: () => ({ useRef: () => ({ current: null }) }),
    })
    return module.exports.CarrouselCards()
}
function nodes(tree) {
    return typeof tree === 'object' && tree !== null ? [tree, ...tree.children.flatMap(nodes)] : []
}
function text(tree) {
    return typeof tree === 'object' && tree !== null ? tree.children.map(text).join('') : String(tree ?? '')
}

test('Marquesina: pista duplicada dos veces, sin imágenes ni botones', () => {
    const tree = render()
    assert.ok(!nodes(tree).some(node => node.type === 'img'), 'No debe haber imágenes')
    assert.ok(!nodes(tree).some(node => node.type === 'button'), 'No debe haber botones Next/Prev')
    const groups = nodes(tree).filter(node => node.props?.className === 'marquee-group')
    assert.equal(groups.length, 2, 'La cinta debe duplicarse para el bucle continuo')
    assert.equal(groups[1].props['aria-hidden'], true, 'La copia debe ocultarse a lectores')
    assert.equal(groups[0].children.length, groups[1].children.length)
    assert.ok(groups[0].children.length >= 8, 'Deben conservarse las categorías')
    assert.match(text(tree), /Fullstack/)
    assert.match(text(tree), /And more/)
    assert.ok(nodes(tree).some(node => node.props?.className === 'marquee-mark'))
})

test('Marquesina: animación continua, pausa en hover y movimiento reducido', () => {
    const css = postcss.parse(readFileSync(new URL('../src/components/CarrouselCards/CarrouselCards.css', import.meta.url), 'utf8'))
    let animation = '', keyframes = false, hoverPause = false, reduced = false, mono = false
    css.walkRules(rule => {
        if (rule.selector === '.marquee' && rule.parent.type !== 'atrule') rule.walkDecls(decl => {
            if (decl.prop === 'font-family') mono = decl.value.includes('--fontMono')
        })
        if (rule.selector === '.marquee-track' && rule.parent.type !== 'atrule') rule.walkDecls(decl => {
            if (decl.prop === 'animation') animation = decl.value
        })
        if (rule.selector.includes(':hover') && rule.nodes.some(n => n.prop === 'animation-play-state' && n.value === 'paused'))
            hoverPause = rule.parent.type === 'atrule' && rule.parent.params.includes('hover: hover')
    })
    css.walkAtRules('keyframes', at => { if (at.params === 'marquee') keyframes = true })
    css.walkAtRules('media', at => {
        if (!at.params.includes('prefers-reduced-motion: reduce')) return
        at.walkRules(rule => {
            if (rule.selector === '.marquee-track') rule.walkDecls(decl => {
                if (decl.prop === 'animation' && decl.value === 'none') reduced = true
            })
        })
    })
    assert.match(animation, /marquee/)
    assert.match(animation, /linear/)
    assert.match(animation, /infinite/)
    assert.ok(keyframes, 'Faltan los @keyframes marquee')
    assert.ok(hoverPause, 'El hover debe pausar dentro de (hover:hover) and (pointer:fine)')
    assert.ok(reduced, 'prefers-reduced-motion debe detener la marquesina')
    assert.ok(mono, 'La marquesina debe usar la fuente mono')
})