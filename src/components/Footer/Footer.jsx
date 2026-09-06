import './Footer.css'

// footer estilo OpenCode: filas mono, marcadores ASCII, hairlines
export const Footer = ()=>{

    return(
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-row">
                    <span className="footer-mark">[+]</span>
                    <span className="footer-label">not for designers_</span>
                </div>
                <div className="footer-row">
                    <span className="footer-mark">[+]</span>
                    <a className="footer-link" href="https://www.instagram.com/manueltorres._/?igsh=MW5mazc0ejVhMjJq&utm_source=qr#">instagram</a>
                </div>
                <div className="footer-row">
                    <span className="footer-mark">[+]</span>
                    <a className="footer-link" href="https://www.linkedin.com/in/manueltorrespro/">linkedin</a>
                </div>
            </div>
            <div className="footer-legal">
                <span>© 2026 not for designers</span>
                <span>made in madrid</span>
            </div>
        </footer>
    )
}
