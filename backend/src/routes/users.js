import { Router } from 'express';

import bcrypt from 'bcryptjs';

import { prisma } from '../lib/prisma.js';

import createError from '../utils/createError.js';

import { generateToken } from '../utils/jwt.js';
import { authenticate, onlySelf, requireRole } from '../middlewares/auth.js';
import { normalizeAccountType, readCrm } from '../utils/accountType.js';
import {
  AVATAR_IDS,
  DEFAULT_AVATAR,
  DEFAULT_ROLE,
} from '../constants/user.js';

const router = Router();

// Campos que podem ser devolvidos ao cliente (nunca a senha).
const userFilter = {
  id: true,
  name: true,
  email: true,
  role: true,
  accountType: true,
  crm: true,
  avatar: true,
  photo: true,
  nickname: true,
  bio: true,
  city: true,
  phone: true,
  areasAtuacao: true,
  createdAt: true,
};

// Mantém também os nomes usados pelo frontend (nome, apelido, tipo).
function serializeUser(user) {
  if (!user) return user;

  return {
    ...user,
    nome: user.name,
    apelido: user.nickname,
    tipo: user.role,
    areas_atuacao: user.areasAtuacao,
  };
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function readName(data) {
  // Aceita "name" (padrão da API) e "nome" (usado pelo frontend atual).
  const name = data.name ?? data.nome;
  return typeof name === 'string' ? name.trim() : null;
}

function readOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function validatePassword(password) {
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw createError(400, 'Senha obrigatória e com no mínimo 6 caracteres');
  }
}

function readAvatar(value) {
  if (value === undefined) return undefined;

  if (!AVATAR_IDS.includes(value)) {
    throw createError(400, 'Avatar inválido');
  }

  return value;
}

// Foto de perfil enviada pelo frontend como data URL (base64).
// Limite de 2 MB, apenas PNG, JPEG e WebP.
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PHOTO_DATA_URL = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/;

function readPhoto(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  if (typeof value !== 'string') {
    throw createError(400, 'Foto inválida');
  }

  const dataUrl = value.trim();
  const match = PHOTO_DATA_URL.exec(dataUrl);

  if (!match) {
    throw createError(400, 'Envie uma imagem PNG, JPEG ou WebP');
  }

  // Cada 4 caracteres base64 representam 3 bytes; desconta o padding.
  const base64 = match[2];
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const bytes = Math.floor((base64.length * 3) / 4) - padding;

  if (bytes > MAX_PHOTO_BYTES) {
    throw createError(400, 'A foto deve ter no máximo 2 MB');
  }

  return dataUrl;
}

// Formas de ajuda do cadastro de voluntárias (mesmas opções da página
// /voluntaria). "Profissional" indica atuação profissional e passa a conta
// para o tipo "psicologa".
const VOLUNTEER_AREAS = ['Acolhimento', 'Divulgação', 'Eventos', 'Profissional'];

function readAreas(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const raw = Array.isArray(value) ? value : String(value).split(',');
  const areas = [
    ...new Set(raw.map((area) => String(area).trim()).filter(Boolean)),
  ];

  if (!areas.every((area) => VOLUNTEER_AREAS.includes(area))) {
    throw createError(400, 'Forma de ajudar inválida');
  }

  return VOLUNTEER_AREAS.filter((area) => areas.includes(area)).join(', ');
}

async function buildProfileChanges(data) {
  const changes = {};

  if (data.email !== undefined) {
    if (!data.email) {
      throw createError(400, 'E-mail não pode ficar vazio');
    }
    changes.email = normalizeEmail(data.email);
  }

  if (data.name !== undefined || data.nome !== undefined) {
    const name = readName(data);

    if (!name) {
      throw createError(400, 'Nome não pode ficar vazio');
    }

    changes.name = name;
  }

  if (data.nickname !== undefined || data.apelido !== undefined) {
    changes.nickname = readOptionalString(data.nickname ?? data.apelido);
  }

  if (data.bio !== undefined) {
    changes.bio = readOptionalString(data.bio);
  }

  if (data.city !== undefined || data.cidade !== undefined) {
    changes.city = readOptionalString(data.city ?? data.cidade);
  }

  if (data.phone !== undefined || data.telefone !== undefined) {
    changes.phone = readOptionalString(data.phone ?? data.telefone);
  }

  if (data.areasAtuacao !== undefined || data.areas_atuacao !== undefined) {
    changes.areasAtuacao = readAreas(
      data.areasAtuacao ?? data.areas_atuacao,
    );
  }

  if (data.avatar !== undefined) {
    changes.avatar = readAvatar(data.avatar);
  }

  if (data.photo !== undefined) {
    changes.photo = readPhoto(data.photo);
  }

  if (data.password !== undefined) {
    validatePassword(data.password);
    changes.password = await bcrypt.hash(data.password, 10);
  }

  return changes;
}

