import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'
import BotaoVoltar from '../components/BotaoVoltar'

const TIPOS_CONTA = {
  usuaria: { rotulo: 'Usuária', classe: 'bg-pink-100 text-pink-700' },
  voluntaria: {
    rotulo: 'Voluntária',
    classe: 'bg-violet-100 text-violet-700',
  },
  psicologa: {
    rotulo: 'Psicóloga',
    classe: 'bg-fuchsia-100 text-fuchsia-700',
  },
}

function obterTipoConta(user) {
  const role = normalizarTexto(user.role)

  if (role === 'voluntaria' || role === 'psicologa') {
    return TIPOS_CONTA[role]
  }

  const tipo = normalizarTexto(user.accountType || role || 'usuaria')

  return TIPOS_CONTA[tipo] || TIPOS_CONTA.usuaria
}

function normalizarTexto(valor) {
  return String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function formatarData(valor) {
  if (!valor) return '—'

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return '—'

  return data.toLocaleDateString('pt-BR')
}

export default function Accounts() {
  const [users, setUsers] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function carregarContas() {
    setLoading(true)
    setError('')

    try {
      const dados = await userService.list()
      setUsers(Array.isArray(dados) ? dados : [])
    } catch (err) {
      setError(err.message || 'Não foi possível carregar as contas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const dados = await userService.list()
        if (ativo) setUsers(Array.isArray(dados) ? dados : [])
      } catch (err) {
        if (ativo) {
          setError(err.message || 'Não foi possível carregar as contas.')
        }
      } finally {
        if (ativo) setLoading(false)
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [])

  const usuariosFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca)

    if (!termo) return users

    return users.filter((user) => {
      const campos = [
        user.name,
        user.nome,
        user.email,
        user.city,
        user.cidade,
        user.crm,
        user.id,
        obterTipoConta(user).rotulo,
      ]

      return campos.some((campo) => normalizarTexto(campo).includes(termo))
    })
  }, [busca, users])

  function sair() {
    userService.clearSession()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex-1 bg-purple-100 px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        {/* Botão Voltar no topo do card */}
        <div className="mb-5">
          <BotaoVoltar />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold text-violet-950">
              Contas cadastradas
            </h1>
            <p className="mt-2 text-sm text-violet-600">
              Contas registradas no banco de dados da plataforma.
            </p>
          </div>

          <Link
            to="/admin"
            className="rounded-lg border border-purple-200 px-4 py-2 text-sm text-violet-600 transition hover:bg-violet-50"
          >
            Voltar ao painel
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <i
              className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-violet-600"
              aria-hidden="true"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Pesquisar por nome, e-mail, cidade ou CRM..."
              aria-label="Pesquisar contas cadastradas"
              className="w-full rounded-xl border border-purple-100 bg-purple-50 py-2.5 pl-9 pr-3 text-sm text-violet-800 outline-none placeholder:text-violet-300 focus:border-pink-300"
            />
          </div>

          <button
            type="button"
            onClick={carregarContas}
            disabled={loading}
            className="rounded-lg border border-purple-200 px-4 py-2 text-sm text-violet-600 transition hover:bg-violet-50 disabled:cursor-not-allowed"
          >
            Atualizar
          </button>
        </div>

        <p className="mt-3 text-xs text-violet-600">
          {usuariosFiltrados.length} de {users.length} conta(s) exibida(s).
        </p>

        <div className="mt-4 divide-y divide-purple-100">
          {loading && (
            <p className="py-5 text-sm text-violet-600">Carregando contas...</p>
          )}

          {error && (
            <p role="alert" className="py-5 text-sm text-pink-600">
              {error}
            </p>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="py-5 text-sm text-violet-600">
              Nenhuma conta cadastrada ainda.
            </p>
          )}

          {!loading &&
            !error &&
            users.length > 0 &&
            usuariosFiltrados.length === 0 && (
              <p className="py-5 text-sm text-violet-600">
                Nenhuma conta encontrada para “{busca}”.
              </p>
            )}

          {!loading &&
            !error &&
            usuariosFiltrados.map((user) => {
              const tipo = obterTipoConta(user)

              return (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-violet-800">
                        {user.name ?? user.nome}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tipo.classe}`}
                      >
                        {tipo.rotulo}
                      </span>

                      {user.role === 'admin' && (
                        <span className="rounded-full bg-violet-950 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Admin
                        </span>
                      )}
                    </div>

                    <p className="mt-1 break-all text-xs text-violet-600">
                      {user.email}
                    </p>

                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-violet-600">
                      {user.city && <span>{user.city}</span>}
                      {user.crm && (
                        <span className="font-medium text-fuchsia-600">
                          CRM: {user.crm}
                        </span>
                      )}
                      <span>Cadastro: {formatarData(user.createdAt)}</span>
                    </p>
                  </div>

                  <span className="text-xs text-violet-300">#{user.id}</span>
                </div>
              )
            })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/cadastro"
            className="rounded-lg bg-pink-700 px-4 py-2 text-sm text-white"
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
    </div>
  )
}
