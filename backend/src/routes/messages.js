import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import createError from '../utils/createError.js';
import { authenticate } from '../middlewares/auth.js';

// Mensagens salvas pelo próprio usuário em cada tela de chat.
// Não existe troca de mensagens entre contas: todas as consultas são
// filtradas pelo usuário do token.
const router = Router();

const MAX_BODY_LENGTH = 2000;
const DEFAULT_CHAT = 'usuaria';
const CHAT_PATTERN = /^[a-z]+(?::\d{1,6})?$/;

function readChat(value) {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_CHAT;
  }

  const chat = String(value).trim().toLowerCase();

  if (chat.length > 40 || !CHAT_PATTERN.test(chat)) {
    throw createError(400, 'Identificador de conversa inválido');
  }

  return chat;
}

function readBody(value) {
  const body = typeof value === 'string' ? value.trim() : '';

  if (!body) {
    throw createError(400, 'Escreva uma mensagem antes de enviar');
  }

  if (body.length > MAX_BODY_LENGTH) {
    throw createError(
      400,
      `A mensagem deve ter no máximo ${MAX_BODY_LENGTH} caracteres`,
    );
  }

  return body;
}

function serializeMessage(message) {
  return {
    id: message.id,
    chat: message.chat,
    body: message.body,
    texto: message.body,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

async function findOwnMessage(id, userId) {
  if (!Number.isInteger(id)) {
    throw createError(400, 'ID inválido');
  }

  const message = await prisma.chatMessage.findFirst({
    where: { id, userId },
  });

  if (!message) {
    throw createError(404, 'Mensagem não encontrada');
  }

  return message;
}

router.use(authenticate);

// GET /api/mensagens?chat=usuaria
router.get('/', async (req, res) => {
  const chat = readChat(req.query.chat);

  const messages = await prisma.chatMessage.findMany({
    where: { chat, userId: req.user.id },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });

  res.set('Cache-Control', 'no-store');
  res.json(messages.map(serializeMessage));
});

// POST /api/mensagens
router.post('/', async (req, res) => {
  const data = req.body ?? {};
  const chat = readChat(data.chat);
  const body = readBody(data.body ?? data.texto ?? data.mensagem);

  const message = await prisma.chatMessage.create({
    data: {
      chat,
      body,
      userId: req.user.id,
    },
  });

  res.status(201).json(serializeMessage(message));
});

// PATCH /api/mensagens/:id
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await findOwnMessage(id, req.user.id);

  const data = req.body ?? {};
  const body = readBody(data.body ?? data.texto ?? data.mensagem);

  const message = await prisma.chatMessage.update({
    where: { id },
    data: { body },
  });

  res.json(serializeMessage(message));
});

// DELETE /api/mensagens/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await findOwnMessage(id, req.user.id);

  await prisma.chatMessage.delete({ where: { id } });

  res.status(204).end();
});

export default router;
