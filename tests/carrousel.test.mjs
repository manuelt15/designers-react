import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'

const source = readFileSync(new URL('../src/components/CarrouselCards/CarrouselCards.jsx', import.meta.url), 'utf8')
const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsxFactory: 'element' })

// Prueba unitaria del componente real con dobles de hooks y geometría DOM.
// No verifica el renderizado, el scroll nativo ni las medidas en un navegador.
function render(track) {
    const module = { exports: {} }
    runInNewContext(code, {
        module,
        exports: module.exports,
        require: name => name === 'react' ? {
            useRef: () => ({ current: track }),
            useContext: () => ({ next() {}, prev() {}, contador: 0 }),
        } : {},
        element: (type, props, ...children) => ({ type, props, children: children.flat() }),
    })
    return module.exports.CarrouselCards()
}

test('Carrusel: conserva el retorno al inicio/final en los extremos', () => {
    const calls = []
    const track = {
        children: [{ offsetLeft: 0 }, { offsetLeft: 216 }],
        scrollWidth: 1712,
        clientWidth: 800,
        scrollLeft: 912,
        scrollTo: options => calls.push(options.left),
        scrollBy() {},
    }
    const buttons = render(track).children.filter(child => child.type === 'button')
    buttons.find(button => button.children.includes('Next')).props.onClick()
    track.scrollLeft = 0
    buttons.find(button => button.children.includes('Prev')).props.onClick()
    assert.deepEqual(calls, [0, 912])
})

for (const step of [146, 196, 216, 316]) {
    test(`Carrusel: Next/Prev desplazan la distancia real de ${step}px`, () => {
        const calls = []
        const track = {
            children: [{ offsetLeft: 16 }, { offsetLeft: 16 + step }],
            scrollBy: options => calls.push(options.left),
        }
        const tree = render(track)
        const buttons = tree.children.filter(child => child.type === 'button')
        buttons.find(button => button.children.includes('Next')).props.onClick()
        buttons.find(button => button.children.includes('Prev')).props.onClick()
        assert.deepEqual(calls, [step, -step])
        const cards = tree.children.find(child => child.props?.className === 'card-wrapper')
        assert.equal(cards.children.length, 8)
        assert.equal(cards.props.style?.transform, undefined)
    })
}
