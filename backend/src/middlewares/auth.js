import createError from '../utils/createError.js';
import { verifyToken } from '../utils/jwt.js';

// Middleware de autenticação:
// exige o cabeçalho "Authorization: Bearer <token>".
// Se o token for válido, guarda os dados do usuário em req.user.
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError(401, 'Token não informado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      tipo: payload.tipo || 'usuario',
    };
  } catch {
    throw createError(401, 'Token inválido ou expirado');
  }

  next();
}

// Middleware de autorização:
// Deixa passar se o :id da rota for o do próprio usuário OU se o usuário for administrador.
function onlySelf(req, res, next) {
  const id = Number(req.params.id);

  if (req.user.id !== id && req.user.tipo !== 'admin') {
    throw createError(403, 'Acesso não autorizado');
  }

  next();
}

export { authenticate, onlySelf };
