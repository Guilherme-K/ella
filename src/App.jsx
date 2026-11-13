
import { Navigate, Route, Routes } from 'react-router-dom'

import Accounts from './pages/Accounts'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Voluntaria from './pages/Voluntaria'

import AgradecimentoVoluntaria from './pages/AgradecimentoVoluntario'
import DashboardAdmin from './pages/DashboardAdmin'
import ChatAdmin from './pages/ChatAdmin'
import PerfilAdmin from './pages/PerfilAdmin'
import AdminRedesApoio from './pages/AdminRedesApoio'
import Informacoes from './pages/Informacoes'
import Chat from './pages/Chat'
import ChatUsuario from './pages/ChatUsuario'
import ChatVoluntaria from './pages/ChatVoluntaria'
import Emergencia from './pages/Emergencia'
import Denuncia from './pages/Denuncia'
import Sobre from './pages/Sobre'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import RedeApoio from './pages/RedeApoio'
import Contato from './pages/Contato'
import Perfil from './pages/Perfil'
import NaoEncontrada from './pages/NaoEncontrada'

import RotaProtegida from './components/RotaProtegida'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/emergencia" element={<Emergencia />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/informacoes" element={<Informacoes />} />
        <Route path="/voluntaria" element={<Voluntaria />} />
        <Route path="/apoio" element={<RedeApoio />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route
          path="/voluntaria/agradecimentovoluntaria"
          element={<AgradecimentoVoluntaria />}
        />

        <Route
          element={
            <RotaProtegida
              papeisPermitidos={[
                'usuaria',
                'voluntaria',
                'psicologa',
                'admin',
              ]}
            />
          }
        >
          <Route path="/perfiluser" element={<Perfil />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route element={<RotaProtegida papeisPermitidos={['usuaria']} />}>
          <Route path="/chatusuario" element={<ChatUsuario />} />
        </Route>

        <Route element={<RotaProtegida papeisPermitidos={['voluntaria']} />}>
          <Route path="/chatvoluntaria" element={<ChatVoluntaria />} />
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Route>

      <Route element={<RotaProtegida papeisPermitidos={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="chats" element={<ChatAdmin />} />
          <Route path="redes" element={<AdminRedesApoio />} />
          <Route path="contas" element={<Accounts />} />
          <Route path="perfil" element={<PerfilAdmin />} />
        </Route>
      </Route>

      <Route
        path="/contas"
        element={<Navigate to="/admin/contas" replace />}
      />

      <Route
        path="/chatadmin"
        element={<Navigate to="/admin/chats" replace />}
      />
    </Routes>
  )
}
