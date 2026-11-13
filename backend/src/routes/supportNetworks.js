import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import createError from '../utils/createError.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

// Cards da Rede de Apoio. A leitura é pública (página /apoio) e a escrita
// exige uma conta administradora.
const router = Router();

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 600;
const MAX_DESCRIPTION_WORDS = 30;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const PRESET_IMAGE = /^\/redes\/[a-z0-9-]+\.svg$/;
const IMAGE_DATA_URL = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/;

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function readName(value, { required = true } = {}) {
  if (value === undefined) {
    if (required) throw createError(400, 'Informe o nome da rede de apoio');
    return undefined;
  }

  const name = String(value).trim();

  if (!name) {
    throw createError(400, 'Informe o nome da rede de apoio');
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw createError(
      400,
      `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`,
    );
  }

  return name;
}

function readDescription(value, { required = true } = {}) {
  if (value === undefined) {
    if (required) {
      throw createError(400, 'Informe uma breve descrição');
    }
    return undefined;
  }

  const description = String(value).trim();

  if (!description) {
    throw createError(400, 'Informe uma breve descrição');
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw createError(
      400,
      `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres`,
    );
  }

  if (countWords(description) > MAX_DESCRIPTION_WORDS) {
    throw createError(
      400,
      `A descrição deve ter no máximo ${MAX_DESCRIPTION_WORDS} palavras`,
    );
  }

  return description;
}

function readImage(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  if (typeof value !== 'string') {
    throw createError(400, 'Imagem inválida');
  }

  const image = value.trim();

  // Imagens prontas que acompanham o projeto.
  if (PRESET_IMAGE.test(image)) {
    return image;
  }

  const match = IMAGE_DATA_URL.exec(image);

  if (!match) {
    throw createError(400, 'Envie uma imagem PNG, JPEG ou WebP');
  }

  const base64 = match[2];
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const bytes = Math.floor((base64.length * 3) / 4) - padding;

  if (bytes > MAX_IMAGE_BYTES) {
    throw createError(400, 'A imagem deve ter no máximo 2 MB');
  }

  return image;
}

function serializeNetwork(network) {
  return {
    ...network,
    nome: network.name,
    descricao: network.description,
    imagem: network.image,
  };
}

async function findNetwork(id) {
  if (!Number.isInteger(id)) {
    throw createError(400, 'ID inválido');
  }

  const network = await prisma.supportNetwork.findUnique({ where: { id } });

  if (!network) {
    throw createError(404, 'Rede de apoio não encontrada');
  }

  return network;
}

// GET /api/redes-apoio
router.get('/', async (req, res) => {
  const networks = await prisma.supportNetwork.findMany({
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });

  res.json(networks.map(serializeNetwork));
});

// POST /api/redes-apoio
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const data = req.body ?? {};

  const network = await prisma.supportNetwork.create({
    data: {
      name: readName(data.name ?? data.nome),
      description: readDescription(data.description ?? data.descricao),
      image: readImage(data.image ?? data.imagem) ?? null,
    },
  });

  res.status(201).json(serializeNetwork(network));
});

// PATCH /api/redes-apoio/:id
router.patch('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const id = Number(req.params.id);
  await findNetwork(id);

  const data = req.body ?? {};
  const changes = {};

  if (data.name !== undefined || data.nome !== undefined) {
    changes.name = readName(data.name ?? data.nome);
  }

  if (data.description !== undefined || data.descricao !== undefined) {
    changes.description = readDescription(
      data.description ?? data.descricao,
    );
  }

  if (data.image !== undefined || data.imagem !== undefined) {
    changes.image = readImage(data.image ?? data.imagem);
  }

  if (Object.keys(changes).length === 0) {
    throw createError(400, 'Nenhum dado válido para atualizar');
  }

  const network = await prisma.supportNetwork.update({
    where: { id },
    data: changes,
  });

  res.json(serializeNetwork(network));
});

// DELETE /api/redes-apoio/:id
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const id = Number(req.params.id);
  await findNetwork(id);

  await prisma.supportNetwork.delete({ where: { id } });

  res.status(204).end();
});

export default router;
