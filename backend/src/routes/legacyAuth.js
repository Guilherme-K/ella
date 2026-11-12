import { Router } from 'express';
import bcrypt from 'bcryptjs';

import { prisma } from '../lib/prisma.js';
import { generateToken } from '../utils/jwt.js';

// Rotas de compatibilidade com o frontend da main:
// - POST /cadastro
// - POST /login
// - GET  /teste-banco
//
// Elas usam o Prisma e o banco backend_db, mantendo o formato de resposta
// esperado pelas telas atuais (campos "nome", "tipo" e "erro").
const router = Router();

const DEFAULT_ROLE = 'usuaria';

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
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
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(201).json({
      id: user.id,
      nome: user.name,
      email: user.email,
      tipo: DEFAULT_ROLE,
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
        id: true,
        name: true,
        email: true,
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

    const { password: _senha, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    res.json({
      id: userWithoutPassword.id,
      nome: userWithoutPassword.name,
      email: userWithoutPassword.email,
      tipo: DEFAULT_ROLE,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
});

export default router;
