import { useContext } from 'react'
import './CarrouselDesigners.css'
import { DesignerContext } from '../Context/DesignersContext'

// avatares disponibles; los src que ya no existan caen a un avatar aleatorio determinístico por id
const AVATARS = ['/avatar-1.png', '/avatar-2.png', '/avatar-3.png', '/avatar-4.png']
const KNOWN = new Set([...AVATARS, '/default.jpg'])
const hash = str => [...str].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0)
const resolveAvatar = profile => {
    const src = profile.src || '/default.jpg'
    if (KNOWN.has(src)) return src
    return AVATARS[hash(profile._id || profile.name || 'x') % AVATARS.length]
}

export const CarrouselDesigners = ()=> {

const { profilesLoading, profilesError, profilesSaving, getProfiles, profiles, putProfiles, deleteProfiles, currentPage, nextPage, prevPage, itemsPerPage, setModal, newId } = useContext(DesignerContext)

if(profilesLoading) return <p className="explore-status" role="status">Loading profiles…</p>
if(profilesError) return (
    <div className="explore-status" role="alert">
        <p>[x] {profilesError}</p>
        <button className="pagination-btn" onClick={()=> getProfiles()}>try again</button>
    </div>
)

const indexLast = currentPage * itemsPerPage
const indexFirst = indexLast - itemsPerPage
const currentProfiles = profiles.slice(indexFirst, indexLast)
const totalPages = Math.ceil(profiles.length / itemsPerPage)

    return(
            <>
                {profiles.length === 0 && <p className="explore-status" role="status">no profiles yet — add the first one</p>}
                {profiles.length > 0 && (
                <div className="designers-grid">
                    {currentProfiles.map(profile =>
                        <article key={profile._id} className={`designers-card${profile._id === newId ? ' is-new' : ''}`}>
                            {profile._id === newId && <span className="new-chip" role="status">new</span>}
                            <img src={resolveAvatar(profile)} alt={`avatar of ${profile.name}`} className="designers-img" />
                            <div className="designers-data">
                                <span className="field name">{profile.name}</span>
                                <span className="field">{profile.age} yrs</span>
                                <span className="field">{profile.design}</span>
                                <span className="field mail">{profile.email}</span>
                                <span className={`field disp ${profile.disponible ? 'on' : 'off'}`}>{profile.disponible ? '[+] active' : '[-] busy'}</span>
                            </div>
                            <div className="designer-btn">
                                <button className="card-modify upd" disabled={profilesSaving} onClick={()=> putProfiles(profile._id)}>update</button>
                                <button className="card-modify del" disabled={profilesSaving} onClick={()=> deleteProfiles(profile._id)}>delete</button>
                            </div>
                        </article>
                    )}
                </div>
                )}

                <div className="explore-actions">
                    <button type="button" className="pagination-btn ghost" onClick={()=> setModal('add')}>[+] add your card</button>
                </div>

                {profiles.length > 0 && (
                <div className="pagination-container">
                    <button
                        className="pagination-btn prev"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        ← prev
                    </button>
                    <span className="pagination-info">{currentPage} / {totalPages}</span>
                    <button
                        className="pagination-btn next"
                        onClick={nextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        next →
                    </button>
                </div>
                )}
            </>
    )
}
