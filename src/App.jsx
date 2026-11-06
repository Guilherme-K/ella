import { Route, Routes } from 'react-router-dom'
import Accounts from './pages/Accounts'
import Home from './pages/Home'
//import SectionPage from './pages/SectionPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MainLayout from './layouts/MainLayout'

import Voluntaria from './pages/Voluntaria'

import Chat from './pages/Chat'
import ChatUsuario from './pages/ChatUsuario'
import ChatVoluntaria from './pages/ChatVoluntaria'
import ChatAdmin from './pages/ChatAdmin'
import Emergencia from "./pages/Emergencia";
import AgradecimentoVoluntaria from './pages/AgradecimentoVoluntario'
import DashboardAdmin from './pages/DashboardAdmin'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/contas" element={<Accounts />} />
        <Route path="*" element={<Home />} />
        <Route path='/voluntaria' element={<Voluntaria />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/chatusuario' element={<ChatUsuario />} />
        <Route path="/chatvoluntaria" element={<ChatVoluntaria />} />
        <Route path="/chatadmin" element={<ChatAdmin />} />
        <Route path="/emergencia" element={<Emergencia />} />
        <Route path='/voluntaria/agradecimentovoluntaria' element={<AgradecimentoVoluntaria/>}/>
        <Route path="/administrador" element={<DashboardAdmin />} />
      </Route>
    </Routes>
  )
}
