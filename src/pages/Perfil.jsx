import { useState } from 'react'
import { lerUsuarioLogado } from '../services/useChat'
import Avatar from '../components/Avatar'
import BotaoVoltar from '../components/BotaoVoltar'

const sitesSaidaRapida = [
    { nome: 'YouTube', url: 'https://youtube.com' },
    { nome: 'Google', url: 'https://www.google.com.br' },
    { nome: 'Wikipédia', url: 'https://pt.wikipedia.org' },
    { nome: 'G1', url: 'https://g1.globo.com' },
]

function Perfil() {
    const usuario = lerUsuarioLogado() || {}
    const [saidaRapida, setSaidaRapida] = useState(() => {
        return localStorage.getItem('ella_link_saida_rapida') || 'https://youtube.com'
    })
    const [aviso, setAviso] = useState('')

    function mudarSaidaRapida(e) {
        const novaUrl = e.target.value
        setSaidaRapida(novaUrl)
        localStorage.setItem('ella_link_saida_rapida', novaUrl)
        setAviso('Link de Saída Rápida atualizado!')
        setTimeout(() => setAviso(''), 3000)
    }

    return (
        <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-[#2e1065]">
            <div className="mb-2">
                <BotaoVoltar />
            </div>

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

            <section className="rounded-2xl border border-violet-100 bg-white p-6">
                <h2 className="mb-4 font-serif text-lg text-[#2e1065]">Segurança</h2>
                <dl className="divide-y divide-violet-100">
                    <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                        <dt className="text-xs uppercase tracking-wide text-gray-400">Saída Rápida</dt>
                        <dd>
                            <label htmlFor="saidaRapida" className="sr-only">Site da Saída Rápida</label>
                            <select
                                id="saidaRapida"
                                name="saidaRapida"
                                value={saidaRapida}
                                onChange={mudarSaidaRapida}
                                className="w-full max-w-xs rounded-xl border border-violet-200 bg-[#faf5ff] px-4 py-2 text-sm text-[#2e1065] outline-none"
                            >
                                {sitesSaidaRapida.map((s) => (
                                    <option key={s.url} value={s.url}>{s.nome}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-400">Para onde o botão de Saída Rápida leva você num clique (ou aperte ESC duas vezes).</p>
                            {aviso && <p className="mt-2 text-xs font-medium text-green-700">{aviso}</p>}
                        </dd>
                    </div>
                </dl>
            </section>
        </main>
    )
}

export default Perfil
