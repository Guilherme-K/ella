import { Navigate } from 'react-router-dom'
import { lerUsuarioLogado } from '../services/useChat'

function Chat() {
  const usuario = lerUsuarioLogado()

  if (!usuario?.id || !localStorage.getItem('ella:token')) {
    return <Navigate to="/login" replace />
  }

  const tipo = (
    usuario.tipo === 'admin'
      ? 'admin'
      : usuario.accountType || usuario.tipo || usuario.papel || usuario.role || ''
  )
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (tipo === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if (tipo === 'voluntaria') {
    return <Navigate to="/chatvoluntaria" replace />
  }

  if (tipo === 'usuaria') {
    return <Navigate to="/chatusuario" replace />
  }

  if (tipo === 'psicologa') {
    return <Navigate to="/chatvoluntaria" replace />
  }

  return <Navigate to="/" replace />
}

export default Chat