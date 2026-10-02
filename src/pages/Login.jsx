import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers } from '../api_crud'
import womenArtwork from '../assets/ChatGPT Image 18 de set. de 2026, 08_12_58 (1) 1.png'
import floralBackground from '../assets/ChatGPT Image 18 de set. de 2026, 08_12_58 (1) 2.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  function submit(event) {
    event.preventDefault()
    const user = getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase())
    if (!user || user.password !== password) {
      setMessage('E-mail ou senha não conferem. Confira os dados ou crie sua conta.')
      return
    }
    navigate('/contas')
  }

  return <main id="inicio" className="login-background relative flex min-h-[calc(100svh-42px)] items-center justify-center overflow-hidden bg-[#f1e2ff] px-4 py-12">
    <img src={floralBackground} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[66%] w-full object-cover object-bottom" />
    <section className="relative z-10 min-h-[575px] w-full max-w-[398px] overflow-hidden rounded-[20px] bg-white px-[34px] py-[36px] shadow-[0_3px_3px_#9e83a9] sm:px-[35px]">
      <div className="relative z-10"><h1 className="font-serif text-[27px] font-bold leading-tight text-[#422760]">Entrar</h1><p className="mt-1 max-w-[230px] text-[12px] leading-[1.3] text-violet-500">Sua história importa. Estamos aqui<br/> para te apoiar.</p>
        <form onSubmit={submit} className="mt-[22px] space-y-[30px]">
          <label className="block text-[12px] font-semibold text-violet-500">E-mail<div className="mt-[14px] flex h-[36px] items-center gap-6 rounded-[10px] border border-purple-100 bg-[#fcfaff] px-3"><span aria-hidden="true" className="text-[11px]">✉</span><input required type="email" autoComplete="email" placeholder="seu@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-[9px] font-normal outline-none placeholder:text-purple-300"/></div></label>
          <label className="block text-[12px] font-semibold text-violet-500">Senha<div className="mt-[14px] flex h-[36px] items-center gap-6 rounded-[10px] border border-purple-100 bg-[#fcfaff] px-3"><span aria-hidden="true" className="text-[11px]">♟</span><input required type="password" autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-[9px] font-normal outline-none placeholder:text-purple-300"/><span aria-hidden="true" className="text-[11px]">◎</span></div></label>
          <div className="-mt-[17px] text-right"><button type="button" onClick={() => setMessage('Para recuperar seu acesso, faça um novo cadastro com seu e-mail.')} className="text-[11px] text-pink-400 underline">Esqueci minha senha</button></div>
          {message && <p role="status" className="-mt-5 text-[10px] text-violet-600">{message}</p>}
          <button className="mx-auto -mt-[18px] block rounded-md bg-pink-400 px-6 py-[3px] text-[10px] text-white transition hover:bg-pink-500">Entrar</button>
        </form>
        <div className="my-[10px] flex items-center gap-3 text-[8px] text-purple-300"><span className="h-px flex-1 bg-purple-100"/>ou<span className="h-px flex-1 bg-purple-100"/></div>
        <p className="text-[12px] text-violet-500">Ainda não tem uma conta?</p><Link to="/cadastro" className="mt-2 inline-block text-[12px] text-pink-400 underline">Criar conta</Link>
      </div>
      <img src={womenArtwork} alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-[2px] -right-[2px] z-0 w-[54%] max-w-[250px] object-contain" />
    </section>
  </main>
}
