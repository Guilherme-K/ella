import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import createError from '../utils/createError.js';

// Registro dos acionamentos do botão de emergência (ligação para o 190).
// As duas rotas são públicas: a Home consulta o total e a página de
// emergência registra cada acionamento.
const router = Router();

const DEFAULT_TYPE = 'ligacao_policial';
const ALLOWED_TYPES = ['ligacao_policial'];

function readType(value) {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_TYPE;
  }

  const type = String(value).trim().toLowerCase();
  return ALLOWED_TYPES.includes(type) ? type : null;
}

// POST /api/emergencia/acionamentos
router.post('/acionamentos', async (req, res) => {
  const type = readType(req.body?.type ?? req.body?.tipo);

  if (!type) {
    throw createError(400, 'Tipo de acionamento inválido');
  }

  const acionamento = await prisma.emergencyCall.create({
    data: { type },
  });

  res.status(201).json({
    id: acionamento.id,
    tipo: acionamento.type,
    createdAt: acionamento.createdAt,
  });
});

// GET /api/emergencia/acionamentos/total
router.get('/acionamentos/total', async (req, res) => {
  const total = await prisma.emergencyCall.count();

  res.set('Cache-Control', 'no-store');
  res.json({ total });
});

export default router;
