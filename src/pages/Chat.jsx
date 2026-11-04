
function Chat() {
    return (
        <main className="bg-[#f3e8ff] min-h-screen py-10 px-4">
            <section className="bg-white rounded-3xl shadow-lg max-w-3xl mx-auto overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-violet-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-500 flex items-center justify-center text-white font-bold">
                            J
                        </div>
                        <div>
                            <h2 className="font-bold text-[#4c1d95]">Juliana Ferreira</h2>
                            <p className="text-xs text-gray-500">● Online</p>
                        </div>
                    </div>
                </div>

                <div className="text-center py-6">
                    <span className="bg-[#f5f0ff] text-[#8050c9] text-xs px-4 py-2 rounded-full">
                        Hoje, 4 de novembro de 2026
                    </span>
                </div>

                <div className="px-5 pb-8 space-y-5">

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">J</div>
                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#f1efff] text-[#50449b]">
                            <p className="text-sm">Olá... estou passando por uma situação muito difícil e não sei mais o que fazer. Meu parceiro tem sido agressivo emocionalmente e, algumas vezes, fisicamente. Tenho medo e não sei se estou exagerando...</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:12</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#f9d8f5] text-[#5540a0]">
                            <p className="text-sm">Olá, Juliana. Eu sou Mariana, voluntária da ELA. Você não está exagerando. O que você vive é violência e você não está sozinha. Podemos conversar sobre isso?</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:16 ✓✓</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold shrink-0">M</div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">J</div>
                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#f1efff] text-[#50449b]">
                            <p className="text-sm">Obrigada por me responder tão rápido... Eu realmente precisava conversar com alguém. Tenho muito medo de denunciar.</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:20</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#f9d8f5] text-[#5540a0]">
                            <p className="text-sm">Entendo como isso é difícil. Posso te orientar sobre os próximos passos e encaminhar você para nossa equipe de apoio. Gostaria?</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:22 ✓✓</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold shrink-0">M</div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold shrink-0">J</div>
                        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#f1efff] text-[#50449b]">
                            <p className="text-sm">Sim, por favor. Acho que preciso muito disso.</p>
                            <p className="text-right text-[10px] text-[#a29bc9] mt-2">10:24</p>
                        </div>
                    </div>

                </div>

                <div className="flex items-center gap-2 px-4 py-3 border-t border-violet-100">

                    <div className="flex items-center flex-1 bg-[#faf8ff] border border-violet-200 rounded-full px-4 py-2 gap-3">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            className="flex-1 bg-transparent outline-none text-sm text-[#50449b] placeholder:text-[#a29bc9] min-w-0"
                        />

                      <i className="fa-solid fa-paperclip" aria-hidden="true" />

                        <i className="fa-regular fa-face-smile" aria-hidden="true" />
                    </div>

                    <i
                        className="fa-solid fa-paper-plane"
                        style={{ color: '#ee41c6' }}
                    />

                </div>
            </section>
        </main>
    );
}

export default Chat;
