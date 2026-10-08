import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand'

export default function Header() {
  return (
    <header className="relative z-20 grid w-full grid-cols-3 grid-rows-2 items-center gap-x-3 gap-y-2 rounded-b-xl border border-purple-100 bg-white px-4 py-2 shadow-sm sm:flex sm:h-16 sm:justify-between sm:gap-5 sm:px-6 sm:py-0">
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2 text-xs text-pink-500"
        aria-label="ELLA — início"
      >
        <Brand className="h-9 w-9" />
        <span className="hidden sm:inline">ELLA</span>
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
              `whitespace-nowrap transition hover:text-pink-700 ${isActive ? 'font-semibold text-pink-600' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="col-start-3 row-start-1 flex items-center justify-end gap-2 sm:gap-3">
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
      </div>
    </header>
  )
}
