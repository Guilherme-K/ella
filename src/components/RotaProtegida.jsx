import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { normalizarPapel, obterUsuarioLogado } from '../utils/navegacao'

export default function RotaProtegida({
  papeisPermitidos,
  exigirToken = false,
}) {
  const location = useLocation()
  const usuario = obterUsuarioLogado()
  const papel = normalizarPapel(usuario)
  const temToken = Boolean(localStorage.getItem('ella:token'))

  // `exigirToken` garante que não basta ter dados antigos no localStorage:
  // é preciso uma sessão válida salva após o login.
  if (
    !usuario?.id ||
    (exigirToken && !temToken)
  ) {
    // Remove dados de uma sessão sem token para não deixar o header "logado"
    // nem criar um ciclo de redirecionamento entre /login e a rota protegida.
    if (usuario?.id && exigirToken && !temToken) {
      localStorage.removeItem('usuarioLogado')
    }

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
