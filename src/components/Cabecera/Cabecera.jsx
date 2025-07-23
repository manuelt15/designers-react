import { NavLink } from 'react-router-dom'
import './Cabecera.css'
import { useContext } from 'react'
import { DesignerContext } from '../Context/DesignersContext'

// componente de la cabacera
export const Cabecera = ()=>{

    // importamos elementos del contexto
    const {logOut} = useContext(DesignerContext)


    return(
        <nav className='cabecera'>
            <img src="/logo.png" alt="logo" className="logo-cabecera" />
            <ul className="cabecera-ul">
            <li className="cabecera-li"><NavLink to="/home">Home</NavLink></li>
            <li className="cabecera-li"><NavLink to="/explore">Explore</NavLink></li>
            </ul>
            <button className="button-cabecera" onClick={logOut}>Log out</button> 
        </nav>
    )
}