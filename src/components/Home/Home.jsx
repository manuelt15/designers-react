import { Cabecera } from "../Cabecera/Cabecera"
import {NavLink} from 'react-router-dom'
import './Home.css'
import { Footer } from "../Footer/Footer"
import { CarrouselCards } from "../CarrouselCards/CarrouselCards"


// home estilo OpenCode: hero TUI oscuro único, secciones hairline, todo mono
export const Home = ()=>{

    return(
        <>
            <Cabecera/>

            <div className="home-wrapper">

                <section className="home-hero">
                    <p className="home-badge">[ news ] open for designers</p>
                    <h1 className="home-title">Not for designers<br/>[ but yes ]</h1>
                    <p className="home-idea">A space for designers. We bring together creatives from all areas of design to inspire, connect, and collaborate. Discover talent, showcase your work, or update your profile.</p>
                    <div className="home-prompt">
                        <span className="home-prompt-line">~ designers <span className="cmd">explore --all</span></span>
                        <span className="home-hints">not for designers [ but yes ]</span>
                    </div>
                    <NavLink className="home-btn" to={'/explore'}>explore designers →</NavLink>
                </section>

                <section className="home-section">
                    <h2 className="home-h2">what you will find</h2>
                    <CarrouselCards/>
                </section>

            </div>

            <Footer/>
        </>
    )
}
