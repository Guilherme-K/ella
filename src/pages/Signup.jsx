import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BotaoVoltar from '../components/BotaoVoltar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fields = [
  { name: 'nome', label: 'Nome', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'password', label: 'Senha', type: 'password' },
]

export default function Signup() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
  })
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [message, setMessage] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  async function submit(event) {
    event.preventDefault()
    setMessage('')

    if (form.password !== confirmarSenha) {
      setMessage('As senhas não coincidem.')
      return
    }

    if (form.password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      const dados = await resposta.json().catch(() => ({}))

      if (!resposta.ok) {
        setMessage(
          dados?.erro ||
          dados?.error ||
          'Não foi possível realizar o cadastro.'
        )
        return
      }

      const usuarioRecebido = dados.usuario || dados.user || dados

      if (usuarioRecebido?.id) {
        const usuario = {
          ...usuarioRecebido,
          tipo:
            usuarioRecebido.tipo ||
            usuarioRecebido.papel ||
            usuarioRecebido.role ||
            'usuaria',
        }

        localStorage.setItem('usuarioLogado', JSON.stringify(usuario))

        if (dados.token) {
          localStorage.setItem('ella:token', dados.token)
        }

        navigate('/contas', { replace: true })
        return
      }

      setMessage('Cadastro realizado! Faça login para acessar sua conta.')
    } catch {
      setMessage('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-purple-100 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        {/* Botão Voltar no topo do formulário */}
        <div className="mb-5">
          <BotaoVoltar />
        </div>

        <h1 className="font-serif text-3xl font-bold text-violet-950">
          Criar conta
        </h1>

        <p className="mt-2 text-sm text-violet-500">
          Um espaço seguro começa com você.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields.map((field) => (
            <label
              key={field.name}
              className="block text-sm font-medium text-violet-600"
            >
              {field.label}

              <input
                required
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={updateField}
                minLength={field.name === 'password' ? 6 : undefined}
                autoComplete={
                  field.name === 'password'
                    ? 'new-password'
                    : field.name
                }
                className="mt-2 block w-full rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm outline-none focus:border-pink-300"
              />
            </label>
          ))}

          <label className="block text-sm font-medium text-violet-600">
            Confirmar senha

            <input
              required
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              autoComplete="new-password"
              className="mt-2 block w-full rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm outline-none focus:border-pink-300"
            />
          </label>

          {message && (
            <p role="alert" className="text-sm text-pink-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-pink-400 py-3 text-sm font-medium text-white hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-5 text-sm text-violet-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-pink-500 underline">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  )
}
