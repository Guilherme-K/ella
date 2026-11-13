import { useState } from 'react'
import { Link } from 'react-router-dom'
import BotaoVoltar from '../components/BotaoVoltar'

function lerUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado'))
  } catch {
    return null
  }
}

export default function Accounts() {
  const [users, setUsers] = useState(() => {
    const logado = lerUsuarioLogado()
    return logado ? [logado] : []
  })
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')

  function save(user) {
    const atualizado = { ...user, nome: name }
    localStorage.setItem('usuarioLogado', JSON.stringify(atualizado))
    setUsers([atualizado])
    setEditing(null)
  }

  function remove() {
    localStorage.removeItem('usuarioLogado')
    setUsers([])
  }

  return (
    <main className="min-h-screen flex-1 bg-purple-100 px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        {/* Botão Voltar no topo do card */}
        <div className="mb-5">
          <BotaoVoltar />
        </div>

        <h1 className="font-serif text-3xl font-bold text-violet-950">
          Contas cadastradas
        </h1>
        <p className="mt-2 text-sm text-violet-500">
          Seus dados ficam salvos neste navegador.
        </p>

        <div className="mt-6 divide-y divide-purple-100">
          {users.length === 0 && (
            <p className="py-5 text-sm text-violet-400">
              Nenhuma conta cadastrada ainda.
            </p>
          )}
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                {editing === user.id ? (
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-label="Editar nome"
                    className="rounded border border-purple-200 px-2 py-1"
                  />
                ) : (
                  <p className="font-medium text-violet-800">{user.nome}</p>
                )}
                <p className="text-xs text-violet-400">{user.email}</p>
              </div>

              <div className="flex gap-3 text-sm">
                {editing === user.id ? (
                  <button
                    type="button"
                    onClick={() => save(user)}
                    className="text-green-600"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(user.id)
                      setName(user.nome)
                    }}
                    className="text-violet-500"
                  >
                    Editar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(user.id)}
                  className="text-pink-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/cadastro"
            className="rounded-lg bg-pink-400 px-4 py-2 text-sm text-white"
          >
            Adicionar conta
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-purple-200 px-4 py-2 text-sm text-violet-600"
          >
            Sair
          </Link>
        </div>
      </section>
    </main>
  )
}
