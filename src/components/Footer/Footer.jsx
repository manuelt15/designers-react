import { useContext } from 'react'
import './Footer.css'
import { DesignerContext } from '../Context/DesignersContext'

// componente del footer
export const Footer = ()=>{

    return(
        <>
        <footer className="footer">

            <div className="footer-wrapper-one">
                <div className="footer-logo">NOT FOR DESIGNERS..</div>

                <div className="footer-wrapper-inside">
                    <div className="info">
                        <div className="social">EXPLORE</div>
                        <div className="social">FAQ</div>
                        <div className="social">ALWAYS DESIGN</div>
                    </div>    
                </div>

                <div className="footer-wrapper-inside">
                    <div className="info">
                        <div className="social tittle">FOLLOW</div>
                        <a href="https://www.instagram.com/manueltorres._/?igsh=MW5mazc0ejVhMjJq&utm_source=qr#" className="social">INTAGRAM</a>
                        <a href="https://www.linkedin.com/in/manueltorrespro/" className="social">LINKEDIN</a>
                    </div>    
                </div>    
            </div>
           
        </footer>
        </>
    )
}