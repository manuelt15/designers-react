import { Link } from 'react-router-dom'
import './Error404.css'

// pagina 404 estilo OpenCode: mono, crema, marcador ASCII
export const Error404 = ()=>{

    return(
        <main className="e404">
            <pre className="e404-art" aria-hidden="true">█▄░█ █░░ █▀▀▄ █▀▀ █▀▀█ █▀▀
█░▀█ █░░ █▄▄▀ ██▄ █░░█ ▀▀▀</pre>
            <h1 className="e404-number">[x] 404</h1>
            <p className="e404-msg">the page you were looking for does not exist</p>
            <Link className="e404-btn" to="/home">← back home</Link>
        </main>
    )
}
