import { httpClient } from './httpClient';
import { userService } from './userService';
import { supportServices } from '../data/homeData';

const ENDPOINT = '/api/redes-apoio';

function normalize(network) {
  return {
    id: network.id,
    nome: network.name ?? network.nome ?? network.title ?? '',
    categoria: network.category ?? network.categoria ?? '',
    descricao: network.description ?? network.descricao ?? '',
    detalhes: network.details ?? network.detalhes ?? '',
    site: network.website ?? network.site ?? '',
    telefone: network.phone ?? network.telefone ?? '',
    imagem: network.image ?? network.imagem ?? '',
    createdAt: network.createdAt,
    updatedAt: network.updatedAt,
  };
}

function authOptions() {
  return { token: userService.getToken() };
}

function toPayload(network) {
  return {
    name: network.nome,
    category: network.categoria,
    description: network.descricao,
    details: network.detalhes,
    website: network.site,
    phone: network.telefone,
    image: network.imagem,
  };
}

export const supportNetworkService = {
  // Leitura pública, usada pela Home e pela página /apoio. Quando a API falha,
  // as páginas públicas usam os cards locais como reserva; o painel admin passa
  // `fallback: false` para nunca exibir dados locais como se fossem do MySQL.
  list: async ({ fallback = true } = {}) => {
    try {
      const data = await httpClient.get(ENDPOINT);
      const items = (data ?? []).map(normalize);
      return items.length > 0 || !fallback
        ? items
        : supportServices.map(normalize);
    } catch (error) {
      if (!fallback) throw error;
      return supportServices.map(normalize);
    }
  },

  // Leitura pública de um card, usada pela página /apoio/:id.
  get: async (id) => {
    try {
      const data = await httpClient.get(`${ENDPOINT}/${id}`);
      return normalize(data);
    } catch (error) {
      // Fallback para itens locais por id ou nome
      const local = supportServices.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.nome).toLowerCase() ===
            decodeURIComponent(String(id)).toLowerCase(),
      );

      if (local) return normalize(local);
      throw error;
    }
  },

  create: async (network) => {
    const data = await httpClient.post(
      ENDPOINT,
      toPayload(network),
      authOptions(),
    );

    return normalize(data);
  },

  update: async (id, network) => {
    const data = await httpClient.patch(
      `${ENDPOINT}/${id}`,
      toPayload(network),
      authOptions(),
    );

    return normalize(data);
  },

  remove: (id) =>
    httpClient.delete(`${ENDPOINT}/${id}`, authOptions()),
};
