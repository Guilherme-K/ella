// Utilitários de navegação compartilhados entre header, login e cadastro.

export function obterUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  } catch {
    return null
  }
}

// Uma sessão só é válida com o usuário E o token salvos. Isso evita que dados
// antigos no localStorage (sem token) criem um ciclo entre /login e /perfiluser.
export function temSessaoAtiva(usuario = obterUsuarioLogado()) {
  return Boolean(usuario?.id && localStorage.getItem('ella:token'))
}

export function normalizarPapel(usuario) {
  // `role` é o papel de autorização usado pelo backend. `accountType` é apenas
  // o tipo escolhido no cadastro e pode divergir (ex.: role "usuaria" com
  // accountType "voluntaria"), por isso ele é só o último fallback.
  const papel =
    usuario?.role ||
    usuario?.tipo ||
    usuario?.papel ||
    usuario?.accountType ||
    ''

  return papel
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// "Minha área" e o pós-login levam ao perfil para todas as contas que não são
// administradoras. O chat deve ser aberto de propósito, nunca automaticamente.
export function destinoPorPapel(usuario) {
  return normalizarPapel(usuario) === 'admin' ? '/admin' : '/perfiluser'
}
