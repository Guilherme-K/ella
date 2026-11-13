import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from './chatService'

export function lerUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

export function formatarHora(data) {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function useChat() {
  const navigate = useNavigate()
  const [mensagens, setMensagens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const tratarErro = useCallback(
    (falha) => {
      if (falha.status === 401) {
        localStorage.removeItem('usuarioLogado')
        localStorage.removeItem('ella:token')
        navigate('/login', { replace: true })
        return
      }
      setErro(falha.message)
    },
    [navigate],
  )

  useEffect(() => {
    let ativo = true

    chatService
      .listar()
      .then((lista) => {
        if (ativo) setMensagens(lista)
      })
      .catch((falha) => {
        if (ativo) tratarErro(falha)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [tratarErro])

  async function enviar(texto) {
    setErro('')
    try {
      const nova = await chatService.enviar(texto)
      setMensagens((atuais) => [...atuais, nova])
      return true
    } catch (falha) {
      tratarErro(falha)
      return false
    }
  }

  async function editar(id, texto) {
    setErro('')
    try {
      const atualizada = await chatService.editar(id, texto)
      setMensagens((atuais) =>
        atuais.map((item) => (item.id === id ? atualizada : item)),
      )
      return true
    } catch (falha) {
      tratarErro(falha)
      return false
    }
  }

  async function excluir(id) {
    setErro('')
    try {
      await chatService.excluir(id)
      setMensagens((atuais) => atuais.filter((item) => item.id !== id))
    } catch (falha) {
      tratarErro(falha)
    }
  }

  return { mensagens, carregando, erro, enviar, editar, excluir }
}