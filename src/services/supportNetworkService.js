import { httpClient } from './httpClient';
import { userService } from './userService';

const ENDPOINT = '/api/redes-apoio';

function normalize(network) {
  return {
    id: network.id,
    nome: network.name ?? network.nome ?? '',
    descricao: network.description ?? network.descricao ?? '',
    imagem: network.image ?? network.imagem ?? '',
    createdAt: network.createdAt,
    updatedAt: network.updatedAt,
  };
}

function authOptions() {
  return { token: userService.getToken() };
}

export const supportNetworkService = {
  // Leitura pública, usada pela página /apoio.
  list: async () => {
    const data = await httpClient.get(ENDPOINT);
    return (data ?? []).map(normalize);
  },

  create: async (network) => {
    const data = await httpClient.post(
      ENDPOINT,
      {
        name: network.nome,
        description: network.descricao,
        image: network.imagem,
      },
      authOptions(),
    );

    return normalize(data);
  },

  update: async (id, network) => {
    const data = await httpClient.patch(
      `${ENDPOINT}/${id}`,
      {
        name: network.nome,
        description: network.descricao,
        image: network.imagem,
      },
      authOptions(),
    );

    return normalize(data);
  },

  remove: (id) =>
    httpClient.delete(`${ENDPOINT}/${id}`, authOptions()),
};
