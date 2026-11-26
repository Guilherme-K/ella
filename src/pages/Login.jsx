import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import womenArtwork from '../assets/mulheres.png'
import {
  destinoPorPapel,
  normalizarPapel,
  obterUsuarioLogado,
  temSessaoAtiva,
} from '../utils/navegacao'
import BotaoVoltar from '../components/BotaoVoltar'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()
  const usuarioLogado = obterUsuarioLogado()

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const dados = await resposta.json().catch(() => ({}))

      if (!resposta.ok) {
        setMessage(
          dados?.erro ||
          dados?.error ||
          'E-mail ou senha inválidos.'
        )
        return
      }

      const usuario = dados.usuario || dados.user || dados

      if (!usuario?.id) {
        setMessage('Não foi possível identificar os dados da sua conta.')
        return
      }

      const token = dados.token || usuario.token

      if (typeof token !== 'string' || !token.trim()) {
        setMessage('O servidor não retornou o token de acesso. Tente novamente.')
        return
      }

      const papel = normalizarPapel(usuario)

      if (!['admin', 'voluntaria', 'psicologa', 'usuaria'].includes(papel)) {
        setMessage('O tipo de acesso desta conta não foi identificado.')
        return
      }

      // Guarda o usuário sem o token dentro do objeto (o token fica na chave
      // própria usada pelo httpClient).
      const usuarioSessao = { ...usuario }
      delete usuarioSessao.token

      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSessao))

      // Já deixa pronto para sincronizar o link de Saída Rápida vindo do banco no futuro
      const linkSaidaBanco = usuario.saidaRapida || usuario.linkSaida
      if (linkSaidaBanco) {
        localStorage.setItem('ella_link_saida_rapida', linkSaidaBanco)
      }

      localStorage.setItem('ella:token', token)

      // Sempre segue o destino do papel. Não reutiliza a página anterior para
      // que uma usuária não caia automaticamente no chat ao entrar.
      navigate(destinoPorPapel(usuario), {
        replace: true,
      })
    } catch {
      setMessage('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  // Só considera a sessão válida quando existe token. Dados antigos sem token
  // são descartados para não criar um ciclo /login ↔ /perfiluser.
  if (!temSessaoAtiva(usuarioLogado) && usuarioLogado?.id) {
    localStorage.removeItem('usuarioLogado')
  }

  if (temSessaoAtiva(usuarioLogado)) {
    return <Navigate to={destinoPorPapel(usuarioLogado)} replace />
  }

  return (
    <main id="conteudo" tabIndex={-1} className="relative flex flex-1 items-center justify-center overflow-hidden bg-purple-100 px-4 py-12">
      <section className="relative min-h-144 w-full max-w-sm overflow-hidden rounded-2xl bg-white px-8 py-9 shadow-md">
        <div className="relative z-10">
          {/* Botão Voltar no topo do formulário */}
          <div className="mb-4">
            <BotaoVoltar />
          </div>

          <h1 className="font-serif text-2xl font-bold leading-tight text-violet-950">
            Entrar
          </h1>

          <p className="mt-1 max-w-60 text-xs leading-snug text-violet-600">
            Sua história importa. Estamos aqui
            <br /> para te apoiar.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-8">
            <label className="block text-xs font-semibold text-violet-600">
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

            <label className="block text-xs font-semibold text-violet-600">
              Senha

              <div className="mt-3 flex h-9 items-center gap-6 rounded-lg border border-purple-100 bg-purple-50 px-3">
                <i className="fa-solid fa-key text-xs" aria-hidden="true" />

                <input
                  required
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-xs font-normal outline-none placeholder:text-purple-300"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="text-violet-500"
                >
                  <i
                    className={`fa-regular ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'} text-xs`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </label>

            <div className="-mt-4 text-right">
              <button
                type="button"
                onClick={() =>
                  setMessage('A recuperação de senha ainda não está disponível.')
                }
                className="text-xs text-pink-700 underline"
              >
                Esqueci minha senha
              </button>
            </div>

            {message && (
              <p role="alert" className="-mt-5 text-xs text-violet-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mx-auto -mt-5 block rounded-md bg-pink-700 px-6 py-2 text-xs text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="my-2.5 flex items-center gap-3 text-xs text-purple-600">
            <span className="h-px flex-1 bg-purple-100" />
            ou
            <span className="h-px flex-1 bg-purple-100" />
          </div>

          <p className="text-xs text-violet-600">
            Ainda não tem uma conta?
          </p>

          <Link
            to="/cadastro"
            className="mt-2 inline-block text-xs text-pink-700 underline"
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
