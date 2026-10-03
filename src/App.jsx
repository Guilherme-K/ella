import { Route, Routes } from 'react-router-dom'
import Accounts from './pages/Accounts'
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MainLayout from './layouts/MainLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<SectionPage />} />
        <Route path="/informacoes" element={<SectionPage />} />
        <Route path="/apoio" element={<SectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/contas" element={<Accounts />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
