import { useCallback, useEffect, useState } from 'react';

import { messageService } from '../services/messageService';

// Carrega e mantém as mensagens salvas de uma conversa privada.
// O identificador `chat` separa, por exemplo, "usuaria", "voluntaria" e
// "admin:1". Nada é compartilhado entre contas.
export function useChatMessages(chat) {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(Boolean(chat));
  const [erro, setErro] = useState('');

  const recarregar = useCallback(async () => {
    if (!chat) {
      setMensagens([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      setMensagens(await messageService.list(chat));
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar as mensagens.');
    } finally {
      setCarregando(false);
    }
  }, [chat]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      if (!chat) {
        if (ativo) {
          setMensagens([]);
          setCarregando(false);
        }
        return;
      }

      setCarregando(true);
      setErro('');

      try {
        const lista = await messageService.list(chat);
        if (ativo) setMensagens(lista);
      } catch (error) {
        if (ativo) {
          setErro(error.message || 'Não foi possível carregar as mensagens.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [chat]);

  async function enviar(texto) {
    const limpo = texto.trim();
    if (!limpo) return null;

    const criada = await messageService.create(chat, limpo);
    setMensagens((atual) => [...atual, criada]);
    return criada;
  }

  async function editar(id, texto) {
    const atualizada = await messageService.update(id, texto.trim());
    setMensagens((atual) =>
      atual.map((mensagem) =>
        mensagem.id === id ? atualizada : mensagem,
      ),
    );
    return atualizada;
  }

  async function excluir(id) {
    await messageService.remove(id);
    setMensagens((atual) => atual.filter((mensagem) => mensagem.id !== id));
  }

  return { mensagens, carregando, erro, enviar, editar, excluir, recarregar };
}
