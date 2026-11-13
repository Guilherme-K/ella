import imagemMulheres2 from '../assets/mulheres2.png'
import Campo from '../components/Campo'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHeart,
    faBullhorn,
    faCalendarDays,
    faBriefcase,
    faHandHoldingHeart,
    faUsers
} from '@fortawesome/free-solid-svg-icons'

function Voluntaria() {
    const [dados, setDados] = useState({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
    })

    const [ajuda, setAjuda] = useState([])
    const [erro, setErro] = useState('')
    const navigate = useNavigate()

    function handleChange(e) {
        setDados((dadosAtuais) => ({
            ...dadosAtuais,
            [e.target.name]: e.target.value
        }))
    }


    function escolherOpcao(opcao) {
        setErro('')

        setAjuda((ajudaAtual) =>
            ajudaAtual.includes(opcao)
                ? ajudaAtual.filter((item) => item !== opcao)
                : [...ajudaAtual, opcao]
        )
    }



    function handleSubmit(e) {
        e.preventDefault()

        if (ajuda.length === 0) {
            setErro('Escolha pelo menos uma forma de ajudar.')
            return
        }

        console.log({ ...dados, areas: ajuda })
        navigate('/voluntaria/agradecimentovoluntaria')
    }

    const opcoes = [
        { nome: 'Acolhimento', icone: faHeart },
        { nome: 'Divulgação', icone: faBullhorn },
        { nome: 'Eventos', icone: faCalendarDays },
        { nome: 'Profissional', icone: faBriefcase },
    ]

    return (
        <main id="conteudo" tabIndex={-1} className="min-h-screen bg-[#f8f3ff]">

            <section className="bg-gradient-to-r from-[#fce7f3] via-[#f5eaff] to-[#ede9fe] px-5 py-10 sm:py-14">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 md:flex-row md:gap-8">

                    <div className="w-full max-w-md text-center md:text-left">
                        <span className="text-sm font-bold uppercase tracking-widest text-pink-600">
                            Faça parte dessa rede
                        </span>

                        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#4c1d95] sm:text-5xl">
                            Quero ser voluntária
                        </h1>

                        <p className="mt-4 text-base leading-relaxed text-violet-800">
                            Sua participação pode fazer a diferença na construção
                            de uma rede de acolhimento, informação e apoio para mulheres.
                        </p>

                        
                    </div>

                    <div className="flex w-full max-w-sm justify-center md:max-w-md">
                        <img
                            src={imagemMulheres2}
                            alt="Ilustração de mulheres representando união e apoio"
                            className="w-full max-w-[320px] object-contain drop-shadow-sm md:max-w-[380px]"
                        />
                    </div>

                </div>

            </section>


            <section className="px-5 py-10 sm:py-14">
                <div className="mx-auto max-w-4xl">

                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600">
                            <FontAwesomeIcon icon={faHandHoldingHeart} />
                        </div>

                        <h2 className="font-serif text-2xl font-bold text-[#4c1d95] sm:text-3xl">
                            O que é ser voluntária na ELLA?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-violet-800 sm:text-base">
                            Ser voluntária na ELLA significa contribuir para uma
                            comunidade mais acolhedora e informada. É oferecer
                            conhecimentos, habilidades, tempo ou disposição para
                            fortalecer iniciativas de apoio às mulheres.
                        </p>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-violet-800 sm:text-base">
                            Existem diferentes maneiras de participar. Você pode
                            colaborar com ações de acolhimento, divulgação de
                            informações, organização de eventos ou oferecendo
                            conhecimentos da sua área profissional.
                        </p>
                    </div>

                    <div className="mb-10 grid gap-4 sm:grid-cols-2">
                        <article className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                                <FontAwesomeIcon icon={faUsers} />
                            </div>

                            <h3 className="font-bold text-[#4c1d95]">
                                Construir uma rede
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Ajudar a aproximar mulheres de informações,
                                iniciativas e oportunidades de apoio.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                                <FontAwesomeIcon icon={faHeart} />
                            </div>

                            <h3 className="font-bold text-[#4c1d95]">
                                Contribuir com suas habilidades
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Compartilhar seus conhecimentos e colaborar
                                com atividades de acordo com suas possibilidades.
                            </p>
                        </article>
                    </div>

                    <div
                        id="inscricao"
                        className="scroll-mt-24 rounded-3xl border border-purple-100 bg-white p-6 shadow-lg sm:p-9"
                    >
                        <div className="mb-7 text-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-pink-600">
                                Faça sua inscrição
                            </span>

                            <h2 className="mt-2 font-serif text-2xl font-bold text-[#4c1d95] sm:text-3xl">
                                Quer fazer parte?
                            </h2>

                            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
                                Preencha seus dados e escolha as áreas em que
                                gostaria de contribuir. Nossa equipe poderá
                                entrar em contato para conversar sobre os próximos passos.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <Campo
                                label="Nome completo"
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Seu nome completo..."
                                value={dados.nome}
                                onChange={handleChange}
                                required
                            />

                            <Campo
                                label="E-mail"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@gmail.com"
                                value={dados.email}
                                onChange={handleChange}
                                required
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
                                required
                            />

                            <div className="pt-3">
                                <h3 className="font-semibold text-[#4c1d95]">
                                    Como você gostaria de ajudar?
                                </h3>

                                <p className="mb-4 mt-1 text-sm text-gray-500">
                                    Você pode selecionar mais de uma opção.
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {opcoes.map((opcao) => {
                                        const selecionada = ajuda.includes(opcao.nome)

                                        return (
                                            <button
                                                key={opcao.nome}
                                                type="button"
                                                aria-pressed={selecionada}
                                                onClick={() => escolherOpcao(opcao.nome)}
                                                className={`flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border p-4 font-semibold transition ${
                                                    selecionada
                                                        ? 'border-purple-700 bg-purple-700 text-white shadow-md'
                                                        : 'border-purple-100 bg-[#f5eaff] text-[#4c1d95] hover:border-purple-400 hover:bg-purple-100'
                                                }`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={opcao.icone}
                                                    className="text-xl"
                                                />

                                                <span className="text-sm">
                                                    {opcao.nome}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {erro && (
                                    <p className="mt-3 text-sm font-medium text-red-600">
                                        {erro}
                                    </p>
                                )}
                            </div>

                            <button
                                className="mx-auto mt-6 block rounded-full bg-pink-700 px-10 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                                type="submit"
                            >
                                Quero ser voluntária
                            </button>

                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Voluntaria
