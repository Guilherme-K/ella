import { Route, Routes, Navigate } from 'react-router-dom'

import Accounts from './pages/Accounts'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ContaUser from './pages/ContaUser'
import Voluntaria from './pages/Voluntaria'
import Chat from './pages/Chat'
import ChatUsuario from './pages/ChatUsuario'
import ChatVoluntaria from './pages/ChatVoluntaria'
import Emergencia from './pages/Emergencia'
import Denuncia from './pages/Denuncia'
import AgradecimentoVoluntaria from './pages/AgradecimentoVoluntario'
import DashboardAdmin from './pages/DashboardAdmin'
import ChatAdmin from './pages/ChatAdmin'
import PerfilAdmin from './pages/PerfilAdmin'
import Informacoes from './pages/Informacoes'

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
        <Route path="/minha-conta" element={<ContaUser />} />
        <Route path="/perfil" element={<ContaUser />} />
        <Route path="/emergencia" element={<Emergencia />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/informacoes" element={<Informacoes />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="contas" element={<Accounts />} />
        <Route path="chats" element={<ChatAdmin />} />
        <Route path="perfil" element={<PerfilAdmin />} />
      </Route>

      {/* Rota legado / compatibilidade para /administrador */}
      <Route path="/administrador" element={<Navigate to="/admin" replace />} />

      <Route path="/voluntaria" element={<Voluntaria />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chatusuario" element={<ChatUsuario />} />
      <Route path="/chatvoluntaria" element={<ChatVoluntaria />} />
      <Route path="/chatadmin" element={<ChatAdmin />} />

      <Route
        path="/voluntaria/agradecimentovoluntaria"
        element={<AgradecimentoVoluntaria />}
      />

      <Route path="*" element={<Home />} />
    </Routes>
  )
}