// GET /api/users
// Exibe os usuários cadastrados (sem a senha). Apenas administradores.
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const users = await prisma.user.findMany({
    select: userFilter,
    orderBy: { id: 'asc' },
  });

  res.json(users.map(serializeUser));
});

// GET /api/users/me
// Exibe os dados do usuário autenticado (usado pela página Minha área).
router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.user.id },
    select: userFilter,
  });

  res.json({ user: serializeUser(user) });
});

// PATCH /api/users/me
// Atualiza os dados do próprio usuário autenticado.
router.patch('/me', authenticate, async (req, res) => {
  const changes = await buildProfileChanges(req.body ?? {});

  if (Object.keys(changes).length === 0) {
    throw createError(400, 'Nenhum dado válido para atualizar');
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: changes,
    select: userFilter,
  });

  res.json({ user: serializeUser(user) });
});

// POST /api/users
// Cadastro de usuário. O cadastro público cria "usuaria" (role) e permite
// escolher o tipo de conta (usuária, voluntária ou psicóloga) para exibição
// no painel admin. Psicólogas podem informar CRM (sem validação).
router.post('/', async (req, res) => {
  const data = req.body ?? {};

  if (!data.email || !data.password) {
    throw createError(400, 'E-mail e senha são obrigatórios');
  }

  validatePassword(data.password);

  const accountType = normalizeAccountType(data.accountType ?? data.tipoConta);
  if (!accountType) {
    throw createError(400, 'Tipo de conta inválido');
  }

  const user = await prisma.user.create({
    data: {
      email: normalizeEmail(data.email),
      name: readName(data),
      password: await bcrypt.hash(data.password, 10),
      role: DEFAULT_ROLE,
      accountType,
      crm: accountType === 'psicologa' ? readCrm(data.crm) : null,
      avatar: DEFAULT_AVATAR,
    },
    select: userFilter,
  });

  res.status(201).json(serializeUser(user));
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

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  const token = generateToken(userWithoutPassword);

  res.json({ user: serializeUser(userWithoutPassword), token });
});

// POST /api/users/me/voluntaria
// Inscrição de voluntária: atualiza os dados da própria conta autenticada.
// Quem escolhe "Profissional" passa a ser do tipo "psicologa"; o papel de
// administrador nunca é alterado por esta rota.
router.post('/me/voluntaria', authenticate, async (req, res) => {
  const data = req.body ?? {};

  const current = await prisma.user.findUniqueOrThrow({
    where: { id: req.user.id },
    select: { email: true, role: true, accountType: true },
  });

  if (current.role === 'admin') {
    throw createError(403, 'Esta conta não pode se inscrever como voluntária');
  }

  if (
    data.email !== undefined &&
    normalizeEmail(data.email) !== normalizeEmail(current.email)
  ) {
    throw createError(
      403,
      'O e-mail informado não corresponde à conta autenticada',
    );
  }

  const city = readOptionalString(data.city ?? data.cidade);
  if (!city) {
    throw createError(400, 'Informe a sua cidade');
  }
  if (city.length > 100) {
    throw createError(400, 'Cidade inválida');
  }

  const phone = readOptionalString(data.phone ?? data.telefone);
  if (phone && phone.length > 20) {
    throw createError(400, 'Telefone inválido');
  }

  const areas = readAreas(
    data.areas ?? data.areasAtuacao ?? data.areas_atuacao,
  );
  if (!areas) {
    throw createError(400, 'Escolha pelo menos uma forma de ajudar');
  }

  const accountType =
    current.role === 'psicologa' || areas.includes('Profissional')
      ? 'psicologa'
      : 'voluntaria';

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      role: accountType,
      accountType,
      city,
      phone,
      areasAtuacao: areas,
    },
    select: userFilter,
  });

  res.json({ user: serializeUser(user) });
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

  res.json({ user: serializeUser(user) });
});

// PATCH /api/users/:id
// Atualiza os próprios dados. Exige token JWT.
router.patch('/:id', authenticate, onlySelf, async (req, res) => {
  const id = Number(req.params.id);
  const changes = await buildProfileChanges(req.body ?? {});

  if (Object.keys(changes).length === 0) {
    throw createError(400, 'Nenhum dado válido para atualizar');
  }

  const user = await prisma.user.update({
    where: { id },
    data: changes,
    select: userFilter,
  });

  res.json({ user: serializeUser(user) });
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
