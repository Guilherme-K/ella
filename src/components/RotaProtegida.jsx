import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { normalizarPapel, obterUsuarioLogado } from '../utils/navegacao'

export default function RotaProtegida({
  papeisPermitidos,
  exigirToken = false,
}) {
  const location = useLocation()
  const usuario = obterUsuarioLogado()
  const papel = normalizarPapel(usuario)

  // `exigirToken` garante que não basta ter dados antigos no localStorage:
  // é preciso uma sessão válida salva após o login.
  if (
    !usuario?.id ||
    (exigirToken && !localStorage.getItem('ella:token'))
  ) {
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
