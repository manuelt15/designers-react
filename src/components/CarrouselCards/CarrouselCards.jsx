import './CarrouselCards.css'

// marquesina de categorias estilo OpenCode: cinta continua con separadores ASCII
export const CarrouselCards = ()=>{

    // array para informacion de las cards
    const info = [
        {_id: 0, info: 'Fullstack' },
        {_id: 1, info: 'Ai Artists'},
        {_id: 2, info: 'Photography'},
        {_id: 3, info: 'UX UI'},
        {_id: 4, info: 'Local Artists'},
        {_id: 5, info: 'Art Directors'},
        {_id: 6, info: 'Front-end'},
        {_id: 7, info: 'And more'},
    ]

    const strip = items => (
        <div className="marquee-group" aria-hidden={items === info || undefined}>
            {items.map(item => (
                <span key={item._id} className="marquee-item">
                    <span className="marquee-mark">[+]</span> {item.info}
                </span>
            ))}
        </div>
    )

    return(
        <div className="marquee" role="region" aria-label="Design categories">
            <div className="marquee-track">
                {strip(info)}
                {strip(info)}
            </div>
        </div>
    )
}
