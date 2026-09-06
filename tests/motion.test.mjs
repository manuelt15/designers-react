import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, globSync } from 'node:fs'
import postcss from 'postcss'

const files = globSync('src/**/*.css', { cwd: new URL('../', import.meta.url) })
const sheets = files.map(file => ({file, root: postcss.parse(readFileSync(new URL('../' + file, import.meta.url), 'utf8'))}))

test('Movimiento: transiciones explícitas y hover limitado a puntero fino', () => {
    for (const {file, root} of sheets) {
        root.walkDecls('transition', decl => assert.ok(!/\ball\b/.test(decl.value), `${file}: transition all`))
        root.walkRules(rule => {
            if (!rule.selector.includes(':hover')) return
            if (!rule.nodes.some(node => ['transform', 'scale'].includes(node.prop))) return
            assert.ok(rule.parent.type === 'atrule' && rule.parent.params.includes('hover: hover') && rule.parent.params.includes('pointer: fine'), `${file}: hover sin limitar`)
        })
    }
})

test('Accesibilidad: foco visible y alternativa global de movimiento reducido', () => {
    const root = sheets.find(sheet => sheet.file === 'src/index.css').root
    let focus = false, reduced = false
    root.walkRules(rule => {
        if (rule.selector.includes(':focus-visible') && rule.nodes.some(node => node.prop === 'outline' && node.value !== 'none')) focus = true
    })
    root.walkAtRules('media', rule => {
        if (!rule.params.includes('prefers-reduced-motion: reduce')) return
        let animation = false, transition = false, scroll = false
        rule.walkDecls(decl => {
            if (decl.prop === 'animation' && decl.value === 'none') animation = true
            if (decl.prop === 'transition' && decl.value === 'none') transition = true
            if (decl.prop === 'scroll-behavior' && decl.value === 'auto') scroll = true
        })
        reduced = animation && transition && scroll
    })
    assert.ok(focus, 'Falta foco visible')
    assert.ok(reduced, 'Falta movimiento reducido')
})

test('Tipografía: todas las variables referenciadas están definidas', () => {
    const defined = new Set(), used = new Set()
    for (const {root} of sheets) root.walkDecls(decl => {
        if (decl.prop.startsWith('--')) defined.add(decl.prop)
        for (const match of decl.value.matchAll(/var\((--[\w-]+)/g)) used.add(match[1])
    })
    for (const variable of used) assert.ok(defined.has(variable), `Sin definir: ${variable}`)
})

test('Legibilidad: el footer no reduce el texto por debajo de .8rem y Explore usa texto claro', () => {
    const footer = sheets.find(sheet => sheet.file.endsWith('Footer.css')).root
    footer.walkRules(rule => {
        if (rule.selector !== '.social') return
        rule.walkDecls('font-size', decl => assert.ok(parseFloat(decl.value) >= .8))
    })
    const explore = sheets.find(sheet => sheet.file.endsWith('Explore.css')).root
    explore.walkRules(rule => {
        if (rule.selector !== '.box') return
        rule.walkDecls('color', decl => assert.equal(decl.value, 'var(--colorBase3)'))
    })
})
