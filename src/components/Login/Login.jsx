import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { DesignerContext } from '../Context/DesignersContext'

// pagina de login (sistema OpenCode: mono, crema, panel oscuro unico)
export const Login = ()=>{

    const {formLogin, loginUser, goodLogin, navigate} = useContext(DesignerContext)

    useEffect(()=>{
        if(localStorage.login){
            navigate('/home')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- una sola comprobación al montar
    },[])

    return(
        <main className="auth-page">
            <div className="auth-shell">
                <aside className="auth-panel" aria-hidden="true">
                    <pre className="auth-wordmark">█▄░█ █▀▀ █▀▀▄
█░▀█ ██▄ █▄▄▀</pre>
                    <p className="auth-prompt">~ designers <span className="cmd">--explore</span></p>
                    <p className="auth-hints">for designers · and yes, also for you</p>
                </aside>
                <form className="auth-form" ref={formLogin} onSubmit={loginUser}>
                    <h1 className="auth-title">Sign in</h1>
                    <p className="auth-alt">or <Link to="/register">create an account</Link></p>
                    <input className="auth-input" type="text" name="username" aria-label="Username" autoComplete="username" placeholder="username" />
                    <input className="auth-input" type="password" name="password" aria-label="Password" autoComplete="current-password" placeholder="password" />
                    {!goodLogin && <p className="auth-msg">[x] Failed login — try again</p>}
                    <input className="auth-submit" type="submit" value="Sign in" />
                    <p className="auth-note">Not for designers [ but yes ]. Get inspired, find your style.</p>
                </form>
            </div>
        </main>
    )
}
