import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPlus,
  faArrowRotateRight,
  faPen,
  faShieldHalved,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import Avatar from './Avatar'
import ProfileModal from '../components/ProfileModal'
import { userService } from '../services/userService'

export default function Accounts() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const navigate = useNavigate()

  const currentUser = userService.getCurrentUser()
  const isAdmin =
    currentUser?.tipo === 'admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.email?.toLowerCase().includes('admin')

  useEffect(() => {
    let ignore = false

    userService.list()
      .then((dados) => {
        if (!ignore) {
          setUsers(Array.isArray(dados) ? dados : [])
          setError('')
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Não foi possível carregar as contas.')
          setLoading(false)
        }
      })

    // Ouve alterações de autenticação ou edição de perfil para atualizar a lista em tempo real
    function handleUpdate() {
      userService.list()
        .then((dados) => {
          if (!ignore) {
            setUsers(Array.isArray(dados) ? dados : [])
          }
        })
        .catch(() => {})
    }

    window.addEventListener('auth-change', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      ignore = true
      window.removeEventListener('auth-change', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  function recarregarManualmente() {
    setLoading(true)
    userService.list()
      .then((dados) => {
        setUsers(Array.isArray(dados) ? dados : [])
        setError('')
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar contas.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function sair() {
    userService.clearSession()
    navigate('/')
  }

  function handleEditUser(user) {
    setSelectedUserToEdit(user)
    setEditModalOpen(true)
  }

  return (
    <main className="min-h-screen flex-1 bg-purple-100 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-xl sm:p-10 border border-purple-100">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-violet-950">
                Contas Cadastradas
              </h1>
              <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-violet-700">
                {users.length} {users.length === 1 ? 'conta' : 'contas'}
              </span>
            </div>
            <p className="mt-1 text-xs text-violet-500">
              Contas registradas no banco de dados MySQL da plataforma ELLA
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={recarregarManualmente}
              title="Recarregar lista"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-200 text-violet-600 hover:bg-purple-50 transition"
            >
              <FontAwesomeIcon icon={faArrowRotateRight} className={loading ? 'animate-spin' : ''} />
            </button>

            {isAdmin && (
              <Link
                to="/administrador"
                className="flex items-center gap-1.5 rounded-xl bg-purple-100 px-3.5 py-2 text-xs font-semibold text-violet-800 hover:bg-purple-200 transition"
              >
                <FontAwesomeIcon icon={faShieldHalved} className="text-pink-500" />
                Painel do Administrador
              </Link>
            )}

            <Link
              to="/cadastro"
              className="flex items-center gap-1.5 rounded-xl bg-pink-400 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-pink-500 transition"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Adicionar Conta
            </Link>
          </div>
        </div>

        {/* Lista de Contas */}
        <div className="mt-6 divide-y divide-purple-100">
          {loading && users.length === 0 && (
            <div className="py-12 text-center text-sm text-violet-400">
              <FontAwesomeIcon icon={faArrowRotateRight} className="animate-spin mr-2" />
              Carregando contas cadastradas...
            </div>
          )}

          {error && (
            <div role="alert" className="my-4 rounded-xl bg-pink-50 border border-pink-200 p-4 text-xs text-pink-700">
              {error}
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="py-10 text-center text-sm text-violet-400">
              Nenhuma conta cadastrada ainda.
            </p>
          )}

          {!loading &&
            !error &&
            users.map((user) => {
              const isCurrent = currentUser && Number(currentUser.id) === Number(user.id)
              const userIsAdmin = user.tipo === 'admin' || user.email?.toLowerCase().includes('admin')
              const displayName = user.name ?? user.nome ?? 'Sem nome'

              return (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4 hover:bg-purple-50/40 rounded-xl px-2 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      nome={displayName}
                      avatar={user.avatar}
                      tamanho="h-11 w-11"
                      className="shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-violet-900">
                          {displayName}
                        </p>
                        {isCurrent && (
                          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-600">
                            Você
                          </span>
                        )}
                        {userIsAdmin && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                            Administradora
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-violet-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-violet-300">#{user.id}</span>
                    
                    {(isCurrent || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleEditUser(user)}
                        className="flex items-center gap-1 rounded-lg border border-purple-200 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-purple-100 transition"
                        title="Editar nome, foto ou senha"
                      >
                        <FontAwesomeIcon icon={faPen} className="text-[10px] text-pink-400" />
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-100">
          <Link to="/" className="text-xs text-violet-600 hover:text-pink-600 underline">
            Voltar ao início
          </Link>

          {currentUser && (
            <button
              type="button"
              onClick={sair}
              className="flex items-center gap-1.5 rounded-xl border border-pink-200 px-4 py-2 text-xs font-medium text-pink-600 hover:bg-pink-50 transition"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Sair da sessão
            </button>
          )}
        </div>
      </section>

      {/* Modal para edição caso o usuário clique em Editar */}
      {selectedUserToEdit && (
        <ProfileModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setSelectedUserToEdit(null)
          }}
          user={selectedUserToEdit}
          onUpdateUser={() => {
            recarregarManualmente()
          }}
        />
      )}
    </main>
  )
}
