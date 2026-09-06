import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, globSync } from 'node:fs'
import postcss from 'postcss'

// Auditoría responsive: contratos de layout por breakpoint (no sustituye revisión visual)
const widths = [320, 375, 430, 640, 641, 768, 850, 851, 1024, 1100, 1101, 1440]
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

test('Móvil ≤768px: header compacto, sin desbordes horizontales', () => {
    for (const width of [320, 375, 430, 640, 768]) {
        const nav = styles('Cabecera/Cabecera.css', '.cabecera', width)
        assert.equal(nav.position, 'sticky')
        assert.ok(nav.width === '100%', 'header ocupa todo el ancho')
        const li = styles('Cabecera/Cabecera.css', '.cabecera-li', width)
        assert.equal(li['font-size'], '14px', 'links compactos en móvil')
    }
})

test('Móvil ≤640px: una columna en explore y auth, formularios apilados', () => {
    for (const width of [320, 375, 430, 640]) {
        assert.equal(styles('CarrouselDesigners/CarrouselDesigners.css', '.designers-grid', width)['grid-template-columns'], 'minmax(0, 1fr)')
        assert.equal(styles('Explore/Explore.css', '.explore-form', width)['grid-template-columns'], 'minmax(0, 1fr)')
        assert.equal(styles('Explore/Explore.css', '.section-h2', width)['font-size'], '28px')
        const footer = styles('Footer/Footer.css', '.footer-grid', width)
        assert.equal(footer['flex-flow'], 'column nowrap')
    }
    // auth apila desde 850
    for (const width of [320, 375, 640, 768, 850]) {
        assert.equal(styles('Login/Login.css', '.auth-shell', width)['grid-template-columns'], 'minmax(0, 1fr)')
    }
    // desktop mantiene dos columnas
    for (const width of [851, 1024, 1440]) {
        assert.equal(styles('Login/Login.css', '.auth-shell', width)['grid-template-columns'], 'minmax(0, 5fr) minmax(0, 7fr)')
    }
})

test('Grid de tarjetas: 4 / 2 / 1 columnas según ancho', () => {
    assert.equal(styles('CarrouselDesigners/CarrouselDesigners.css', '.designers-grid', 1440)['grid-template-columns'], 'repeat(4, minmax(0, 1fr))')
    assert.equal(styles('CarrouselDesigners/CarrouselDesigners.css', '.designers-grid', 1024)['grid-template-columns'], 'repeat(2, minmax(0, 1fr))')
    assert.equal(styles('CarrouselDesigners/CarrouselDesigners.css', '.designers-grid', 430)['grid-template-columns'], 'minmax(0, 1fr)')
})

test('Marquesina y hero: cero desbordes, CTA ancho completo en móvil', () => {
    for (const width of [320, 375, 640]) {
        assert.equal(styles('Home/Home.css', '.home-btn', width).width, '100%')
        assert.equal(styles('Home/Home.css', '.home-title', width)['font-size'], '28px')
    }
    const track = styles('CarrouselCards/CarrouselCards.css', '.marquee-track', 375)
    assert.match(track.animation, /marquee/)
})

test('Móvil: sin position absolute/fixed fuera del overlay y sin vh artificiales', () => {
    const files = globSync('src/**/*.css', { cwd: new URL('../', import.meta.url) })
    for (const file of files) {
        const css = postcss.parse(readFileSync(new URL('../' + file, import.meta.url), 'utf8'))
        css.walkRules(rule => {
            if (rule.selector === '.modal-backdrop') return // overlay permitido
            if (rule.selector.includes('::after') || rule.selector.includes('::before')) return // decoración interna
            for (let parent = rule.parent; parent; parent = parent.parent) {
                if (parent.type === 'atrule' && parent.params.includes('max-width')) return
            }
            rule.walkDecls(decl => {
                if (decl.prop === 'position') assert.ok(!['absolute'].includes(decl.value), `${file}: ${rule.selector} absolute fuera del overlay`)
                if (decl.prop === 'min-height' && decl.value.endsWith('vh')) {
                    assert.ok(parseFloat(decl.value) <= 100, `${file}: ${rule.selector} min-height ${decl.value}`)
                }
            })
        })
    }
})