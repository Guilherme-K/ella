import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faChevronDown,
  faMagnifyingGlass,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import Brand from './Brand'

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

function normalizarPapel(usuario) {
  return (usuario?.tipo || usuario?.papel || usuario?.role || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Header({ variant = 'public' }) {
  const navigate = useNavigate()
  const usuario = obterUsuario()
  const papel = normalizarPapel(usuario)

  const destinos = {
    usuaria: '/perfiluser',
    voluntaria: '/chatvoluntaria',
    psicologa: '/contas',
    admin: '/admin',
  }

  function sair() {
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('ella:token')
    navigate('/', { replace: true })
  }

  if (variant === 'admin') {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-white px-4 shadow-sm sm:px-6">
        <Link
          to="/admin"
          className="flex shrink-0 items-center gap-2 text-pink-500"
        >
          <Brand className="h-9 w-9" />
          <span className="hidden sm:inline">ELLA</span>
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

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
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
            className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-purple-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3b1a6e] text-white">
              <FontAwesomeIcon icon={faUser} />
            </span>

            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {usuario?.nome || 'Admin ELLA'}
              </p>
              <p className="text-xs text-gray-500">Administradora</p>
            </div>

            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-xs text-[#4c1d95]"
            />
          </Link>

          <button
            type="button"
            onClick={sair}
            className="text-xs font-medium text-pink-500 hover:text-pink-700 sm:text-sm"
          >
            Sair
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 grid w-full grid-cols-3 grid-rows-2 items-center gap-x-3 gap-y-2 rounded-b-xl border border-purple-100 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:flex sm:h-16 sm:justify-between sm:gap-5 sm:px-6 sm:py-0">
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2 text-xs text-pink-500"
        aria-label="ELLA — início"
      >
        <Brand className="h-9 w-9" />
        <span className="hidden sm:inline">ELLA</span>
      </Link>

      <nav
        className="col-span-3 row-start-2 flex items-center justify-center gap-3 text-xs text-pink-500 sm:col-span-1 sm:row-auto sm:flex-1 sm:gap-7 sm:text-sm"
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
        {usuario ? (
          <>
            <Link
              to={destinos[papel] || '/perfiluser'}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-pink-500 transition hover:bg-pink-50 sm:px-4 sm:text-sm"
            >
              Minha área
            </Link>

            <button
              type="button"
              onClick={sair}
              className="rounded-full bg-pink-400 px-3 py-1.5 text-xs text-white transition hover:bg-pink-500 sm:px-4 sm:text-sm"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-full px-2 py-1 text-xs text-pink-500 transition hover:bg-pink-50 sm:px-4 sm:text-sm"
            >
              Login
            </Link>

            <Link
              to="/cadastro"
              className="whitespace-nowrap rounded-full bg-pink-400 px-3 py-1.5 text-xs text-white transition hover:bg-pink-500 sm:px-4 sm:text-sm"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
