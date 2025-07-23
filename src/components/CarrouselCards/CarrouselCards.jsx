import { useContext, useState } from 'react'
import './CarrouselCards.css'
import { DesignerContext } from '../Context/DesignersContext'

// componente de cards
export const CarrouselCards = ()=>{

    // exportamos elementos del constexto
  const {next , prev, contador} = useContext(DesignerContext)

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
        
    return(
        <div className="card-carrousel">
            <div className="card-wrapper"style={{
                width: `${info.length * 100 / 5}%`,
                gridTemplateColumns: `repeat(${info.length} , 1fr)`,
                transform: `TranslateX(-${(100 / info.length) * contador}%)`
            }} >
                {info?.map(inf =>
                    <div key={inf._id} {...inf} className="card">
                        <img src="/star.webp" alt="star" className="card-img" /> 
                        <span key={inf._id} className="card-info">{inf.info}</span>
                    </div>
                )}
            </div>
            <button className='card-btn next' onClick={next}>Next</button>
            <button className='card-btn prev' onClick={prev}>Prev</button>
        </div>
    )
}