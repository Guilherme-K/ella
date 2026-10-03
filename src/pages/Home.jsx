import { Link } from 'react-router-dom'
import womenArtwork from '../assets/ChatGPT Image 18 de set. de 2026, 08_12_58 (1) 1.png'

const highlights = [
  {
    title: 'Informação',
    description: 'Entenda seus direitos e reconheça os diferentes tipos de violência.',
    to: '/informacoes',
  },
  {
    title: 'Acolhimento',
    description: 'Encontre orientação respeitosa para decidir seus próximos passos.',
    to: '/sobre',
  },
  {
    title: 'Rede de apoio',
    description: 'Conheça canais de atendimento e serviços que podem ajudar.',
    to: '/apoio',
  },
]

export default function Home() {
  return (
    <main className="flex-1">
      <section
        id="inicio"
        className="relative isolate flex min-h-[570px] items-center overflow-hidden bg-gradient-to-br from-[#fff8fc] via-[#f9e8f5] to-[#eedcff] px-6 py-14 sm:min-h-[calc(100svh-68px)] sm:px-10 lg:px-[6.2%]"
      >
        <div className="absolute inset-y-0 right-0 -z-10 w-full bg-gradient-to-r from-[#fff8fc] via-[#fff8fc]/75 to-transparent sm:w-[78%] sm:from-transparent sm:via-transparent" />
        <img
          src={womenArtwork}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2 -right-20 -z-20 w-[92%] max-w-[760px] opacity-30 sm:right-0 sm:w-[61%] sm:opacity-100"
        />

        <div className="relative z-10 max-w-[490px]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">
            ELLA · Educação, Liberdade, Laços e Assistência
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-[#422760] sm:text-5xl lg:text-[54px]">
            Você não
            <br />
            está sozinha.
          </h1>
          <p className="mt-4 max-w-[440px] text-lg leading-snug text-violet-700 sm:text-[23px]">
            Informação, acolhimento e apoio para se proteger e recomeçar
          </p>
          <p className="mt-7 max-w-[435px] text-sm leading-relaxed text-[#352d37] sm:text-base">
            Aqui você encontra orientações, canais de denúncia, rede de apoio e
            ferramentas de emergência. Juntas, podemos combater a violência
            contra a mulher.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="tel:190"
              className="rounded-full bg-[#c9005b] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#a8004d] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
            >
              ☎ Botão de Emergência
            </a>
            <Link
              to="/apoio"
              className="rounded-full border-2 border-pink-300 bg-white/80 px-5 py-2 text-base text-pink-500 transition hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
            >
              Quero Ajuda
            </Link>
          </div>
          <a
            href="https://www.gov.br/pt-br/servicos/solicitar-atendimento-por-meio-da-central-de-atendimento-a-mulher"
            className="mt-7 inline-block rounded-lg bg-[#f2dfff] px-5 py-2 text-sm text-violet-600 underline decoration-violet-400 underline-offset-2 transition hover:bg-[#ead0ff]"
          >
            Saída Rápida
          </a>
        </div>
      </section>

      <section className="bg-white px-6 py-14 sm:px-10 lg:px-[6.2%]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl font-bold text-[#422760] sm:text-3xl">
            Você merece apoio e informação
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-violet-700 sm:text-base">
            Não precisa passar por isso sozinha. Explore nossos recursos e
            encontre o caminho que faz sentido para você.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {highlights.map(({ title, description, to }) => (
              <Link
                key={title}
                to={to}
                className="rounded-2xl border border-purple-100 bg-[#fffaff] p-5 transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-bold text-pink-600">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#51465a]">
                  {description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-violet-600">
                  Saiba mais →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
