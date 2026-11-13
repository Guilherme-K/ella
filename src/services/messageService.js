import { httpClient } from './httpClient';
import { userService } from './userService';

const ENDPOINT = '/api/mensagens';

function normalize(message) {
  return {
    id: message.id,
    chat: message.chat,
    texto: message.body ?? message.texto ?? '',
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

// Mensagens privadas do próprio usuário. O token identifica de quem são as
// mensagens e o backend sempre filtra pelo usuário autenticado.
export const messageService = {
  list: async (chat) => {
    const data = await httpClient.get(
      `${ENDPOINT}?chat=${encodeURIComponent(chat)}`,
      { token: userService.getToken() },
    );

    return (data ?? []).map(normalize);
  },

  create: async (chat, body) => {
    const data = await httpClient.post(
      ENDPOINT,
      { chat, body },
      { token: userService.getToken() },
    );

    return normalize(data);
  },

  update: async (id, body) => {
    const data = await httpClient.patch(
      `${ENDPOINT}/${id}`,
      { body },
      { token: userService.getToken() },
    );

    return normalize(data);
  },

  remove: (id) =>
    httpClient.delete(`${ENDPOINT}/${id}`, {
      token: userService.getToken(),
    }),
};
