import { useRef } from 'react'
import './CarrouselCards.css'

// componente de cards
export const CarrouselCards = ()=>{

    const cards = useRef()

    const scrollCards = (direction)=>{
        const track = cards.current
        const end = track.scrollWidth - track.clientWidth
        if(direction > 0 && track.scrollLeft >= end - 1){
            track.scrollTo({left: 0})
            return
        }
        if(direction < 0 && track.scrollLeft <= 1){
            track.scrollTo({left: end})
            return
        }
        const step = track.children[1].offsetLeft - track.children[0].offsetLeft
        track.scrollBy({left: direction * step})
    }

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
            <div className="card-wrapper" ref={cards} tabIndex={0} role="region" aria-label="Design categories">
                {info?.map(inf =>
                    <div key={inf._id} className="card">
                        <img src="/star.webp" alt="star" className="card-img" /> 
                        <span key={inf._id} className="card-info">{inf.info}</span>
                    </div>
                )}
            </div>
            <button className='card-btn next' onClick={()=> scrollCards(1)}>Next</button>
            <button className='card-btn prev' onClick={()=> scrollCards(-1)}>Prev</button>
        </div>
    )
}