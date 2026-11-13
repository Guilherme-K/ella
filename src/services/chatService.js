const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function requisitar(caminho, opcoes = {}) {
  const token = localStorage.getItem('ella:token')

  let resposta
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    const erro = new Error(dados?.erro || 'Não foi possível concluir a operação.')
    erro.status = resposta.status
    throw erro
  }

  return dados
}

export const chatService = {
  listar: () => requisitar('/chat/mensagens'),

  enviar: (mensagem) =>
    requisitar('/chat/mensagens', {
      method: 'POST',
      body: JSON.stringify({ mensagem }),
    }),

  editar: (id, mensagem) =>
    requisitar(`/chat/mensagens/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ mensagem }),
    }),

  excluir: (id) =>
    requisitar(`/chat/mensagens/${id}`, { method: 'DELETE' }),
}