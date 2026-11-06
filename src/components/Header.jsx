import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faChevronDown,
  faGear,
  faMagnifyingGlass,
  faRightFromBracket,
  faUsers,
  faPen,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import Brand from './Brand'
import Avatar from './Avatar'
import ProfileModal from './ProfileModal'
import { userService } from '../services/userService'

export default function Header({ variant = 'public' }) {
  const [user, setUser] = useState(() => userService.getCurrentUser())
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function syncUser() {
      setUser(userService.getCurrentUser())
    }

    window.addEventListener('auth-change', syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener('auth-change', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
    setProfileModalOpen(false)
    userService.clearSession()
    navigate('/')
  }

  function handleUpdateUser(updated) {
    setUser(updated)
  }

  const displayName = user ? (user.nome || user.name || 'Usuária').split(' ')[0] : ''
  const isAdmin = user && (user.tipo === 'admin' || user.email?.toLowerCase().includes('admin'))

  // Variante para o painel administrativo
  if (variant === 'admin') {
    return (
      <>
        <header className="flex h-16 items-center gap-4 bg-white px-4 shadow-sm sm:px-6">
          <Link
            to="/admin"
            className="flex shrink-0 items-center gap-2 text-pink-500"
          >
            <Brand className="h-9 w-9" />
            <span className="hidden font-serif font-bold text-lg sm:inline">ELLA Admin</span>
          </Link>

          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e22ce]"
            />
            <input
              type="search"
              placeholder="Buscar usuária, voluntária, evento ou conteúdo..."
              className="w-full rounded-lg bg-[#f3e8ff] py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label="Notificações"
              className="relative text-[#4c1d95]"
            >
              <FontAwesomeIcon icon={faBell} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-pink-500" />
            </button>

            <Link
              to="/admin/perfil"
              aria-label="Abrir perfil da administradora"
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-purple-50"
            >
              <Avatar
                nome={user?.nome || user?.name || 'Admin'}
                avatar={user?.avatar}
                tamanho="h-9 w-9"
              />
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.nome || user?.name || 'Admin ELLA'}
                </p>
                <p className="text-xs text-gray-500">Administradora</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="text-xs text-[#4c1d95]"
              />
            </Link>
          </div>
        </header>

        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      </>
    )
  }

  // Variante pública padrão
  return (
    <>
      <header className="relative z-20 grid w-full grid-cols-3 grid-rows-2 items-center gap-x-3 gap-y-2 rounded-b-xl border border-purple-100 bg-white px-4 py-2 shadow-sm sm:flex sm:h-16 sm:justify-between sm:gap-5 sm:px-6 sm:py-0">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-xs text-pink-500"
          aria-label="ELLA — início"
        >
          <Brand className="h-9 w-9" />
          <span className="hidden sm:inline font-bold tracking-wide">ELLA</span>
        </Link>

        <nav
          className="col-span-3 row-start-2 flex items-center justify-center gap-4 text-xs text-pink-500 sm:col-span-1 sm:row-auto sm:flex-1 sm:gap-7"
          aria-label="Navegação principal"
        >
          {[
            ['/', 'Início'],
            ['/sobre', 'Sobre'],
            ['/informacoes', 'Informações'],
            ['/apoio', 'Rede de Apoio'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap transition hover:text-pink-700 ${
                  isActive ? 'font-semibold text-pink-600' : ''
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="col-start-3 row-start-1 flex items-center justify-end gap-2 sm:gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Botão de Perfil: Avatar + Nome clicáveis */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="group flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50/70 py-1 pl-1 pr-3 text-left transition hover:border-pink-300 hover:bg-purple-100/80 focus:outline-none"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                title="Clique para gerenciar seu perfil e informações"
              >
                <Avatar
                  nome={user.nome || user.name}
                  avatar={user.avatar}
                  tamanho="h-7 w-7 sm:h-8 sm:w-8"
                  className="shadow-sm"
                />
                <span className="max-w-28 truncate text-xs font-semibold text-violet-900 group-hover:text-pink-600">
                  {displayName}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-[10px] text-violet-400 transition-transform duration-200 ${
                    menuOpen ? 'rotate-180 text-pink-500' : ''
                  }`}
                />
              </button>

              {/* Menu Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-purple-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-30">
                  {/* Cabeçalho do Usuário no Dropdown */}
                  <div
                    onClick={() => {
                      setMenuOpen(false)
                      setProfileModalOpen(true)
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-purple-50/60 p-2.5 transition hover:bg-purple-100/60"
                    title="Clique para editar"
                  >
                    <Avatar
                      nome={user.nome || user.name}
                      avatar={user.avatar}
                      tamanho="h-10 w-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-violet-950">
                        {user.nome || user.name}
                      </p>
                      <p className="truncate text-[11px] text-violet-400">
                        {user.email}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-[11px] text-pink-400 hover:text-pink-600"
                    />
                  </div>

                  <hr className="my-1.5 border-purple-100" />

                  {/* Opções do Menu */}
                  <div className="space-y-0.5">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-purple-800 bg-purple-50 transition hover:bg-purple-100"
                      >
                        <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 text-pink-500" />
                        Painel do Administrador
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        setProfileModalOpen(true)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-pink-50 hover:text-pink-600"
                    >
                      <FontAwesomeIcon icon={faGear} className="w-3.5 text-violet-400" />
                      Editar perfil e senha
                    </button>

                    <Link
                      to="/contas"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-pink-50 hover:text-pink-600"
                    >
                      <FontAwesomeIcon icon={faUsers} className="w-3.5 text-violet-400" />
                      Contas cadastradas
                    </Link>

                    <hr className="my-1 border-purple-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-pink-500 transition hover:bg-pink-50 hover:text-pink-700"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5" />
                      Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-2 py-1 text-xs text-pink-500 transition hover:bg-pink-50 sm:px-4"
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                className="whitespace-nowrap rounded-full bg-pink-400 px-3 py-1.5 text-xs text-white transition hover:bg-pink-500 sm:px-4"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Modal de Edição de Perfil e Senha */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
      />
    </>
  )
}
