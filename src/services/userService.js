import { httpClient } from './httpClient'

const ENDPOINT = '/api/users'
const TOKEN_KEY = 'ella:token'
const USER_KEY = 'usuarioLogado'

// Dispara evento para sincronizar componentes na tela (ex.: Header, Accounts, DashboardAdmin)
function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-change'))
  }
}

// Token JWT salvo após o login.
function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function saveToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Usuário logado, usado pelo restante do frontend (ex.: página de chat).
function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
  notifyAuthChange()
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

function clearSession() {
  clearToken()
  localStorage.removeItem(USER_KEY)
  notifyAuthChange()
}

export const userService = {
  // GET /api/users
  list: () => httpClient.get(ENDPOINT),

  // GET /api/users/:id
  getById: (id) => httpClient.get(`${ENDPOINT}/${id}`),

  // POST /api/users
  create: (user) => httpClient.post(ENDPOINT, user),

  // POST /api/users/login
  login: async (credentials) => {
    const data = await httpClient.post(`${ENDPOINT}/login`, credentials)

    saveToken(data.token)

    if (data.user) {
      const tipo =
        data.user.tipo ||
        (data.user.email?.toLowerCase().includes('admin') ? 'admin' : 'usuario')

      saveCurrentUser({
        ...data.user,
        nome: data.user.name ?? data.user.nome,
        name: data.user.name ?? data.user.nome,
        avatar: data.user.avatar,
        tipo,
        papel: tipo === 'admin' ? 'Administradora' : 'Usuária',
      })
    }

    return data
  },

  // PATCH /api/users/:id
  update: async (id, changes) => {
    const data = await httpClient.patch(`${ENDPOINT}/${id}`, changes, {
      token: getToken(),
    })

    if (data?.user) {
      const current = getCurrentUser() || {}
      if (Number(current.id) === Number(id)) {
        const tipo = data.user.tipo ?? current.tipo ?? 'usuario'
        saveCurrentUser({
          ...current,
          ...data.user,
          nome: data.user.name ?? data.user.nome ?? current.nome,
          name: data.user.name ?? data.user.nome ?? current.name,
          avatar: data.user.avatar ?? current.avatar,
          tipo,
          papel: tipo === 'admin' ? 'Administradora' : 'Usuária',
        })
      } else {
        notifyAuthChange()
      }
    }

    return data
  },

  // DELETE /api/users/:id
  remove: async (id) => {
    const res = await httpClient.delete(`${ENDPOINT}/${id}`, { token: getToken() })
    notifyAuthChange()
    return res
  },

  getToken,
  saveToken,
  clearToken,
  saveCurrentUser,
  getCurrentUser,
  clearSession,
  notifyAuthChange,
}
