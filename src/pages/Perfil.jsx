import { lerUsuarioLogado } from '../services/useChat'
import Avatar from '../components/Avatar'

function Perfil() {
    const usuario = lerUsuarioLogado() || {}

    return (
        <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-[#2e1065]">
            <section className="flex flex-col gap-6 rounded-2xl border border-violet-100 bg-white p-6 sm:flex-row sm:items-center">
                <Avatar nome={usuario.nome || 'Usuária'} tamanho="h-28 w-28 text-3xl" />
                <div>
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                        Usuária
                    </span>
                    <h1 className="mt-3 font-serif text-3xl">
                        {usuario.nome || 'Minha conta'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">{usuario.email || 'E-mail não informado'}</p>
                </div>
            </section>

            <section className="rounded-2xl border border-violet-100 bg-white p-6">
                <h2 className="mb-4 font-serif text-lg text-[#2e1065]">Dados da conta</h2>
                <dl className="divide-y divide-violet-100">
                    <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Nome</dt>
                        <dd className="text-sm">{usuario.nome || '—'}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                        <dt className="text-xs uppercase tracking-wide text-gray-400">E-mail</dt>
                        <dd className="break-all text-sm">{usuario.email || '—'}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Cidade</dt>
                        <dd className="text-sm">{usuario.cidade || '—'}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Telefone</dt>
                        <dd className="text-sm">{usuario.telefone || '—'}</dd>
                    </div>
                </dl>
            </section>
        </main>
    )
}

export default Perfil
