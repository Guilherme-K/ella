
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

function obterPapel(usuario) {
  if (usuario?.tipo === 'admin' || usuario?.accountType === 'admin') {
    return 'admin'
  }

  const papel =
    usuario?.accountType ||
    usuario?.tipo ||
    usuario?.papel ||
    usuario?.role ||
    ''

  return papel
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function RotaProtegida({
  papeisPermitidos,
  exigirToken = false,
}) {
  const location = useLocation()
  const usuario = obterUsuario()
  const papel = obterPapel(usuario)

  if (!usuario?.id || (exigirToken && !localStorage.getItem('ella:token'))) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (papeisPermitidos && !papeisPermitidos.includes(papel)) {
    const destinos = {
      usuaria: '/chatusuario',
      voluntaria: '/chatvoluntaria',
      psicologa: '/chatvoluntaria',
      admin: '/admin',
    }

    return <Navigate to={destinos[papel] || '/'} replace />
  }

  return <Outlet />
}
