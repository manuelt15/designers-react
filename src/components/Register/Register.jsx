import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../Login/Login.css'
import { DesignerContext } from '../Context/DesignersContext'

// pagina de registro (mismo sistema visual que el login)
export const Register = ()=>{

    const {formRegister, registerUser, userNew, userExist, noUser, navigate} = useContext(DesignerContext)

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
                    <p className="auth-prompt">~ designers <span className="cmd">--register</span></p>
                    <p className="auth-hints">for designers · and yes, also for you</p>
                </aside>
                <form className="auth-form" ref={formRegister} onSubmit={registerUser}>
                    <h1 className="auth-title">Create an account</h1>
                    <p className="auth-alt">or <Link to="/">sign in</Link></p>
                    <input className="auth-input" type="text" name="username" aria-label="Username" autoComplete="username" placeholder="username" />
                    <input className="auth-input" type="password" name="password" aria-label="Password" autoComplete="new-password" placeholder="password" />
                    {!userNew && <p className="auth-msg ok">[+] Account created — sign in now</p>}
                    {!userExist && <p className="auth-msg">[x] User already exists</p>}
                    {!noUser && <p className="auth-msg">[x] Missing username or password</p>}
                    <input className="auth-submit" type="submit" value="Register" />
                    <p className="auth-note">Free forever. Your profile, your style.</p>
                </form>
            </div>
        </main>
    )
}
