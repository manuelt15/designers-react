import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import postcss from 'postcss'

test('Add card: visible sin hover (borde y texto con contraste propio)', () => {
    const css = postcss.parse(readFileSync(new URL('../src/components/CarrouselDesigners/CarrouselDesigners.css', import.meta.url), 'utf8'))
    let border = null, color = null, bg = null
    css.walkRules(rule => {
        if (rule.selector !== '.pagination-btn.ghost' || rule.parent.type === 'atrule') return
        rule.walkDecls(decl => {
            if (decl.prop === 'border') border = decl.value
            if (decl.prop === 'color') color = decl.value
            if (decl.prop === 'background') bg = decl.value
        })
    })
    assert.ok(border && border.includes('var(--ink)'), 'El botón ghost necesita borde visible por defecto')
    assert.equal(color, 'var(--ink)')
})

test('Feedback: cero SweetAlert en el contexto, notificación inline del sistema', () => {
    const ctx = readFileSync(new URL('../src/components/Context/DesignersContext.jsx', import.meta.url), 'utf8')
    assert.ok(!ctx.includes('Swal'), 'El contexto no debe usar SweetAlert2')
    assert.ok(!ctx.includes('sweetalert2'), 'El contexto no debe importar sweetalert2')
    // los handlers exponen estado de feedback en vez de abrir popups
    assert.match(ctx, /setNotice\(/, 'Debe existir setNotice para feedback inline')
})

test('Notice: la UI muestra overlay/toast propio y autoexpirable', () => {
    const css = postcss.parse(readFileSync(new URL('../src/components/Explore/Explore.css', import.meta.url), 'utf8'))
    let notice = false
    css.walkRules(rule => { if (rule.selector.includes('notice')) notice = true })
    assert.ok(notice, 'Faltan estilos .notice* en Explore.css')
    const src = readFileSync(new URL('../src/components/Explore/Explore.jsx', import.meta.url), 'utf8')
    assert.match(src, /notice/, 'Explore debe renderizar el notice')
})