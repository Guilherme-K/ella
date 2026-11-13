import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { formatarHora, lerUsuarioLogado, useChat } from '../services/useChat'

function ChatUsuario() {
    const usuario = lerUsuarioLogado()
    const { mensagens, carregando, erro, enviar, editar, excluir } = useChat()
    const [mensagem, setMensagem] = useState('')
    const [editandoId, setEditandoId] = useState(null)
    const [textoEdicao, setTextoEdicao] = useState('')

    if (!usuario?.id || !localStorage.getItem('ella:token')) {
        return <Navigate to="/login" replace />
    }

    if ((usuario.accountType || usuario.tipo) !== 'usuaria') {
        return <Navigate to="/chat" replace />
    }

    const inicial = (usuario.nome || 'U').trim().charAt(0).toUpperCase()

    async function enviarMensagem(event) {
        event.preventDefault()
        if (!mensagem.trim()) return

        if (await enviar(mensagem)) {
            setMensagem('')
        }
    }

    async function salvarEdicao(id) {
        if (!textoEdicao.trim()) return

        if (await editar(id, textoEdicao)) {
            setEditandoId(null)
            setTextoEdicao('')
        }
    }

    return (
        <main className="bg-[#f3e8ff] min-h-screen py-10 px-4">
            <section className="bg-white rounded-3xl shadow-lg max-w-3xl mx-auto overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-violet-100 flex-wrap gap-3">

                     <button
          onClick={() => window.history.back()}
          className="text-purple-900 mb-8"
        >
          ← Voltar
        </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-300 to-purple-500 flex items-center justify-center text-white font-bold">
                            M
                        </div>

                        <div>
                            <h2 className="font-bold text-[#4c1d95]">Maria</h2>
                            <p className="text-xs text-gray-500">● Online</p>
                        </div>
                    </div>

                    <a
                        href="#"
                        className="flex items-center justify-center gap-2 bg-pink-600 text-white rounded-full py-2 px-4 text-sm font-semibold hover:bg-pink-700 transition"
                    >
                        <i className="fa-solid fa-phone" />
                        Ligue 180
                    </a>
                </div>

                <div className="px-6 py-2 border-b border-violet-100">
                    <a
                        href="https://www.youtube.com/receitas"
                        className="text-sm text-gray-500 hover:text-[#9d174d] underline"
                    >
                        <i className="fa-solid fa-right-from-bracket mr-2" />
                        Saída Rápida
                    </a>
                    <a
                        href="tel:190"
                        className="ml-3 inline-flex items-center gap-2 rounded-full bg-pink-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                    >
                        <i className="fa-solid fa-bell" aria-hidden="true" />
                        Botão de Emergência
                    </a>
                </div>

                <div className="text-center py-6">
                    <span className="bg-[#f5f0ff] text-[#8050c9] text-xs px-4 py-2 rounded-full">
                        Hoje, 5 de novembro de 2026
                    </span>
                </div>

                <div className="px-5 pb-8 space-y-5">

                    {carregando && (
                        <p className="text-center text-sm text-[#a29bc9]">Carregando mensagens...</p>
                    )}

                    {erro && (
                        <p role="alert" className="text-center text-sm text-pink-600">{erro}</p>
                    )}

                    {!carregando && mensagens.length === 0 && !erro && (
                        <p className="text-center text-sm text-[#a29bc9]">Você ainda não tem mensagens. Escreva a primeira abaixo.</p>
                    )}

                    {mensagens.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 justify-end">
                            <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#f9d8f5] text-[#5540a0]">
                                {editandoId === item.id ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={textoEdicao}
                                            onChange={(event) => setTextoEdicao(event.target.value)}
                                            aria-label="Editar mensagem"
                                            className="rounded border border-violet-200 bg-white px-2 py-1 text-sm outline-none"
                                        />
                                        <div className="flex justify-end gap-3 text-xs">
                                            <button type="button" onClick={() => salvarEdicao(item.id)} className="text-green-700">Salvar</button>
                                            <button type="button" onClick={() => setEditandoId(null)} className="text-[#8050c9]">Cancelar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm wrap-break-word">{item.mensagem}</p>
                                        <div className="mt-2 flex items-center justify-end gap-3 text-[10px] text-[#a29bc9]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditandoId(item.id)
                                                    setTextoEdicao(item.mensagem)
                                                }}
                                                className="underline"
                                            >
                                                Editar
                                            </button>
                                            <button type="button" onClick={() => excluir(item.id)} className="underline">Excluir</button>
                                            <span>{formatarHora(item.enviada_em)}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">{inicial}</div>
                        </div>
                    ))}

                </div>

                <form onSubmit={enviarMensagem} className="flex items-center gap-2 px-4 py-3 border-t border-violet-100">
                    <div className="flex items-center flex-1 bg-[#faf8ff] border border-violet-200 rounded-full px-4 py-2 gap-3">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={mensagem}
                            onChange={(event) => setMensagem(event.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-[#50449b] placeholder:text-[#a29bc9] min-w-0"
                        />

                        <i className="fa-solid fa-paperclip" aria-hidden="true" />
                        <i className="fa-regular fa-face-smile" aria-hidden="true" />
                    </div>

                    <button type="submit" className="text-[#ee41c6] hover:text-pink-600 transition px-2">
                        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                    </button>
                </form>

            </section>
        </main>
    )
}

export default ChatUsuario