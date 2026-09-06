import { useContext } from 'react'
import './CarrouselDesigners.css'
import { DesignerContext } from '../Context/DesignersContext'

export const CarrouselDesigners = ()=> {

const { profilesLoading, profilesError, profilesSaving, getProfiles, profiles , putProfiles , deleteProfiles, currentPage, nextPage, prevPage, itemsPerPage } = useContext(DesignerContext)

if(profilesLoading) return <p className="explore-status" role="status">Loading profiles…</p>
if(profilesError) return (
    <div className="explore-status" role="alert">
        <p>{profilesError}</p>
        <button className="pagination-btn" onClick={()=> getProfiles()}>Try again</button>
    </div>
)
if(profiles.length === 0) return <p className="explore-status" role="status">No profiles found</p>

const indexLast = currentPage * itemsPerPage
const indexFirst = indexLast - itemsPerPage
const currentProfiles = profiles.slice(indexFirst, indexLast)
const totalPages = Math.ceil(profiles.length / itemsPerPage)

    return(
            <>
                <div className="explore-designers">
                    {currentProfiles.map(profile =>
                        <div key={profile._id} className="designers-card">
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
                            <button className="card-modify upd" disabled={profilesSaving} onClick={()=> putProfiles(profile._id)}>Update</button>
                            <button className="card-modify del" disabled={profilesSaving} onClick={()=> deleteProfiles(profile._id)}>Delete</button>
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
