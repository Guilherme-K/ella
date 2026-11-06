import { Route, Routes } from 'react-router-dom'

import Accounts from './pages/Accounts'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Voluntaria from './pages/Voluntaria'

import AgradecimentoVoluntaria from './pages/AgradecimentoVoluntario'
import DashboardAdmin from './pages/DashboardAdmin'
import ChatAdmin from './pages/ChatAdmin'
import PerfilAdmin from './pages/PerfilAdmin'
import Informacoes from './pages/Informacoes'
import Chat from './pages/Chat'
import ChatUsuario from './pages/ChatUsuario'
import ChatVoluntaria from './pages/ChatVoluntaria'
import Emergencia from './pages/Emergencia'
import Denuncia from './pages/Denuncia'
import Sobre from './pages/Sobre'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/contas" element={<Accounts />} />
        <Route path="/emergencia" element={<Emergencia />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/informacoes" element={<Informacoes />} />
        <Route path="/voluntaria" element={<Voluntaria />} />
        <Route
          path="/voluntaria/agradecimentovoluntaria"
          element={<AgradecimentoVoluntaria />}
        />
        <Route path="/sobre" element={<Sobre />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="chats" element={<ChatAdmin />} />
        <Route path="perfil" element={<PerfilAdmin />} />
      </Route>


      <Route path="/chat" element={<Chat />} />
      <Route path="/chatusuario" element={<ChatUsuario />} />
      <Route path="/chatvoluntaria" element={<ChatVoluntaria />} />


      <Route path="*" element={<Home />} />
    </Routes>
  )
}