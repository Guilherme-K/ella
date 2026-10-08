import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, getUsers } from '../api_crud'

const fields = [
  { name: 'nome', label: 'Nome', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'password', label: 'Senha', type: 'password' },
]

export default function Signup() {
  const [form, setForm] = useState({ nome: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  function submit(event) {
    event.preventDefault()
    const emailExists = getUsers().some(
      (user) => user.email.toLowerCase() === form.email.toLowerCase(),
    )

    if (emailExists) {
      setMessage('Já existe uma conta com este e-mail.')
      return
    }

    createUser(form)
    navigate('/contas')
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-purple-100 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
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
                className="mt-2 block w-full rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm outline-none focus:border-pink-300"
              />
            </label>
          ))}
          {message && (
            <p role="status" className="text-sm text-pink-600">
              {message}
            </p>
          )}
          <button className="w-full rounded-xl bg-pink-400 py-3 text-sm font-medium text-white hover:bg-pink-500">
            Cadastrar
          </button>
        </form>

        <Link
          to="/"
          className="mt-4 inline-block text-sm text-pink-500 underline"
        >
          Voltar ao início
        </Link>
      </section>
    </main>
  )
}
