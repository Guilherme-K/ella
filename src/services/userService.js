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

// Mantém os apelidos usados pelo frontend (nome, apelido, tipo).
function normalizeUser(user) {
  if (!user) return user

  return {
    ...user,
    nome: user.name ?? user.nome,
    apelido: user.nickname ?? user.apelido,
    tipo: user.role ?? user.tipo,
    tipoConta: user.accountType ?? user.tipoConta,
  }
}

// Usuário logado, usado pelo restante do frontend (ex.: página de chat).
function saveCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)))
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
  // GET /api/users (somente admin — o backend valida o token e o papel)
  list: () => httpClient.get(ENDPOINT, { token: getToken() }),

  // GET /api/users/me (usuário autenticado)
  me: async () => {
    const data = await httpClient.get(`${ENDPOINT}/me`, {
      token: getToken(),
    })
    return data.user
  },

  // PATCH /api/users/me (atualiza o próprio usuário)
  updateMe: async (changes) => {
    const data = await httpClient.patch(`${ENDPOINT}/me`, changes, {
      token: getToken(),
    })
    saveCurrentUser(data.user)
    return data.user
  },

  // POST /api/users/me/voluntaria (inscrição de voluntária)
  // O backend valida o token, atualiza cidade/telefone/áreas e troca o tipo
  // da conta para "voluntaria" (ou "psicologa" ao escolher "Profissional").
  registerVolunteer: async (dados) => {
    const data = await httpClient.post(
      `${ENDPOINT}/me/voluntaria`,
      dados,
      { token: getToken() },
    )
    saveCurrentUser(data.user)
    return data.user
  },

  // GET /api/users/:id
  getById: (id) => httpClient.get(`${ENDPOINT}/${id}`),

  // POST /api/users
  create: (user) => httpClient.post(ENDPOINT, user),

  // POST /api/users/login
  login: async (credentials) => {
    const data = await httpClient.post(`${ENDPOINT}/login`, credentials)

    saveToken(data.token)

    if (data.user) {
      saveCurrentUser(data.user)
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
