// Utilitários de navegação compartilhados entre header, login e cadastro.

export function obterUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

export function normalizarPapel(usuario) {
  return (usuario?.tipo || usuario?.papel || usuario?.role || '')
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
