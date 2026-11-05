import imagemMulheres2 from '../assets/mulheres2.png';
import Campo from '../components/Campo';

import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBullhorn, faCalendarDays, faBriefcase } from '@fortawesome/free-solid-svg-icons';

function Voluntaria() {
    const [dados, setDados] = useState({
        nome: "",
        email: "",
        telefone: "",
        cidade: "",
    })
    function handleChange(e) {
        setDados({ ...dados, [e.target.name]: e.target.value });
    }
    const [ajuda, setAjuda] = useState(
        [])

    function escolherOpcao(opcao) {
        if (ajuda.includes(opcao)) {
            setAjuda(ajuda.filter((item) => item !== opcao))
        } else {
            setAjuda([...ajuda, opcao])
        }
    }

    const [erro, setErro] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (ajuda.length === 0) {
            setErro("Escolha pelo menos uma forma de ajudar.");
            return;
        }

        setErro("");
        console.log({ ...dados, areas: ajuda });
    }


    return (
        <main className="bg-[#f3e8ff]">
            <section className="flex items-center justify-between flex-col md:flex-row px-10 py-10">
                <div>
                    <h1 className='text-4xl font-bold text-[#4c1d95]'>Quero ser voluntária</h1>
                    <p className='max-w-md'>Faça parte da nossa rede de apoio e ajude a fortalecer outras mulheres.</p>
                </div>
                <img className="max-w-sm"
                    src={imagemMulheres2}
                    alt='Mulheres' />
            </section>

            <section className="bg-white rounded-3xl shadow-lg max-w-lg mx-auto p-8 pb-10 mb-10">
                <h2 className="text-2xl font-bold text-[#4c1d95] mb-2">Receba nosso contato por e-mail</h2>
                <p className="mb-2">Preencha seus dados e conte para nós como você gostaria de ajudar.</p>
                <p className="mb-6">Entraremos em contato com os próximos passos.</p>

                <form>
                    <Campo
                        label="Nome completo"
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Seu nome completo..."
                        value={dados.nome}
                        onChange={handleChange}
                    />

                    <Campo
                        label="E-mail"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@gmail.com"
                        value={dados.email}
                        onChange={handleChange}
                    />

                    <Campo
                        label="Telefone (opcional)"
                        id="telefone"
                        name="telefone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={dados.telefone}
                        onChange={handleChange}
                    />

                    <Campo
                        label="Cidade"
                        id="cidade"
                        name="cidade"
                        type="text"
                        placeholder="Sua cidade"
                        value={dados.cidade}
                        onChange={handleChange}
                    />

                    <h3 className="font-semibold text-[#4c1d95] mb-4 mt-2">Como você gostaria de ajudar?</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className={`rounded-xl py-4 font-semibold flex flex-col items-center gap-2 ${ajuda.includes("Acolhimento")
                                ? "bg-[#7e22ce] text-white"
                                : "bg-[#e9d5ff] text-[#4c1d95]"
                                }`}
                            type="button"
                            onClick={() => escolherOpcao("Acolhimento")}
                        ><FontAwesomeIcon icon={faHeart} />
                            Acolhimento
                        </button>

                        <button
                            className={`rounded-xl py-4 font-semibold flex flex-col items-center gap-2 ${ajuda.includes("Divulgação")
                                ? "bg-[#7e22ce] text-white"
                                : "bg-[#e9d5ff] text-[#4c1d95]"
                                }`}
                            type="button"
                            onClick={() => escolherOpcao("Divulgação")}
                        ><FontAwesomeIcon icon={faBullhorn} />
                            Divulgação
                        </button>

                        <button
                            className={`rounded-xl py-4 font-semibold flex flex-col items-center gap-2 ${ajuda.includes("Eventos")
                                ? "bg-[#7e22ce] text-white"
                                : "bg-[#e9d5ff] text-[#4c1d95]"
                                }`}
                            type="button"
                            onClick={() => escolherOpcao("Eventos")}
                        ><FontAwesomeIcon icon={faCalendarDays} />
                            Eventos
                        </button>

                        <button
                            className={`rounded-xl py-4 font-semibold flex flex-col items-center gap-2 ${ajuda.includes("Profissional")
                                ? "bg-[#7e22ce] text-white"
                                : "bg-[#e9d5ff] text-[#4c1d95]"
                                }`}
                            type="button"
                            onClick={() => escolherOpcao("Profissional")}>
                            <FontAwesomeIcon icon={faBriefcase} />
                            Profissional
                        </button>
                    </div>

                    <button className="rounded-full text-white bg-pink-400 px-8 py-2 mx-auto block mt-8" type="submit">Quero ser voluntária</button>
                </form>




            </section>
        </main>
    );
}

export default Voluntaria;