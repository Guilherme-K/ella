import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

export default function Accounts() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let ativo = true

    async function carregarContas() {
      try {
        const dados = await userService.list()
        if (ativo) setUsers(dados)
      } catch (err) {
        if (ativo) {
          setError(err.message || 'Não foi possível carregar as contas.')
        }
      } finally {
        if (ativo) setLoading(false)
      }
    }

    carregarContas()

    return () => {
      ativo = false
    }
  }, [])

  function sair() {
    userService.clearSession()
    navigate('/')
  }

  return (
    <main className="min-h-screen flex-1 bg-purple-100 px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <h1 className="font-serif text-3xl font-bold text-violet-950">
          Contas cadastradas
        </h1>
        <p className="mt-2 text-sm text-violet-500">
          Contas registradas no banco de dados da plataforma.
        </p>

        <div className="mt-6 divide-y divide-purple-100">
          {loading && (
            <p className="py-5 text-sm text-violet-400">Carregando contas...</p>
          )}

          {error && (
            <p role="alert" className="py-5 text-sm text-pink-600">
              {error}
            </p>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="py-5 text-sm text-violet-400">
              Nenhuma conta cadastrada ainda.
            </p>
          )}

          {!loading &&
            !error &&
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="font-medium text-violet-800">
                    {user.name ?? user.nome}
                  </p>
                  <p className="text-xs text-violet-400">{user.email}</p>
                </div>

                <span className="text-xs text-violet-300">#{user.id}</span>
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
          <button
            type="button"
            onClick={sair}
            className="rounded-lg border border-purple-200 px-4 py-2 text-sm text-violet-600"
          >
            Sair
          </button>
        </div>
      </section>
    </main>
  )
}
