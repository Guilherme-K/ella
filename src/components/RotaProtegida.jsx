
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

function obterPapel(usuario) {
  const papel = usuario?.tipo || usuario?.papel || usuario?.role || ''

  return papel
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function RotaProtegida({ papeisPermitidos }) {
  const location = useLocation()
  const usuario = obterUsuario()
  const papel = obterPapel(usuario)

  if (!usuario?.id) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (papeisPermitidos && !papeisPermitidos.includes(papel)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
