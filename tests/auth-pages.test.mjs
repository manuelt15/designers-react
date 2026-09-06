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
            useEffect() {}, useRef: () => ({ current: {} }), useContext: () => value,
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

test('Login: una sola forma, sin Google y con enlace a la página de registro', () => {
    const tree = render('Login', 'Login/Login', { goodLogin: true, userNew: true, userExist: true, noUser: true, formLogin: { current: {} }, loginUser: () => {} })
    const forms = nodes(tree).filter(node => node.type === 'form')
    assert.equal(forms.length, 1, 'Login debe tener exactamente un formulario')
    const textAll = text(tree)
    assert.ok(!/google/i.test(textAll), 'No debe incluir Google')
    const link = nodes(tree).find(node => node.props.to === '/register')
    assert.ok(link, 'Falta enlace a /register')
    const inputs = nodes(tree).filter(node => node.type === 'input')
    for (const input of inputs) {
        if (input.props.type === 'submit') assert.equal(input.props.value, 'Sign in')
        else assert.ok(input.props['aria-label'])
    }
})

test('Register: página propia con su formulario y enlace de vuelta', () => {
    const tree = render('Register', 'Register/Register', { userNew: true, userExist: true, noUser: true, formRegister: { current: {} }, registerUser: () => {} })
    const forms = nodes(tree).filter(node => node.type === 'form')
    assert.equal(forms.length, 1)
    assert.ok(!/google/i.test(text(tree)))
    const link = nodes(tree).find(node => node.props.to === '/')
    assert.ok(link, 'Falta enlace de vuelta al login')
    const submit = nodes(tree).find(node => node.type === 'input' && node.props.type === 'submit')
    assert.equal(submit.props.value, 'Register')
    for (const input of nodes(tree).filter(node => node.type === 'input' && node.props.type !== 'submit')) {
        assert.ok(input.props['aria-label'])
    }
})

test('Estilo auth: tipografía mono, radios de 4px, cero sombras, panel oscuro único', () => {
    const css = postcss.parse(readFileSync(new URL('../src/components/Login/Login.css', import.meta.url), 'utf8'))
    const rules = []
    css.walkRules(rule => rules.push(rule))
    rules.forEach(rule => rule.walkDecls(decl => {
        if (decl.prop === 'box-shadow') assert.fail('auth no usa sombras')
    }))
    const mono = rules.filter(rule => rule.selector === '.auth-form' || rule.selector === '.auth-page')
    assert.ok(mono.length > 0, 'Faltan estilos .auth-*')
    let monoCount = 0, radius = 0, dark = 0
    rules.forEach(rule => rule.walkDecls(decl => {
        if (decl.prop === 'font-family') assert.match(decl.value, /--fontMono/)
        if (decl.prop === 'font-family') monoCount++
        if (decl.prop === 'border-radius') assert.ok(['4px', '9999px'].includes(decl.value), `radio no permitido: ${decl.value}`)
        if (decl.prop === 'border-radius') radius++
        if (decl.prop === 'background' && decl.value === 'var(--surfaceDark)') dark++
    }))
    assert.equal(dark, 1, 'El panel oscuro debe aparecer exactamente una vez')
})

test('Tokens: el sistema OpenCode está definido en index.css', () => {
    const css = postcss.parse(readFileSync(new URL('../src/index.css', import.meta.url), 'utf8'))
    const defined = new Set()
    css.walkDecls(decl => { if (decl.prop.startsWith('--')) defined.add(decl.prop) })
    for (const token of ['--fontMono', '--ink', '--canvas', '--surfaceSoft', '--surfaceCard', '--surfaceDark', '--surfaceDarkElevated', '--hairline', '--hairlineStrong', '--accent', '--danger', '--warning', '--success']) {
        assert.ok(defined.has(token), `Falta token ${token}`)
    }
})