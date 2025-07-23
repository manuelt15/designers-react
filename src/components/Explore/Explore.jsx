import { useContext, useEffect } from "react"
import { Cabecera } from "../Cabecera/Cabecera"
import { Footer } from "../Footer/Footer"
import './Explore.css'
import { DesignerContext } from "../Context/DesignersContext"
import { CarrouselDesigners } from "../CarrouselDesigners/CarrouselDesigners"

// componente de explore
export const Explore = ()=>{

    // importamos elementos del contexto
    const {getProfiles ,profiles , formPut ,actProfiles ,formAdd , postProfiles} = useContext(DesignerContext)

    // effect para profiles
    useEffect(()=>{
        getProfiles()
    },[])

    return(
       <>
        <Cabecera/>

            <div className="explore-wrapper">
                <img src="/fondoF.jpg" alt="fondo" className="explore-img" />

                <section className="explore-section">
                    <h2 className="section-h2">Meet the Designers Behind Our App — Discover the Creative Minds Shaping Your Experience</h2>
                        <div className="section-info">
                            <p className="info-p">Create your personal info card to highlight your skills — or edit your existing one anytime.</p>
                        </div>
                </section>

        <CarrouselDesigners/>

                <div className="forms">
                    <h2>Edit your profile</h2>
                <form  className="explore-form" ref={formPut} onSubmit={actProfiles} >
                    <input className="box" type="text" name="identificador" placeholder="id" />
                    <input className="box" type="text" name="name" placeholder="name"/>
                    <input className="box" type="number" name="age" placeholder="age"/>
                    <input className="box"type="text" name="design" placeholder="design"/>
                    <input className="box" type="text" name="email" placeholder="email"/>
                    <input className="box" type="text" name="src" placeholder="src" />

                    <div className="check-box">
                    <input className="check" type="checkbox" id="disponibleX" name="disponible" />
                    <label className="check" htmlFor="disponibleX">Select if available</label>
                    </div>

                    <input className="submit" type="submit" />
                </form>
                    
                    <h2>Add your profile</h2>
                <form className="explore-form" ref={formAdd} onSubmit={postProfiles}>
                    <input className="box" type="text" name="name" placeholder="name"/>
                    <input className="box" type="number" name="age" placeholder="age"/>
                    <input className="box"  type="text" name="design" placeholder="design"/>
                    <input className="box" type="text" name="email" placeholder="email"/>
                    <input className="box" type="text" name="src" placeholder="src" />

                   <div className="check-box">
                   <input className="check" type="checkbox" id="disponibleAdd" name="disponible" />
                   <label className="check" htmlFor="disponibleAdd">Select if available</label>
                   </div>

                    <input className="submit" type="submit" />

                </form>
                </div>
            </div>

        <Footer/>
       </>
    )
}