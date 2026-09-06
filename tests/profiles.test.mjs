import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'

// Handlers reales, hooks y respuestas HTTP simulados: no toca la API ni datos remotos.
function provider(fetch) {
    const state = [], refs = [], alerts = []
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
        setTimeout() {}, localStorage: { login: 'true' },
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
        } : name === 'react-router-dom' ? { useNavigate: () => () => {} } : { fire: options => alerts.push(options) },
    })
    return {
        alerts,
        render() {
            stateIndex = 0; refIndex = 0
            return module.exports.DesignerProvider({}).props.value
        },
    }
}

for (const kind of ['network', 'http', 'invalid']) {
    test(`Profiles: error ${kind} queda visible y no mueve el carrusel`, async () => {
        const app = provider(async () => {
            if (kind === 'network') throw new Error('Offline')
            return { ok: kind !== 'http', json: async () => ({ data: kind === 'invalid' ? null : [] }) }
        })
        await app.render().getProfiles()
        const value = app.render()
        assert.ok(value.profilesError)
        assert.equal(value.profilesLoading, false)
        assert.equal(value.contador, 0)
        assert.ok(Array.isArray(value.profiles))
    })
}

test('Profiles: carga pendiente y recuperación tras un error', async () => {
    let resolve, fail = true
    const app = provider(() => fail ? Promise.reject(new Error('Offline')) : new Promise(done => { resolve = done }))
    await app.render().getProfiles()
    fail = false
    const request = app.render().getProfiles()
    assert.equal(app.render().profilesLoading, true)
    resolve({ ok: true, json: async () => ({ data: [{ _id: 'test-profile' }] }) })
    await request
    assert.equal(app.render().profilesLoading, false)
    assert.equal(app.render().profilesError, '')
    assert.equal(app.render().profiles[0]._id, 'test-profile')
})

function fillForms(value) {
    const fields = { reset() {} }
    for (const name of ['identificador', 'name', 'age', 'design', 'email', 'src']) fields[name] = { value: 'test' }
    fields.disponible = { checked: true }
    value.formPut.current = fields
    value.formAdd.current = fields
}

for (const action of ['postProfiles', 'actProfiles', 'deleteProfiles']) {
    test(`${action}: un error HTTP no se anuncia como éxito`, async () => {
        const app = provider(async () => ({ ok: false, json: async () => ({ data: [] }) }))
        const value = app.render()
        fillForms(value)
        await value[action](action === 'deleteProfiles' ? 'one' : { preventDefault() {} })
        assert.equal(app.alerts.at(-1).icon, 'error')
        assert.equal(app.render().profilesSaving, false)
    })
}

test('Profiles: borrar la última tarjeta de una página vuelve a una página válida', async () => {
    const data = Array.from({length: 5}, (_, i) => ({_id: String(i)}))
    const app = provider(async () => ({ok: true, json: async () => ({data})}))
    await app.render().getProfiles()
    app.render().nextPage()
    assert.equal(app.render().currentPage, 2)
    await app.render().deleteProfiles('4')
    assert.equal(app.render().profiles.length, 4)
    assert.equal(app.render().currentPage, 1)
})

test('Profiles: el guardado indica pendiente y bloquea envíos duplicados', async () => {
    let resolve, calls = 0
    const app = provider(() => { calls++; return new Promise(done => { resolve = done }) })
    const value = app.render()
    fillForms(value)
    const request = value.postProfiles({preventDefault() {}})
    assert.equal(app.render().profilesSaving, true)
    await value.postProfiles({preventDefault() {}})
    assert.equal(calls, 1)
    resolve({ok: true, json: async () => ({data: []})})
    await request
    assert.equal(app.render().profilesSaving, false)
    assert.equal(app.alerts.at(-1).icon, 'success')
})

test('Profiles: recargar una lista más corta mantiene una página válida', async () => {
    let data = Array.from({length: 5}, (_, i) => ({_id: String(i)}))
    const app = provider(async () => ({ok: true, json: async () => ({data})}))
    await app.render().getProfiles()
    app.render().nextPage()
    data = data.slice(0, 4)
    await app.render().getProfiles()
    assert.equal(app.render().currentPage, 1)
})

test('Profiles: una carga cancelada no sobrescribe una respuesta posterior', async () => {
    const pending = []
    const app = provider(() => new Promise(resolve => pending.push(resolve)))
    const controller = new AbortController()
    const first = app.render().getProfiles(controller.signal)
    controller.abort()
    const second = app.render().getProfiles()
    pending[1]({ok: true, json: async () => ({data: [{_id: 'new'}]})})
    await second
    pending[0]({ok: true, json: async () => ({data: [{_id: 'old'}]})})
    await first
    assert.equal(app.render().profiles[0]._id, 'new')
    assert.equal(app.render().profilesLoading, false)
})
