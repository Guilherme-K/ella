// CRUD local para manter os cadastros disponíveis neste navegador.
// Quando a coleção/contrato Bruno estiver disponível, BASE_URL pode apontar
// para o backend e estas operações podem ser substituídas por fetch REST.
const STORAGE_KEY = 'ella:usuarios'

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function getUsers() {
  return readUsers()
}

export function createUser(data) {
  const user = { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() }
  writeUsers([...readUsers(), user])
  return user
}

export function updateUser(id, changes) {
  const users = readUsers()
  const updated = users.find((user) => user.id === id)
  if (!updated) return null
  const nextUsers = users.map((user) => user.id === id ? { ...user, ...changes } : user)
  writeUsers(nextUsers)
  return { ...updated, ...changes }
}

export function deleteUser(id) {
  const users = readUsers()
  const nextUsers = users.filter((user) => user.id !== id)
  writeUsers(nextUsers)
  return nextUsers.length !== users.length
}
