import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
const [profilesLoading, setProfilesLoading] = useState(true)
const [profilesError, setProfilesError] = useState('')
const [profilesSaving, setProfilesSaving] = useState(false)
const profileRequest = useRef(false)

//pagination
const itemsPerPage = 4
const [currentPage , setCurrentPage] = useState(1)

//hooks para profiles
const formPut = useRef()
const formAdd = useRef()

// modal de add/edit: 'add' | 'edit' | null
const [modal , setModal] = useState(null)
const [editingId , setEditingId] = useState('')
const closeModal = ()=> setModal(null)

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


// handler para pedir profiles
const getProfiles = useCallback(async (signal)=>{
    setProfilesLoading(true)
    setProfilesError('')
    try {
        const peticion = await fetch(`${VITE_EXPRESS}/profiles`, {signal})
        if(!peticion.ok) throw new Error('Failed to load profiles')
        const datos = await peticion.json()
        if(!Array.isArray(datos.data)) throw new Error('Invalid profiles response')
        if(!signal?.aborted){
            setProfiles(datos.data)
            setCurrentPage(page => Math.max(1, Math.min(page, Math.ceil(datos.data.length / itemsPerPage))))
        }
    } catch (error) {
        if(!signal?.aborted) setProfilesError(error.message)
    } finally {
        if(!signal?.aborted) setProfilesLoading(false)
    }
}, [VITE_EXPRESS])

// handler para put profiles: abre el modal de edicion con el perfil seleccionado
const putProfiles = (_id)=>{
    setEditingId(_id)
    setModal('edit')
}

// handler para act profiles
const actProfiles = async (e) => {
    e.preventDefault()
    if(profileRequest.current) return

    const {identificador , name, age, design , email , disponible , src} = formPut.current
    if(!identificador.value.trim() || !name.value.trim() || !age.value.trim() || !design.value.trim() || !email.value.trim()){
        Swal.fire({
            icon: 'warning',
            title: 'Missing fields',
            text: 'Name, age, design and email are required.',
            background: '#201d1d',
            color: '#FDFCFC',
            confirmButtonColor: '#201d1d',
            confirmButtonText: 'OK'
        })
        return
    }
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
profileRequest.current = true
    setProfilesSaving(true)
    try {
    let peticion = await fetch(`${VITE_EXPRESS}/profiles` , options)
        if(!peticion.ok) throw new Error('Profile request failed')
    let datos = await peticion.json()
        if(!Array.isArray(datos.data)) throw new Error('Invalid profiles response')
    setProfiles(datos.data)
    
    Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'The profile has been updated successfully.',
        background: '#201d1d',
        color: '#FDFCFC',
        confirmButtonColor: '#201d1d',
        confirmButtonText: 'OK'
    })
    
    formPut.current.reset()
    setModal(null)
} catch (error) {
   console.log(error.message)
   Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update the profile.',
        background: '#201d1d',
        color: '#FDFCFC',
        confirmButtonColor: '#201d1d',
        confirmButtonText: 'OK'
     })
 } finally {
        profileRequest.current = false
        setProfilesSaving(false)
    }
}
// handler para post designers
const postProfiles = async (e)=>{
    e.preventDefault()
    if(profileRequest.current) return

    const {name , age , src , disponible , email, design} = formAdd.current
    if(!name.value.trim() || !age.value.trim() || !design.value.trim() || !email.value.trim()){
        Swal.fire({
            icon: 'warning',
            title: 'Missing fields',
            text: 'Name, age, design and email are required.',
            background: '#201d1d',
            color: '#FDFCFC',
            confirmButtonColor: '#201d1d',
            confirmButtonText: 'OK'
        })
        return
    }
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
    profileRequest.current = true
    setProfilesSaving(true)
    try {
        let peticion = await fetch(`${VITE_EXPRESS}/profiles` , options)
        if(!peticion.ok) throw new Error('Profile request failed')
        let datos = await peticion.json()
        if(!Array.isArray(datos.data)) throw new Error('Invalid profiles response')
        setProfiles(datos.data)
        
        Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'New profile has been added successfully.',
            background: '#201d1d',
            color: '#FDFCFC',
            confirmButtonColor: '#201d1d',
            confirmButtonText: 'OK'
        })
        
        formAdd.current.reset()
        setModal(null)
    } catch (error) {
        console.log(error.message)
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to add the profile.',
            background: '#201d1d',
            color: '#FDFCFC',
            confirmButtonColor: '#201d1d',
            confirmButtonText: 'OK'
        })
     } finally {
        profileRequest.current = false
        setProfilesSaving(false)
    }
}
// handler para delete profiles
const deleteProfiles = async (_id)=>{
    if(profileRequest.current) return

    let controller = new AbortController()
    let options = { 
        method : `delete`,
        signal : controller.signal 
    }

    profileRequest.current = true
    setProfilesSaving(true)
    try {
        let peticion = await fetch(`${VITE_EXPRESS}/profiles/${_id}` , options)
        if(!peticion.ok) throw new Error('Profile request failed')
        let _datos = await peticion.json()
        setProfiles(prev => prev.filter(profile => profile._id !== _id))
        setCurrentPage(page => Math.max(1, Math.min(page, Math.ceil((profiles.length - 1) / itemsPerPage))))
        
        Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The profile has been deleted successfully.',
            background: '#201d1d',
            color: '#FDFCFC',
            confirmButtonColor: '#201d1d',
            confirmButtonText: 'OK'
        })
    } catch (error) {
        console.log(error.message)
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete the profile.',
            background: '#201d1d',
            color: '#FDFCFC',
            confirmButtonColor: '#201d1d',
            confirmButtonText: 'OK'
        })
    }finally{
        profileRequest.current = false
        setProfilesSaving(false)
        controller.abort()
    }
}

// pagination handlers
const nextPage = () => {
    const totalPages = Math.ceil(profiles.length / itemsPerPage)
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
    }
}

const prevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
    }
}





return(
    <DesignerContext.Provider value={{formLogin , loginUser, setGoodLogin , goodLogin, registerUser, userExist, setUserExist, setUserNew, userNew, formRegister , logOut , getProfiles, profilesLoading, profilesError, profilesSaving, profiles , formPut , putProfiles , actProfiles , formAdd , postProfiles , deleteProfiles , noUser , setNoUser, navigate, currentPage, nextPage, prevPage, itemsPerPage, modal, setModal, closeModal, editingId}} >
        {children}
    </DesignerContext.Provider>
)
}