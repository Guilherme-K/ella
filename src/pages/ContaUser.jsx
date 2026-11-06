import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faLock,
  faCheck,
  faEye,
  faEyeSlash,
  faRightFromBracket,
  faImage,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import Avatar from './Avatar'
import { userService } from '../services/userService'

const PRESET_AVATARS = [
  {
    id: 'lorelei-1',
    label: 'Camila',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Camila',
  },
  {
    id: 'lorelei-2',
    label: 'Beatriz',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Beatriz',
  },
  {
    id: 'lorelei-3',
    label: 'Mariana',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Mariana',
  },
  {
    id: 'lorelei-4',
    label: 'Juliana',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Juliana',
  },
  {
    id: 'lorelei-5',
    label: 'Sofia',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sofia',
  },
  {
    id: 'photo-1',
    label: 'Foto 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'photo-2',
    label: 'Foto 2',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'photo-3',
    label: 'Foto 3',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  },
]

function ContaUserForm({ initialUser }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(initialUser)
  const [nome, setNome] = useState(() => initialUser?.nome || initialUser?.name || '')
  const [email, setEmail] = useState(() => initialUser?.email || '')
  const [avatar, setAvatar] = useState(() => initialUser?.avatar || '')
  const [customAvatar, setCustomAvatar] = useState(() => initialUser?.avatar || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function handleSelectPreset(url) {
    setAvatar(url)
    setCustomAvatar(url)
  }

  function handleCustomAvatarChange(e) {
    const url = e.target.value
    setCustomAvatar(url)
    setAvatar(url)
  }

  function handleLogout() {
    userService.clearSession()
    navigate('/')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!nome.trim()) {
      setErrorMessage('O nome não pode ficar vazio.')
      return
    }

    if (!email.trim()) {
      setErrorMessage('O e-mail não pode ficar vazio.')
      return
    }

    if (password) {
      if (password.length < 8) {
        setErrorMessage('A nova senha deve ter no mínimo 8 caracteres.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMessage('A confirmação da nova senha não confere.')
        return
      }
    }

    setLoading(true)

    try {
      const payload = {
        name: nome.trim(),
        email: email.trim(),
        avatar: avatar.trim() || null,
      }

      if (password) {
        payload.password = password
      }

      const res = await userService.update(user.id, payload)
      const updated = res.user || {
        ...user,
        name: payload.name,
        nome: payload.name,
        email: payload.email,
        avatar: payload.avatar,
      }

      setUser(updated)
      setSuccessMessage('Informações salvas com sucesso!')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        setSuccessMessage('')
      }, 4000)
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao atualizar dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex-1 bg-purple-100 px-4 py-12">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-10 border border-purple-100">
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-violet-600 hover:bg-purple-100 transition"
              title="Voltar ao início"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-violet-950">
                Minha Conta
              </h1>
              <p className="text-xs text-violet-500">
                Gerencie seus dados de acesso, nome, imagem de perfil e senha
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-pink-200 px-3 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50 transition"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

        {/* Mensagens de feedback */}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-700">
            <FontAwesomeIcon icon={faCheck} className="text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-pink-50 border border-pink-200 px-4 py-3 text-xs font-medium text-pink-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Seção Imagem de Perfil */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-3">
              Foto de Perfil
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Avatar
                nome={nome || 'Usuária'}
                avatar={avatar}
                tamanho="h-20 w-20"
                className="ring-4 ring-pink-300 ring-offset-2"
              />
              <div className="flex-1 text-center sm:text-left text-xs text-violet-600">
                <p className="font-semibold text-sm text-violet-900">
                  {nome || 'Sua Foto'}
                </p>
                <p className="text-violet-500 mt-0.5">
                  Selecione um dos avatares abaixo ou informe um endereço web de sua preferência.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-semibold text-violet-500 uppercase tracking-wider block mb-2">
                Avatares Disponíveis
              </span>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatar === preset.url
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      title={preset.label}
                      className={`relative h-11 w-11 overflow-hidden rounded-full border-2 transition hover:scale-105 ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-300'
                          : 'border-purple-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-3.5">
              <div className="flex h-10 items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 text-xs">
                <FontAwesomeIcon icon={faImage} className="text-violet-400 text-xs" />
                <input
                  type="url"
                  placeholder="URL de imagem personalizada (ex: https://...)"
                  value={customAvatar}
                  onChange={handleCustomAvatarChange}
                  className="w-full bg-transparent text-xs text-violet-900 outline-none placeholder:text-violet-300"
                />
                {avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar('')
                      setCustomAvatar('')
                    }}
                    className="text-xs text-pink-500 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-violet-700 mb-1.5">
                Nome Completo
              </label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-purple-200 bg-purple-50/60 px-3.5 focus-within:border-pink-400 focus-within:bg-white transition">
                <FontAwesomeIcon icon={faUser} className="text-xs text-violet-400" />
                <input
                  required
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-transparent text-xs font-normal text-violet-950 outline-none placeholder:text-violet-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-violet-700 mb-1.5">
                E-mail
              </label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-purple-200 bg-purple-50/60 px-3.5 focus-within:border-pink-400 focus-within:bg-white transition">
                <FontAwesomeIcon icon={faEnvelope} className="text-xs text-violet-400" />
                <input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs font-normal text-violet-950 outline-none placeholder:text-violet-300"
                />
              </div>
            </div>
          </div>

          {/* Alteração de Senha */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-700 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faLock} className="text-xs text-pink-400" />
                Alterar Senha
              </span>
              <span className="text-[11px] text-violet-400">
                (Opcional: deixe em branco para não alterar)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-medium text-violet-600 mb-1">
                  Nova Senha
                </label>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 focus-within:border-pink-400 transition">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 dígitos"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-violet-950 outline-none placeholder:text-violet-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-violet-400 hover:text-violet-600 text-xs"
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-violet-600 mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 focus-within:border-pink-400 transition">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-violet-950 outline-none placeholder:text-violet-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-100">
            <Link
              to="/contas"
              className="text-xs text-violet-600 hover:text-pink-600 underline"
            >
              Ver todas as contas cadastradas
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-pink-400 px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-pink-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default function ContaUser() {
  const current = userService.getCurrentUser()

  if (!current) {
    return <Navigate to="/login" replace />
  }

  return <ContaUserForm initialUser={current} />
}
