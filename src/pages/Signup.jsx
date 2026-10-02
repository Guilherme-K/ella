import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, getUsers } from '../api_crud'

export default function Signup() {
  const [form, setForm] = useState({ nome: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  function submit(event) {
    event.preventDefault()
    if (getUsers().some((user) => user.email.toLowerCase() === form.email.toLowerCase())) {
      setMessage('Já existe uma conta com este e-mail.')
      return
    }
    createUser(form)
    navigate('/contas')
  }

  return <main className="flex min-h-[calc(100svh-42px)] items-center justify-center bg-[#f1e2ff] px-4 py-12"><section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><h1 className="font-serif text-3xl font-bold text-[#422760]">Criar conta</h1><p className="mt-2 text-sm text-violet-500">Um espaço seguro começa com você.</p><form onSubmit={submit} className="mt-6 space-y-4">{[['nome','Nome'],['email','E-mail'],['password','Senha']].map(([name,label])=><label key={name} className="block text-sm font-medium text-violet-600">{label}<input required type={name==='password'?'password':name==='email'?'email':'text'} value={form[name]} onChange={(e)=>setForm({...form,[name]:e.target.value})} className="mt-2 block w-full rounded-xl border border-purple-100 bg-[#fcf9ff] px-4 py-3 text-sm outline-none focus:border-pink-300"/></label>)}{message&&<p role="status" className="text-sm text-pink-600">{message}</p>}<button className="w-full rounded-xl bg-pink-400 py-3 text-sm font-medium text-white hover:bg-pink-500">Cadastrar</button></form><Link to="/" className="mt-4 inline-block text-sm text-pink-500 underline">Voltar para entrar</Link></section></main>
}
