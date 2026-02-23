import { useContext } from 'react'
import './CarrouselDesigners.css'
import { DesignerContext } from '../Context/DesignersContext'

export const CarrouselDesigners = ()=> {

const { profiles , putProfiles , deleteProfiles, currentPage, nextPage, prevPage, itemsPerPage } = useContext(DesignerContext)

const indexLast = currentPage * itemsPerPage
const indexFirst = indexLast - itemsPerPage
const currentProfiles = profiles.slice(indexFirst, indexLast)
const totalPages = Math.ceil(profiles.length / itemsPerPage)

    return(
            <>
                <div className="explore-designers">
                    {profiles.length === 0 ? (<p>No profiles found</p>) : currentProfiles.map(profile =>
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

                <div className="pagination-container">
                    <button 
                        className="pagination-btn prev" 
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="pagination-info">{currentPage} / {totalPages}</span>
                    <button 
                        className="pagination-btn next" 
                        onClick={nextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                </div>
            </>
    )
}
