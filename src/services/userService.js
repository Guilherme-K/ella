import { httpClient } from './httpClient'

const ENDPOINT = '/api/users'
const TOKEN_KEY = 'ella:token'
const USER_KEY = 'usuarioLogado'

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
  localStorage.setItem(USER_KEY, JSON.stringify(user))
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
      saveCurrentUser({
        ...data.user,
        nome: data.user.name ?? data.user.nome,
      })
    }

    return data
  },

  // PATCH /api/users/:id
  update: (id, user) =>
    httpClient.patch(`${ENDPOINT}/${id}`, user, { token: getToken() }),

  // DELETE /api/users/:id
  remove: (id) =>
    httpClient.delete(`${ENDPOINT}/${id}`, { token: getToken() }),

  getToken,
  saveToken,
  clearToken,
  saveCurrentUser,
  getCurrentUser,
  clearSession,
}
