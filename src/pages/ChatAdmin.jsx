
import { useState } from 'react'

function ChatAdmin() {
    const [conversaSelecionada, setConversaSelecionada] = useState(null)
    const [mensagem, setMensagem] = useState('')
    const [mensagens, setMensagens] = useState([])

    const conversas = [
        {
            id: 1,
            nome: 'Juliana',
            voluntaria: 'Mariana',
            ultimaMensagem: 'Gostaria de conversar sobre uma situação.'
        },
        {
            id: 2,
            nome: 'Ana',
            voluntaria: 'Carolina',
            ultimaMensagem: 'Obrigada pelo atendimento!'
        }
    ]

    function abrirConversa(conversa) {
        setConversaSelecionada(conversa)
        setMensagens([])
    }

    function enviarMensagem(event) {
        event.preventDefault()
        if (!mensagem.trim()) return

        setMensagens([...mensagens, mensagem])
        setMensagem('')
    }

    return (
        <main className="bg-[#f3e8ff] min-h-screen py-10 px-4">
            <section className="bg-white rounded-3xl shadow-lg max-w-3xl mx-auto overflow-hidden">

                {!conversaSelecionada ? (
                    <>
                        <div className="px-6 py-6 border-b border-violet-100">
                            <h1 className="text-2xl font-bold text-[#4c1d95]">
                                Painel administrativo
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Acompanhe as conversas da plataforma.
                            </p>
                        </div>

                        <div className="p-6">
                            <h2 className="font-semibold text-[#4c1d95] mb-4">
                                Conversas
                            </h2>

                            <div className="space-y-3">
                                {conversas.map((conversa) => (
                                    <button
                                        key={conversa.id}
                                        onClick={() => abrirConversa(conversa)}
                                        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#faf8ff] hover:bg-[#f1eaff] transition text-left"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">
                                            {conversa.nome[0]}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#4c1d95]">
                                                {conversa.nome}
                                            </h3>

                                            <p className="text-xs text-gray-500">
                                                Voluntária: {conversa.voluntaria}
                                            </p>

                                            <p className="text-sm text-gray-500 truncate">
                                                {conversa.ultimaMensagem}
                                            </p>
                                        </div>

                                        <i className="fa-solid fa-chevron-right text-purple-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-violet-100">
                            <button
                                onClick={() => setConversaSelecionada(null)}
                                className="text-[#8050c9]"
                            >
                                <i className="fa-solid fa-arrow-left" />
                            </button>

                            <div className="w-12 h-12 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold">
                                {conversaSelecionada.nome[0]}
                            </div>

                            <div>
                                <h2 className="font-bold text-[#4c1d95]">
                                    {conversaSelecionada.nome}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Voluntária: {conversaSelecionada.voluntaria}
                                </p>
                            </div>
                        </div>

                        <div className="px-5 py-8 space-y-5 min-h-[300px]">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">
                                    {conversaSelecionada.nome[0]}
                                </div>

                                <div className="bg-[#f9d8f5] text-[#5540a0] rounded-2xl rounded-tl-sm p-4 max-w-[75%]">
                                    <p className="text-sm">
                                        {conversaSelecionada.ultimaMensagem}
                                    </p>
                                </div>
                            </div>

                            {mensagens.map((item, index) => (
                                <div key={index} className="flex justify-end">
                                    <div className="bg-[#f1efff] text-[#50449b] rounded-2xl p-4 max-w-[75%]">
                                        <p className="text-sm break-words">{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form
                            onSubmit={enviarMensagem}
                            className="flex items-center gap-2 px-4 py-3 border-t border-violet-100"
                        >
                            <input
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={mensagem}
                                onChange={(event) => setMensagem(event.target.value)}
                                className="flex-1 bg-[#faf8ff] border border-violet-200 rounded-full px-4 py-3 outline-none text-sm"
                            />

                            <button type="submit" className="text-[#ee41c6] px-2">
                                <i className="fa-solid fa-paper-plane" />
                            </button>
                        </form>
                    </>
                )}

            </section>
        </main>
    )
}

export default ChatAdmin
