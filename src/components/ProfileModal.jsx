import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faLock,
  faXmark,
  faCheck,
  faEye,
  faEyeSlash,
  faRightFromBracket,
  faImage,
} from '@fortawesome/free-solid-svg-icons'
import Avatar from '../pages/Avatar'
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

function ProfileModalContent({ user, onClose, onUpdateUser, onLogout }) {
  const [nome, setNome] = useState(() => user?.nome || user?.name || '')
  const [email, setEmail] = useState(() => user?.email || '')
  const [avatar, setAvatar] = useState(() => user?.avatar || '')
  const [customAvatar, setCustomAvatar] = useState(() => user?.avatar || '')
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
        setErrorMessage('A confirmação da senha não confere.')
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

      setSuccessMessage('Informações atualizadas com sucesso!')
      setPassword('')
      setConfirmPassword('')

      if (onUpdateUser) {
        onUpdateUser(updated)
      }

      setTimeout(() => {
        setSuccessMessage('')
      }, 3500)
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao atualizar informações.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative my-8 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8 border border-purple-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Botão fechar */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-violet-400 hover:bg-purple-50 hover:text-violet-700 transition"
      >
        <FontAwesomeIcon icon={faXmark} className="text-base" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-pink-500">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div>
          <h2 id="modal-title" className="font-serif text-xl sm:text-2xl font-bold text-violet-950">
            Minha Conta
          </h2>
          <p className="text-xs text-violet-500">
            Atualize seus dados, foto de perfil e senha
          </p>
        </div>
      </div>

      {/* Feedback messages */}
      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-medium text-emerald-700">
          <FontAwesomeIcon icon={faCheck} className="text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-xl bg-pink-50 border border-pink-200 px-4 py-2.5 text-xs font-medium text-pink-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Imagem de perfil atual e opções */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
          <label className="block text-xs font-semibold text-violet-700 mb-3">
            Foto de Perfil
          </label>

          <div className="flex items-center gap-4">
            <Avatar
              nome={nome || 'Usuária'}
              avatar={avatar}
              tamanho="h-16 w-16"
              className="ring-4 ring-pink-200 ring-offset-2"
            />
            <div className="flex-1 text-xs text-violet-600">
              <p className="font-medium">Escolha um avatar ou adicione uma imagem da internet</p>
              <p className="text-[11px] text-violet-400 mt-0.5">
                Clique em um dos modelos abaixo ou cole a URL de sua foto preferida.
              </p>
            </div>
          </div>

            {/* Galeria de modelos prontos */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-violet-500 uppercase tracking-wider block mb-2">
                Sugestões da Internet
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatar === preset.url
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      title={preset.label}
                      className={`relative h-10 w-10 overflow-hidden rounded-full border-2 transition hover:scale-105 ${
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

            {/* Campo URL personalizada */}
            <div className="mt-3">
              <div className="flex h-9 items-center gap-2 rounded-lg border border-purple-200 bg-white px-3 text-xs">
                <FontAwesomeIcon icon={faImage} className="text-violet-400 text-xs" />
                <input
                  type="url"
                  placeholder="Ou cole a URL de uma imagem..."
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
                    className="text-[10px] text-pink-500 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-violet-700 mb-1.5">
              Nome
            </label>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-purple-200 bg-purple-50/60 px-3.5 focus-within:border-pink-400 focus-within:bg-white transition">
              <FontAwesomeIcon icon={faUser} className="text-xs text-violet-400" />
              <input
                required
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-transparent text-xs font-normal text-violet-950 outline-none placeholder:text-violet-300"
              />
            </div>
          </div>

          {/* E-mail */}
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

          {/* Alterar Senha (opcional) */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-700 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faLock} className="text-xs text-pink-400" />
                Alterar Senha
              </span>
              <span className="text-[10px] text-violet-400">
                (Preencha apenas se desejar mudar)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-violet-600 mb-1">
                  Nova Senha
                </label>
                <div className="flex h-10 items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 focus-within:border-pink-400 transition">
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
                <div className="flex h-10 items-center gap-2 rounded-xl border border-purple-200 bg-white px-3 focus-within:border-pink-400 transition">
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

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-700 transition underline"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                Sair da conta
              </button>
            ) : <span />}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-purple-200 px-4 py-2 text-xs font-medium text-violet-700 hover:bg-purple-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-pink-400 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-pink-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </form>
    </div>
  )
}

export default function ProfileModal({ isOpen, onClose, user, onUpdateUser, onLogout }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <ProfileModalContent
        key={`${user?.id}-${user?.name}-${user?.avatar}`}
        user={user}
        onClose={onClose}
        onUpdateUser={onUpdateUser}
        onLogout={onLogout}
      />
    </div>
  )
}
