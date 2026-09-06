import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import postcss from 'postcss'

// Contratos CSS: no sustituyen una comprobación visual del layout.
const widths = [320, 375, 430, 540, 768, 820, 821, 912, 1024, 1280, 1440, 1920]
const root = new URL('../src/components/', import.meta.url)

function styles(file, selector, width) {
    const css = postcss.parse(readFileSync(new URL(file, root), 'utf8'))
    const result = {}
    css.walkRules(rule => {
        if (!rule.selectors.includes(selector)) return
        for (let parent = rule.parent; parent; parent = parent.parent) {
            if (parent.type !== 'atrule') continue
            if (parent.name !== 'media') return
            const match = parent.params.match(/^\((max|min)-width:\s*(\d+)px\)$/)
            if (!match) return
            if (match[1] === 'max' ? width > Number(match[2]) : width < Number(match[2])) return
        }
        rule.walkDecls(decl => { result[decl.prop] = decl.value })
    })
    return result
}

function assertInFlow(style, message) {
    assert.ok(!['absolute', 'fixed'].includes(style.position), message)
}

test('Explore: campos encogibles, columnas coherentes y textos largos ajustables', () => {
    for (const width of widths) {
        const form = styles('Explore/Explore.css', '.explore-form', width)
        assert.equal(form['grid-template-columns'], width <= 600 ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))')
        assert.equal(styles('Explore/Explore.css', '.box', width)['min-width'], '0')
        assert.equal(styles('CarrouselDesigners/CarrouselDesigners.css', '.field', width)['overflow-wrap'], 'anywhere')
        assert.equal(styles('CarrouselDesigners/CarrouselDesigners.css', '.designers-grid', width).margin, undefined)
    }
})

test('Home: texto y botón permanecen en flujo, sin alturas artificiales', () => {
    for (const width of widths) {
        for (const selector of ['.home-logo', '.app-explained', '.home-btn']) {
            assertInFlow(styles('Home/Home.css', selector, width), `${selector} fuera de flujo a ${width}px`)
        }
        const height = styles('Home/Home.css', '.home-wrapper', width)['min-height']
        assert.ok(!height?.endsWith('vh') || parseFloat(height) <= 100, `Altura artificial: ${height}`)
    }
})

test('Login: formularios y mensajes reservan espacio en todos los breakpoints', () => {
    for (const width of widths) {
        for (const selector of ['.form-login-wrapper', '.form-register-wrapper', '.mensaje-welcome']) {
            assertInFlow(styles('Login/Login.css', selector, width), `${selector} fuera de flujo a ${width}px`)
        }
        const height = styles('Login/Login.css', '.inicio', width)['min-height']
        assert.ok(!height?.endsWith('vh') || parseFloat(height) <= 100, `Altura artificial: ${height}`)
    }
})
