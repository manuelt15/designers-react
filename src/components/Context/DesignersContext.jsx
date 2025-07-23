import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// creamos contexto
export const DesignerContext = createContext()

// componente provider
export const DesignerProvider = (props)=>{

const {children} = props

// login hooks
const formLogin = useRef()
const formRegister = useRef()
const navigate = useNavigate()
const [goodLogin , setGoodLogin] = useState(true)
const [userExist , setUserExist] = useState(true)
const [userNew , setUserNew] = useState(true)
const [noUser , setNoUser] = useState(true)

//state para pedir profiles
const [profiles , setProfiles] = useState([])

//hooks para profiles
const formPut = useRef()
const formAdd = useRef()

// effect de login y prevencion de acceder a otras paginas con local storage
useEffect(()=>{
    if(!localStorage.login){
        navigate('/')
    }
},[])   

// importamos variable de entorno
const { VITE_EXPRESS } = import.meta.env
console.log(import.meta.env.VITE_EXPRESS)

// login, logOut y register handler
const loginUser = async (e)=>{
e.preventDefault();

const {username , password} = formLogin.current 

let user = {
    username : username.value ,
    password : password.value
}

let options = {
    method : `post`,
    body : JSON.stringify(user),
    headers: {
        "Content-type": "application/json"
      }
}

let peticion = await fetch(`${VITE_EXPRESS}/users` , options)
let datos = await peticion.json()

if(!username.value.trim() || !password.value.trim()){
    setGoodLogin(false)
    setTimeout(()=> {
        setGoodLogin(true)
    } , 5000)

    return
}

if(datos.success){
    console.log('logged in:' , datos)
    localStorage.setItem('login' , 'true')
    navigate('/home')
    setGoodLogin(true)
}else{
    console.error('Error de login', datos)
    setGoodLogin(false)
    setTimeout(()=>{
        setGoodLogin(true)
    }, 5000)
}
}
const registerUser = async (e)=>{
e.preventDefault()
console.log('User created')

const {username , password} = formRegister.current

if (!username.value.trim() || !password.value.trim()) {
    setNoUser(false)
    setTimeout(() => 
        setNoUser(true), 5000)

    return
}

let newUser = {
    username : username.value,
    password : password.value
}

let controller = new AbortController()
let options = {
    method : `post`,
    signal : controller.signal,
    body : JSON.stringify(newUser),
    headers: {
        "Content-type": "application/json"
      }
}

let peticion = await fetch(`${VITE_EXPRESS}/register` , options)
let datos = await peticion.json()
console.log(datos.data)

if(datos.message === `El usuario ya esta creado`){
    setUserExist(false)
    setTimeout(()=>{
        setUserExist(true)
    },6000)
}else{
    setUserNew(false)
    formRegister.current.reset()
    setTimeout(()=>{
        setUserNew(true)
    },6000)
}
}
const logOut = ()=> {
    localStorage.removeItem('login')
    navigate('/')
}

// stste para card-carrousel
const [contador , setcontador] = useState(0)


// handler next  para arrousel
const next = ()=>{
   setcontador(contador + 1)
   if(contador >= 3){
    setcontador(0)
   }
}
//handler prev para carrousel
const prev = ()=>{
    setcontador(contador - 1 )
    if(contador <= 0){
        setcontador(3)
    }
}

// handler para pedir profiles
const getProfiles = async ()=>{

    let controller = new AbortController()
    let options = {
        method : `get`,
        signal : controller.signal
      }

      try {
        let peticion = await fetch(`${VITE_EXPRESS}/profiles` , options)
      let datos = await peticion.json()
      setProfiles(datos.data)
      } catch (error) {
        next(error)
      }finally{
        controller.abort()
      }  
}

// handler para put profiles
const putProfiles = (_id)=>{
    console.log(_id)

    const { identificador, name , age , design , email , disponible , src} = formPut.current

    const find = profiles.find(profile => profile._id === _id)
    console.log(find)
    identificador.value = find._id
    name.value = find.name
    age.value = find.age
    design.value = find.design
    email.value = find.email
    src.value = find.src
    disponible.checked = find.disponible
}

// handler para act profiles
const actProfiles = async (e)=>{
e.preventDefault()

const {identificador , name, age, design , email , disponible , src} = formPut.current
let actProfile = {
    _id : identificador.value,
    name : name.value,
    age : age.value,
    design : design.value,
    email : email.value,
    src : src.value,
    disponible : disponible.checked
}
 
let controller = new AbortController()
let options = {
    method : `put`,
    signal : controller.signal,
    body : JSON.stringify(actProfile),
    headers  : {
        "Content-type" : "application/json"
    }
}
try {
    let peticion = await fetch(`${VITE_EXPRESS}/profiles` , options)
    let datos = await peticion.json()
    setProfiles(datos.data)
    
} catch (error) {
   console.log(error.message)
}
}
// handler para post designers
const postProfiles = async (e)=>{
    e.preventDefault()
    console.log(`Added new profile`)

    const {name , age , src , disponible , email, design} = formAdd.current
    const newProfile = {
        name : name.value,
        age : age.value,
        src : src.value,
        disponible : disponible.checked,
        email : email.value,
        design: design.value
    }
    let controller = new AbortController()
    let options = {
        method : `post`,
        signal : controller.signal,
        body : JSON.stringify(newProfile),
        headers  : {
            "Content-type" : "application/json"
          }
    }
    try {
        let peticion = await fetch(`${VITE_EXPRESS}/profiles` , options)
        let datos = await peticion.json()
        setProfiles(datos.data)
    } catch (error) {
        console.log(error.message)
    }
}
// handler para delete profiles
const deleteProfiles = async (_id)=>{
    console.log(`deleting the profile with id ${_id}`)

    let controller = new AbortController()
    let options = { 
        method : `delete`,
        signal : controller.signal 
    }

    try {
        let peticion = await fetch(`${VITE_EXPRESS}/profiles/${_id}` , options)
        let datos = await peticion.json()
        // setProfiles(datos.data) esto me generaba un bug a la hora de ejecutar el `delete`, tenia que refrescar la pagina para ver que si habia borrado solo ese elemento
        setProfiles(prev => prev.filter(profile => profile._id !== _id)) 
            // este fue el cambio que logre encontrar con ayuda de chatGPT, entiendo que lo que hizo fue filtrar la lista de profiles y asi devolver una lista nueva completa con el elemento borrado
    } catch (error) {
        console.log(error.message)
    }finally{
        controller.abort()
    }
}





return(
    <DesignerContext.Provider value={{formLogin , loginUser, setGoodLogin , goodLogin, registerUser, userExist, setUserExist, setUserNew, userNew, formRegister , logOut , next , prev , contador, getProfiles, profiles , formPut , putProfiles , actProfiles , formAdd , postProfiles , deleteProfiles , noUser , setNoUser}} >
        {children}
    </DesignerContext.Provider>
)
}