// Utilitários de navegação compartilhados entre header, login e cadastro.

export function obterUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

export function normalizarPapel(usuario) {
  // O administrador é identificado tanto por "tipo" quanto por "accountType":
  // o backend devolve ambos para manter compatibilidade com o frontend antigo.
  if (usuario?.tipo === 'admin' || usuario?.accountType === 'admin') {
    return 'admin'
  }

  const papel =
    usuario?.accountType ||
    usuario?.tipo ||
    usuario?.papel ||
    usuario?.role ||
    ''

  return papel
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function destinoPorPapel(usuario) {
  const destinos = {
    admin: '/admin',
    voluntaria: '/chatvoluntaria',
    usuaria: '/perfiluser',
    psicologa: '/perfiluser',
  }

  return destinos[normalizarPapel(usuario)] || '/perfiluser'
}
