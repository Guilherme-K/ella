import { httpClient } from './httpClient'

const ENDPOINT = '/api/users'
const TOKEN_KEY = 'ella:token'

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
}
