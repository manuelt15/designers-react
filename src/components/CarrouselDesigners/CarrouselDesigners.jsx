import { useContext } from 'react'
import './CarrouselDesigners.css'
import { DesignerContext } from '../Context/DesignersContext'

// componente de designers
export const CarrouselDesigners = ()=> {

    // importamos elementos del contexto
const { profiles , putProfiles , deleteProfiles} = useContext(DesignerContext)


    return(
            <>
                <div className="explore-designers">
                    {profiles.length === 0 ? (<p>No profiles found</p>) : profiles?.map(profile =>
                        <div key={profile._id} {...profile} className="designers-card">
                        <div className="designers-info"> 
                            <img src={profile.src || "/default.jpg"} alt="avatar" className="designers-img" />                           
                            <div className="designers-data">
                             <div className="name">{profile.name}</div>   
                             <div className="name">{profile.age} years</div>   
                             <div className="name">{profile.design}</div>   
                             <div className="name">{profile.email}</div>   
                             <div className="name disp">{profile.disponible ? 'Active ✅' : 'Busy ❌'}</div>  
                            </div>
                        </div>
                        <div className="designer-btn">
                            <button className="card-modify upd" onClick={()=> putProfiles(profile._id)}>Update</button>
                            <button className="card-modify del" onClick={()=> deleteProfiles(profile._id)}>Delete</button>
                        </div>
                    </div>
                    )}
                </div>
            </>
    )
}