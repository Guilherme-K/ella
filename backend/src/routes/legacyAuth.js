import { Router } from 'express';
import bcrypt from 'bcryptjs';

import { prisma } from '../lib/prisma.js';
import { generateToken } from '../utils/jwt.js';
import {
  DEFAULT_AVATAR,
  DEFAULT_ROLE,
} from '../constants/user.js';

// Rotas de compatibilidade com o frontend da main:
// - POST /cadastro
// - POST /login
// - GET  /teste-banco
//
// Elas usam o Prisma e o banco backend_db, mantendo o formato de resposta
// esperado pelas telas atuais (campos "nome", "tipo", "avatar" e "erro").
const router = Router();

const userFilter = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  nickname: true,
  bio: true,
  city: true,
  phone: true,
  createdAt: true,
};

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

// Formato plano usado pela tela de login/cadastro da main.
function serializeUser(user) {
  return {
    ...user,
    nome: user.name,
    apelido: user.nickname,
    tipo: user.role,
  };
}

router.get('/teste-banco', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 AS conectado`;
    const row = result[0] ?? {};

    res.json({ conectado: Number(row.conectado ?? 1) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, password } = req.body ?? {};

    if (!nome || !email || !password) {
      return res.status(400).json({
        erro: 'Preencha nome, e-mail e senha.',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        erro: 'A senha deve ter pelo menos 6 caracteres.',
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existe = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existe) {
      return res.status(409).json({
        erro: 'Este e-mail já está cadastrado.',
      });
    }

    const user = await prisma.user.create({
      data: {
        name: String(nome).trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        role: DEFAULT_ROLE,
        avatar: DEFAULT_AVATAR,
      },
      select: userFilter,
    });

    const token = generateToken(user);
    const serialized = serializeUser(user);

    res.status(201).json({
      ...serialized,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      select: {
        ...userFilter,
        password: true,
      },
    });

    const senhaCorreta =
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password));

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    const token = generateToken(userWithoutPassword);

    res.json({
      ...serializeUser(userWithoutPassword),
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
});

export default router;
