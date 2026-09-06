import { useContext, useEffect } from "react"
import { Cabecera } from "../Cabecera/Cabecera"
import { Footer } from "../Footer/Footer"
import './Explore.css'
import { DesignerContext } from "../Context/DesignersContext"
import { CarrouselDesigners } from "../CarrouselDesigners/CarrouselDesigners"

export const Explore = ()=>{

    const {profilesSaving, profiles, getProfiles, formPut, actProfiles, formAdd, postProfiles, modal, closeModal, editingId} = useContext(DesignerContext)

    useEffect(()=>{
        const controller = new AbortController()
        getProfiles(controller.signal)
        return ()=> controller.abort()
    },[getProfiles])

    // precargar el formulario de edicion cuando se abre el modal
    useEffect(()=>{
        if(modal !== 'edit' || !formPut.current || !editingId) return
        const {identificador, name, age, design, email, disponible, src} = formPut.current
        const find = profiles.find(profile => profile._id === editingId)
        if(!find) return
        identificador.value = find._id
        name.value = find.name
        age.value = find.age
        design.value = find.design
        email.value = find.email
        src.value = find.src || ''
        disponible.checked = find.disponible
        // eslint-disable-next-line react-hooks/exhaustive-deps -- precarga única al abrir el modal
    },[modal, editingId])

    return(
       <>
        <Cabecera/>

            <div className="explore-wrapper">

                <section className="explore-section">
                    <h2 className="section-h2">the designers</h2>
                    <p className="info-p">[+] browse the community · add or edit your card</p>
                </section>

                <CarrouselDesigners/>

            </div>

        {modal && (
            <div className="modal-backdrop" onClick={closeModal}>
                <div className="modal-card" role="dialog" aria-modal="true" aria-label={modal === 'add' ? 'Add your profile' : 'Edit your profile'} onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                        <span className="modal-title">{modal === 'add' ? '[+] add your profile' : '[x] edit your profile'}</span>
                        <button type="button" className="modal-close" aria-label="Close" onClick={closeModal}>[x]</button>
                    </div>
                    {modal === 'add' ? (
                        <form className="explore-form" ref={formAdd} onSubmit={postProfiles}>
                            <input className="box" type="text" name="name" aria-label="Name" disabled={profilesSaving} placeholder="name" required />
                            <input className="box" type="number" name="age" aria-label="Age" disabled={profilesSaving} placeholder="age" required />
                            <input className="box" type="text" name="design" aria-label="Design specialty" disabled={profilesSaving} placeholder="design" required />
                            <input className="box" type="email" name="email" aria-label="Email" disabled={profilesSaving} placeholder="email" required />
                            <input className="box" type="text" name="src" aria-label="Profile image path or URL" disabled={profilesSaving} placeholder="image src (optional)" />

                            <div className="check-box">
                                <input className="check" type="checkbox" id="disponibleAdd" name="disponible" disabled={profilesSaving} />
                                <label className="check" htmlFor="disponibleAdd">available for work</label>
                            </div>

                            <input className="submit" type="submit" value={profilesSaving ? "Saving…" : "Add profile"} disabled={profilesSaving} />
                        </form>
                    ) : (
                        <form className="explore-form" ref={formPut} onSubmit={actProfiles}>
                            <input className="box" type="text" name="identificador" aria-label="Profile ID" disabled={profilesSaving} placeholder="id" />
                            <input className="box" type="text" name="name" aria-label="Name" disabled={profilesSaving} placeholder="name" required />
                            <input className="box" type="number" name="age" aria-label="Age" disabled={profilesSaving} placeholder="age" required />
                            <input className="box" type="text" name="design" aria-label="Design specialty" disabled={profilesSaving} placeholder="design" required />
                            <input className="box" type="email" name="email" aria-label="Email" disabled={profilesSaving} placeholder="email" required />
                            <input className="box" type="text" name="src" aria-label="Profile image path or URL" disabled={profilesSaving} placeholder="image src (optional)" />

                            <div className="check-box">
                                <input className="check" type="checkbox" id="disponibleX" name="disponible" disabled={profilesSaving} />
                                <label className="check" htmlFor="disponibleX">available for work</label>
                            </div>

                            <input className="submit" type="submit" value={profilesSaving ? "Saving…" : "Save changes"} disabled={profilesSaving} />
                        </form>
                    )}
                </div>
            </div>
        )}

        <Footer/>
       </>
    )
}
