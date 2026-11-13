import createError from '../utils/createError.js';
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../lib/prisma.js';

// Middleware de autenticação:
// exige o cabeçalho "Authorization: Bearer <token>".
// Se o token for válido, guarda os dados do usuário em req.user.
// O papel é lido do banco (e não apenas do token) para que tokens antigos,
// emitidos antes da inclusão do papel, continuem funcionando.
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError(401, 'Token não informado');
  }

  const token = authHeader.split(' ')[1];

  let payload;

  try {
    payload = verifyToken(token);
  } catch {
    throw createError(401, 'Token inválido ou expirado');
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw createError(401, 'Usuário do token não existe mais');
  }

  req.user = user;

  next();
}

// Middleware de autorização:
// só deixa passar se o :id da rota for o mesmo do usuário do token.
// Deve ser usado DEPOIS de authenticate.
function onlySelf(req, res, next) {
  const id = Number(req.params.id);

  if (req.user.id !== id) {
    throw createError(403, 'Você só pode alterar os seus próprios dados');
  }

  next();
}

// Exige que o usuário autenticado tenha um dos papéis informados.
// Deve ser usado DEPOIS de authenticate.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw createError(403, 'Você não tem permissão para acessar este recurso');
    }

    next();
  };
}

export { authenticate, onlySelf, requireRole };
