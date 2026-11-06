// Cliente HTTP simples baseado em fetch para consumir a API do backend.
// A URL base pode ser definida no arquivo .env do frontend:
// VITE_API_URL=http://127.0.0.1:5000

export const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

// Faz a requisição de forma parametrizada:
// - method: GET, POST, PATCH ou DELETE
// - path: caminho do endpoint, ex.: "/api/users"
// - body: objeto enviado como JSON (opcional)
// - token: JWT usado na autenticação
async function request(method, path, { body, token } = {}) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null

  if (response.status !== 204) {
    const text = await response.text()

    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }
    }
  }

  if (!response.ok) {
    const message = data?.error ?? `Erro ${response.status} na requisição`
    throw new Error(message)
  }

  return data
}

export const httpClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options) => request('POST', path, { ...options, body }),
  patch: (path, body, options) => request('PATCH', path, { ...options, body }),
  delete: (path, options) => request('DELETE', path, options),
}
