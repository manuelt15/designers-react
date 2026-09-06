import { useContext, useEffect } from 'react'
import './Login.css'
import { DesignerContext } from '../Context/DesignersContext'

// componente del login
export const Login = ()=>{

    // importamos elementos del contexto
    const {formLogin , loginUser,  goodLogin ,setGoodLoging, userNew, setUserNew, registerUser, userExist, setUserExist, formRegister , navigate , noUser} = useContext(DesignerContext)

    // effect para login
    useEffect(()=>{
        if(localStorage.login){
            navigate('/home')
        }
    },[])

    return(
        <>
         <div className="inicio">
            <img src="/logo.png" alt="" className="logo" />
            <img src="/fondoF.jpg" alt="fondo" className="fondo-inicio" />
            <div className="form-login-wrapper">
                <span className="form-span">Welcome!</span>
                <form className='login-form' ref={formLogin} onSubmit={loginUser}>
                <h2 className="form-h2">Login to your account</h2>
                <input className='form-box' type="text" name="username" aria-label="Username" autoComplete="username" placeholder="username" />
                <input className='form-box' type="password" name="password" aria-label="Password" autoComplete="current-password" placeholder="password"/>
                <input className='submit' type="submit" value="Login"/>
                </form>
                {!goodLogin && <div className="message-container red">
                            <p className="form-h3">Failed login 😢</p>
                            <p className="form-h3">Try again</p>
                        </div> }
                <div className="app">
                <img src="/appStore.png" alt="logo-app" />
                <img src="/googlePlay.png" alt="logo-app" />
                </div>
            </div>
        <div className="form-register-wrapper">
            <span className="form-span">First time?</span>
            <form className='login-form'ref={formRegister} onSubmit={registerUser}>
                <h2 className="form-h2">Register now for free</h2>
                <input className='form-box' type="text" name="username" aria-label="Username" autoComplete="username" placeholder="username" />
                <input className='form-box' type="password" name="password" aria-label="Password" autoComplete="new-password" placeholder="password" />
                <input className='submit' type="submit" value="Register" />
            </form>
            {!userNew && <div className="message-container">
                            <p className="form-h3">Success message ✅</p>
                            <p className="form-h3">Login now</p>
                        </div> }
            {!userExist && <div className="message-container red">
                            <p className="form-h3">Failed message ❌</p>
                            <p className="form-h3">User already exist</p>
                        </div>}
            {!noUser && <div className="message-container red">
                            <p className="form-h3">Failed message ❌</p>
                            <p className="form-h3">No user yet</p>
                        </div>}            
            <div className="app">
                <span>🌎 ​🌐 ​👨‍🎨 ​👩‍🎨 👨‍💻​ 🧠​ 🫀​​</span>
            </div>
        </div>
            <div className="mensaje-welcome">Get inspired, find your style, and take your ideas to the next level_</div>
        </div>
        </>
    )
}