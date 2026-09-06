import { NavLink } from 'react-router-dom'
import './Cabecera.css'
import { useContext } from 'react'
import { DesignerContext } from '../Context/DesignersContext'

// cabecera estilo OpenCode: wordmark de texto, enlaces mono y logout como icono
export const Cabecera = ()=>{

    const {logOut} = useContext(DesignerContext)

    return(
        <nav className="cabecera">
            <NavLink to="/home" className="cabecera-mark">designers_</NavLink>
            <ul className="cabecera-ul">
                <li className="cabecera-li"><NavLink to="/home">home</NavLink></li>
                <li className="cabecera-li"><NavLink to="/explore">explore</NavLink></li>
            </ul>
            <span
                className="cabecera-logout"
                role="button"
                tabIndex={0}
                aria-label="Log out"
                onClick={logOut}
                onKeyDown={e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); logOut() } }}
            >[x]</span>
        </nav>
    )
}
