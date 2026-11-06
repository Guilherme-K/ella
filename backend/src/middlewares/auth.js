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
    req.user = { id: Number(payload.sub), email: payload.email };
  } catch {
    throw createError(401, 'Token inválido ou expirado');
  }

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

export { authenticate, onlySelf };
