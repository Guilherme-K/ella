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
    const user = getUsers().find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    )

    if (!user || user.password !== password) {
      setMessage('E-mail ou senha não conferem. Confira os dados ou crie sua conta.')
      return
    }

    navigate('/contas')
  }

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-purple-100 px-4 py-12">
      <img
        src={floralBackground}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 w-full object-cover object-bottom"
      />
      <section className="relative z-10 min-h-144 w-full max-w-sm overflow-hidden rounded-2xl bg-white px-8 py-9 shadow-md">
        <div className="relative z-10">
          <h1 className="font-serif text-2xl font-bold leading-tight text-violet-950">
            Entrar
          </h1>
          <p className="mt-1 max-w-60 text-xs leading-snug text-violet-500">
            Sua história importa. Estamos aqui
            <br /> para te apoiar.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-8">
            <label className="block text-xs font-semibold text-violet-500">
              E-mail
              <div className="mt-3 flex h-9 items-center gap-6 rounded-lg border border-purple-100 bg-purple-50 px-3">
                <i className="fa-regular fa-envelope text-xs" aria-hidden="true" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="seu@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-xs font-normal outline-none placeholder:text-purple-300"
                />
              </div>
            </label>

            <label className="block text-xs font-semibold text-violet-500">
              Senha
              <div className="mt-3 flex h-9 items-center gap-6 rounded-lg border border-purple-100 bg-purple-50 px-3">
                <i className="fa-solid fa-key text-xs" aria-hidden="true" />
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-xs font-normal outline-none placeholder:text-purple-300"
                />
                <i className="fa-regular fa-eye text-xs" aria-hidden="true" />
              </div>
            </label>

            <div className="-mt-4 text-right">
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    'Para recuperar seu acesso, faça um novo cadastro com seu e-mail.',
                  )
                }
                className="text-xs text-pink-400 underline"
              >
                Esqueci minha senha
              </button>
            </div>

            {message && (
              <p role="status" className="-mt-5 text-xs text-violet-600">
                {message}
              </p>
            )}

            <button className="mx-auto -mt-5 block rounded-md bg-pink-400 px-6 py-1 text-xs text-white transition hover:bg-pink-500">
              Entrar
            </button>
          </form>

          <div className="my-2.5 flex items-center gap-3 text-xs text-purple-300">
            <span className="h-px flex-1 bg-purple-100" />
            ou
            <span className="h-px flex-1 bg-purple-100" />
          </div>
          <p className="text-xs text-violet-500">Ainda não tem uma conta?</p>
          <Link
            to="/cadastro"
            className="mt-2 inline-block text-xs text-pink-400 underline"
          >
            Criar conta
          </Link>
        </div>
        <img
          src={womenArtwork}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-0 w-1/2 max-w-64 object-contain"
        />
      </section>
    </main>
  )
}
