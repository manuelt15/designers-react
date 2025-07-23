import { Cabecera } from "../Cabecera/Cabecera"
import {NavLink} from 'react-router-dom'
import './Home.css'
import { Footer } from "../Footer/Footer"
import { CarrouselCards } from "../CarrouselCards/CarrouselCards"


// componente de home
export const Home = ()=>{

    return(
        <>
            <Cabecera/>

            <div className="home-wrapper">
                <img src="/fondoF.jpg" alt=""className="fondo-home" />
                <img src="/logo.png" alt="logo" className="home-logo" />    
                <div className="app-explained">
                    <p className="app-idea">Not for designers [ but yes ] is —ironically— a space for designers. We bring together creatives from all areas of design to inspire, connect, and collaborate. Here, you can discover talent, showcase your work, or update your profile. We're not your typical designer platform... but yes, we kind of are.</p>
                </div>
                
                <button className="home-btn"><NavLink to={'/explore'}>Explore Designers</NavLink></button>

                <CarrouselCards/>
            </div> 

            <Footer/>
        </>
    )
}

