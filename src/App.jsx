import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { DesignerProvider } from './components/Context/DesignersContext'
import { DesignersApp } from './components/DesignersApp/DesignersApp'
import { Home } from './components/Home/Home'
import { Explore } from './components/Explore/Explore'
import { Error404 } from './components/404/Error404'

// componente principal de la app
function App() {

  // router , rutas y provider del contexto
  return (

    <BrowserRouter>
    <DesignerProvider>

    <>
    <Routes>
      <Route path='/' element={<DesignersApp/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/explore' element={<Explore/>}/>
      <Route path='/not-found' element={<Error404/>}/>

      <Route path= '*' element={<Navigate to='/not-found'/>}/>
    </Routes>
    </>

    </DesignerProvider>
    </BrowserRouter>
  )
}

export default App