import { Navigate } from 'react-router-dom'

function Chat() {
    const usuario = JSON.parse(
        localStorage.getItem('usuarioLogado') || 'null'
    )

    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    if (usuario.tipo === 'voluntaria') {
        return <Navigate to="/chatvoluntaria" replace />
    }

    if (usuario.tipo === 'admin') {
        return <Navigate to="/chatadmin" replace />
    }

    return <Navigate to="/chatusuario" replace />
}

export default Chat;