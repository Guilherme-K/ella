import { Router } from 'express';

import bcrypt from 'bcryptjs';

import { prisma } from '../lib/prisma.js';

import createError from '../utils/createError.js';

import { generateToken } from '../utils/jwt.js';
import { authenticate, onlySelf } from '../middlewares/auth.js';

const router = Router();

// Campos que podem ser devolvidos ao cliente (nunca a senha).
const userFilter = {
  id: true,
  name: true,
  email: true,
};

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function readName(data) {
  // Aceita "name" (padrão da API) e "nome" (usado pelo frontend atual).
  const name = data.name ?? data.nome;
  return typeof name === 'string' ? name.trim() : null;
}

function validatePassword(password) {
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw createError(400, 'Senha obrigatória e com no mínimo 8 caracteres');
  }
}

// GET /api/users
// Exibe os usuários cadastrados (sem a senha).
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: userFilter,
    orderBy: { id: 'asc' },
  });

  res.json(users);
});

// POST /api/users
// Cadastro de usuário.
router.post('/', async (req, res) => {
  const data = req.body ?? {};

  if (!data.email || !data.password) {
    throw createError(400, 'E-mail e senha são obrigatórios');
  }

  validatePassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: normalizeEmail(data.email),
      name: readName(data),
      password: await bcrypt.hash(data.password, 10),
    },
    select: userFilter,
  });

  res.status(201).json(user);
});

// POST /api/users/login
// Login com e-mail e senha. Retorna os dados do usuário e o token JWT.
router.post('/login', async (req, res) => {
  const data = req.body ?? {};

  if (!data.email || !data.password) {
    throw createError(401, 'O usuário e a senha são obrigatórios');
  }

  // findUnique (sem OrThrow) para não revelar se o e-mail existe.
  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(data.email),
    },
    select: {
      ...userFilter,
      password: true,
    },
  });

  const passwordCheck =
    user &&
    user.password &&
    (await bcrypt.compare(data.password, user.password));

  if (!passwordCheck) {
    throw createError(401, 'Usuário ou senha incorreto(s)');
  }

  const { password, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword);

  res.json({ user: userWithoutPassword, token });
});

// GET /api/users/:id
// Exibe os dados de um usuário específico.
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw createError(400, 'ID inválido');
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: userFilter,
  });

  res.json({ user });
});

// PATCH /api/users/:id
// Atualiza os próprios dados. Exige token JWT.
router.patch('/:id', authenticate, onlySelf, async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body ?? {};

  const changes = {};

  if (data.email !== undefined) {
    if (!data.email) {
      throw createError(400, 'E-mail não pode ficar vazio');
    }
    changes.email = normalizeEmail(data.email);
  }

  if (data.name !== undefined || data.nome !== undefined) {
    changes.name = readName(data);
  }

  if (data.password !== undefined) {
    validatePassword(data.password);
    changes.password = await bcrypt.hash(data.password, 10);
  }

  if (Object.keys(changes).length === 0) {
    throw createError(400, 'Nenhum dado válido para atualizar');
  }

  const user = await prisma.user.update({
    where: { id },
    data: changes,
    select: userFilter,
  });

  res.json({ user });
});

// DELETE /api/users/:id
// Exclui a própria conta. Exige token JWT.
router.delete('/:id', authenticate, onlySelf, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.user.delete({
    where: { id },
  });

  res.status(204).end();
});

export default router;
