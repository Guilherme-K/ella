
import { Navigate } from 'react-router-dom'

function Chat() {
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
    } catch {
      return null
    }
  })()

  if (!usuario?.id) {
    return <Navigate to="/login" replace />
  }

  const tipo = (usuario.tipo || usuario.papel || usuario.role || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (tipo === 'admin') {
    return <Navigate to="/admin/chats" replace />
  }

  if (tipo === 'voluntaria') {
    return <Navigate to="/chatvoluntaria" replace />
  }

  if (tipo === 'usuaria') {
    return <Navigate to="/chatusuario" replace />
  }

  if (tipo === 'psicologa') {
    return <Navigate to="/" replace />
  }

  return <Navigate to="/" replace />
}

export default Chat
