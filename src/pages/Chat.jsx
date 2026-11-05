
import { useNavigate } from 'react-router-dom'

function Chat() {
    const navigate = useNavigate()

    return (
        <main className="bg-[#f3e8ff] min-h-screen flex items-center justify-center px-4 py-10">
            <section className="bg-white rounded-3xl shadow-lg max-w-lg w-full p-8 text-center">

                <h1 className="text-3xl font-bold text-[#4c1d95] mb-3">
                    O que você é?
                </h1>

                <p className="text-gray-600 mb-8">
                    Escolha uma opção para acessar o chat.
                </p>

                <div className="space-y-4">

                    <button
                        onClick={() => navigate('/chatusuario')}
                        className="w-full bg-pink-100 text-[#9d174d] rounded-2xl p-5 font-semibold hover:bg-pink-200 transition flex items-center justify-center gap-3"
                    >
                        <i className="fa-solid fa-user" />
                        Usuária
                    </button>

                    <button
                        onClick={() => navigate('/chatvoluntaria')}
                        className="w-full bg-purple-100 text-[#4c1d95] rounded-2xl p-5 font-semibold hover:bg-purple-200 transition flex items-center justify-center gap-3"
                    >
                        <i className="fa-solid fa-heart" />
                        Voluntária
                    </button>

                    <button
                        onClick={() => navigate('/chatadmin')}
                        className="w-full bg-violet-100 text-[#4c1d95] rounded-2xl p-5 font-semibold hover:bg-violet-200 transition flex items-center justify-center gap-3"
                    >
                        <i className="fa-solid fa-shield-halved" />
                        Administradora
                    </button>

                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mt-8 text-left">
                    <div className="flex items-center gap-2 text-[#9d174d] font-semibold mb-2">
                        <i className="fa-solid fa-heart" />
                        Precisa de ajuda imediata?
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                        Você pode receber orientação e apoio pela Central de Atendimento à Mulher.
                    </p>

                    <a
                        href="#"
                        className="flex items-center justify-center gap-2 bg-pink-600 text-white rounded-full py-2 px-4 text-sm font-semibold hover:bg-pink-700 transition"
                    >
                        <i className="fa-solid fa-phone" />
                        Ligue 180
                    </a>
                </div>

                <a
                     href="https://www.youtube.com/ordemparanormal"
                    className="text-sm text-gray-500 hover:text-[#9d174d] mt-6 underline"
                >
                    <i className="fa-solid fa-right-from-bracket mr-2" />
                    Saída Rápida
                </a>

            </section>
        </main>
    )
}

export default Chat
