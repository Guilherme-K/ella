import jwt from 'jsonwebtoken';

// Gera um token JWT com os dados do usuário (payload).
// "sub" (subject) é o campo padrão para o identificador do usuário.
// O papel (role) vai no token para que o backend possa autorizar rotas
// administrativas sem uma consulta extra ao banco.
function generateToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
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
