import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'

// Handlers reales con fetch simulado: no toca la API ni datos remotos.
function provider(fetch) {
    const state = [], refs = []
    let stateIndex = 0, refIndex = 0
    const module = { exports: {} }
    const source = readFileSync(new URL('../src/components/Context/DesignersContext.jsx', import.meta.url), 'utf8')
    const { code } = transformSync(source, {
        loader: 'jsx', format: 'cjs', jsxFactory: 'element',
        define: { 'import.meta.env': '{"VITE_EXPRESS":"https://api.test"}' },
    })
    runInNewContext(code, {
        module, exports: module.exports, fetch, AbortController,
        console: { log() {}, error() {} },
        setTimeout() {}, clearTimeout() {}, localStorage: { login: 'true' },
        element: (type, props) => ({ type, props }),
        require: name => name === 'react' ? {
            createContext: () => ({ Provider: 'provider' }),
            useState: initial => {
                const i = stateIndex++
                if (!(i in state)) state[i] = initial
                return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value }]
            },
            useRef: () => { const i = refIndex++; return refs[i] || (refs[i] = { current: null }) },
            useEffect() {}, useCallback: fn => fn,
        } : name === 'react-router-dom' ? { useNavigate: () => () => {} } : {},
    })
    return {
        render() {
            stateIndex = 0; refIndex = 0
            return module.exports.DesignerProvider({}).props.value
        },
    }
}
function fillAdd(value) {
    const add = { reset() {} }
    for (const name of ['name', 'age', 'design', 'email']) add[name] = { value: 'test' }
    add.disponible = { checked: true }
    add.avatarRandom = { checked: false }
    value.formAdd.current = add
}

test('Añadir: la nueva card queda primera, en página 1 y marcada como new', async () => {
    const existing = [{ _id: 'old-1', name: 'Old' }, { _id: 'old-2', name: 'Old2' }]
    let posted = false
    const app = provider(async () => ({
        ok: true,
        json: async () => ({ data: posted ? [...existing, { _id: 'new-9', name: 'New' }] : existing }),
    }))
    let value = app.render()
    await value.getProfiles()
    value = app.render()
    fillAdd(value)
    // simular estar en la última página
    value.nextPage()
    posted = true
    await value.postProfiles({ preventDefault() {} })
    const state = app.render()
    assert.equal(state.profiles[0]._id, 'new-9', 'La nueva card debe estar primera')
    assert.equal(state.currentPage, 1, 'Debe saltar a la página 1')
    assert.equal(state.newId, 'new-9', 'Debe marcarse como new')
})

test('Añadir otra: el chip new se mueve a la última añadida (solo una)', async () => {
    let response = { _id: 'new-1', name: 'First' }
    const app = provider(async () => ({ ok: true, json: async () => ({ data: [{ _id: 'new-1', name: 'First' }] }) }))
    const value = app.render()
    fillAdd(value)
    await value.postProfiles({ preventDefault() {} })
    assert.equal(app.render().newId, 'new-1')
})