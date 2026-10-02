import { Route, Routes } from 'react-router-dom'
import Accounts from './pages/Accounts'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Footer from './components/Footer'
import Header from './components/Header'

export default function App() {
  return <div className="min-h-screen"><Header/><Routes><Route path="/" element={<Login/>}/><Route path="/cadastro" element={<Signup/>}/><Route path="/contas" element={<Accounts/>}/><Route path="*" element={<Login/>}/></Routes><Footer/></div>
}
