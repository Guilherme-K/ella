import { useState } from 'react'
import SavedChatMessage from '../components/SavedChatMessage'
import BotaoVoltar from '../components/BotaoVoltar'
import { useChatMessages } from '../hooks/useChatMessages'

function ChatUsuario() {
    const [mensagem, setMensagem] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [erroEnvio, setErroEnvio] = useState('')
    const {
        mensagens: salvas,
        carregando,
        erro,
        enviar,
        editar,
        excluir,
    } = useChatMessages('usuaria')

    async function enviarMensagem(event) {
        event.preventDefault()
        const texto = mensagem.trim()
        if (!texto || enviando) return

        setEnviando(true)
        setErroEnvio('')

        try {
            await enviar(texto)
            setMensagem('')
        } catch (error) {
            setErroEnvio(
                error.message || 'Não foi possível salvar a mensagem.',
            )
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main id="conteudo" tabIndex={-1} className="bg-[#f3e8ff] min-h-screen py-10 px-4">
            <section className="bg-white rounded-3xl shadow-lg max-w-3xl mx-auto overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-violet-100 flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <BotaoVoltar />

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-300 to-purple-500 flex items-center justify-center text-white font-bold">
                                M
                            </div>

                            <div>
                                <h2 className="font-bold text-[#4c1d95]">Maria</h2>
                                <p className="text-xs text-gray-600">● Online</p>
                            </div>
                        </div>
                    </div>

                    <a
                        href="tel:180"
                        className="flex items-center justify-center gap-2 bg-pink-600 text-white rounded-full py-2 px-4 text-sm font-semibold hover:bg-pink-700 transition"
                    >
                        <i className="fa-solid fa-phone" />
                        Ligue 180
                    </a>
                </div>


                <div className="text-center py-6">
                    <span className="bg-[#f5f0ff] text-[#8050c9] text-xs px-4 py-2 rounded-full">
                        Hoje, 5 de novembro de 2026
                    </span>
                </div>

                <div className="px-5 pb-8 space-y-5">

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold shrink-0">M</div>

                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#f1efff] text-[#50449b]">
                            <p className="text-sm">Olá, Juliana! Sou Maria, voluntária da ELA. Como posso ajudar você?</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:12</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#f9d8f5] text-[#5540a0]">
                            <p className="text-sm">Olá, Maria. Estou passando por uma situação difícil e gostaria de conversar.</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:14</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">J</div>
                    </div>

                    {carregando && (
                        <p className="text-center text-xs text-gray-600">
                            Carregando mensagens salvas...
                        </p>
                    )}

                    {erro && (
                        <p role="alert" className="text-center text-xs text-red-600">
                            {erro}
                        </p>
                    )}

                    {salvas.map((item) => (
                        <SavedChatMessage
                            key={item.id}
                            mensagem={item}
                            alinhadaDireita
                            classeBalao="bg-[#f9d8f5] text-[#5540a0]"
                            onEditar={editar}
                            onExcluir={excluir}
                            avatar={
                                <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">
                                    J
                                </div>
                            }
                        />
                    ))}

                </div>

                {erroEnvio && (
                    <p role="alert" className="px-5 pb-2 text-xs text-red-600">
                        {erroEnvio}
                    </p>
                )}

                <form onSubmit={enviarMensagem} className="flex items-center gap-2 px-4 py-3 border-t border-violet-100">
                    <div className="flex min-w-0 items-center flex-1 bg-[#faf8ff] border border-violet-200 rounded-full px-4 py-2 gap-3">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={mensagem}
                            maxLength={2000}
                            onChange={(event) => setMensagem(event.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-[#50449b] placeholder:text-[#a29bc9] min-w-0"
                        />

                        <i className="fa-solid fa-paperclip" aria-hidden="true" />
                        <i className="fa-regular fa-face-smile" aria-hidden="true" />
                    </div>

                    <button type="submit" disabled={enviando} className="shrink-0 text-[#ee41c6] hover:text-pink-600 transition px-2 disabled:opacity-50">
                        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                    </button>
                </form>

            </section>
        </main>
    )
}

export default ChatUsuario;