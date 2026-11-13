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
import PerfilVoluntaria from './pages/PerfilVoluntaria'
import PerfilPsicologa from './pages/PerfilPsicologa'

import RotaProtegida from './components/RotaProtegida'
import Acessibilidade from './components/Acessibilidade'
import VLibrasWidget from './components/VLibrasWidget'
import SaidaRapida from './components/SaidaRapida'

export default function App() {
  return (
    <>
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
            <Route path="/contas" element={<Accounts />} />
          </Route>

          <Route
            element={<RotaProtegida exigirToken papeisPermitidos={['usuaria']} />}
          >
            <Route path="/perfiluser" element={<Perfil />} />
          </Route>

          <Route
            element={
              <RotaProtegida exigirToken papeisPermitidos={['voluntaria']} />
            }
          >
            <Route path="/perfilvoluntaria" element={<PerfilVoluntaria />} />
          </Route>

          <Route
            element={
              <RotaProtegida exigirToken papeisPermitidos={['psicologa']} />
            }
          >
            <Route path="/perfilpsicologa" element={<PerfilPsicologa />} />
          </Route>

          <Route
            element={
              <RotaProtegida
                exigirToken
                papeisPermitidos={[
                  'usuaria',
                  'voluntaria',
                  'psicologa',
                  'admin',
                ]}
              />
            }
          >
            <Route path="/chat" element={<Chat />} />
          </Route>

          <Route
            element={
              <RotaProtegida exigirToken papeisPermitidos={['usuaria']} />
            }
          >
            <Route path="/chatusuario" element={<ChatUsuario />} />
          </Route>

          <Route
            element={
              <RotaProtegida
                exigirToken
                papeisPermitidos={['voluntaria', 'psicologa']}
              />
            }
          >
            <Route path="/chatvoluntaria" element={<ChatVoluntaria />} />
          </Route>
        </Route>

        <Route
          element={
            <RotaProtegida exigirToken papeisPermitidos={['admin']} />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="chats" element={<ChatAdmin />} />
            <Route path="perfil" element={<PerfilAdmin />} />
          </Route>
        </Route>

        <Route
          path="/chatadmin"
          element={<Navigate to="/admin/chats" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Fica aqui fora das rotas para aparecer em todas as páginas */}
      <Acessibilidade />
      <VLibrasWidget />
      <SaidaRapida />
    </>
  )
}
