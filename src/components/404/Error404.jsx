import './Error404.css'
import {NavLink} from 'react-router-dom'

// componente para la pagina de error 404

export const Error404 = ()=>{

    return(
        <>
            <div className="e404">
                <img src="/star.webp" alt="" className="e404-star" />
                <div className="e404-msj">
                    <div className="e404-number">404</div>
                    <div className="page-not">The page you were lookin for does not exist</div>
                    <button className="e404-btn"><NavLink to={'/home'}>Back home</NavLink></button>
                </div>
            </div>
        </>
    )
}