import jwt from 'jsonwebtoken';

// Gera um token JWT com os dados do usuário (payload).
// "sub" (subject) é o campo padrão para o identificador do usuário.
function generateToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

// Verifica o token e devolve o payload.
// Lança erro se o token for inválido ou estiver expirado.
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken };
