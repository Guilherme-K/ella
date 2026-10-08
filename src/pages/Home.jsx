import { Link } from 'react-router-dom'
import womenArtwork from '../assets/ChatGPT Image 18 de set. de 2026, 08_12_58 (1) 1.png'
import { homeLinks, supportServices, violenceTypes } from '../data/homeData'

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <section
        id="inicio"
        className="relative isolate flex items-center overflow-hidden bg-gradient-to-r from-pink-50 via-pink-50 to-purple-100 px-6 py-8 sm:px-10 sm:py-10 lg:px-16"
      >
        <img
          src={womenArtwork}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-20 h-full w-3/4 object-contain object-right opacity-70 sm:w-2/3 sm:opacity-100"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-50 via-pink-50/95 to-transparent" />
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-lg">
            <h1 className="font-serif text-3xl font-bold leading-tight text-violet-950 sm:text-4xl lg:text-5xl">
              Você não
              <br />
              está sozinha.
            </h1>
            <p className="mt-3 text-lg leading-snug text-violet-700 sm:text-xl">
              Informação, acolhimento e apoio para
              <br className="hidden sm:block" /> se proteger e recomeçar
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-stone-700 sm:text-base">
              Aqui você encontra orientações, canais de denúncia, rede de apoio
              e ferramentas de emergência. Juntas, podemos combater a violência
              contra a mulher.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="tel:190"
                className="inline-flex items-center gap-2 rounded-full bg-pink-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              >
                <i className="fa-solid fa-bell" aria-hidden="true" />
                Botão de Emergência
              </a>
              <Link
                to="/apoio"
                className="rounded-full border border-pink-400 bg-white/80 px-4 py-2 text-sm text-pink-600 transition hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
              >
                Quero Ajuda
              </Link>
            </div>
            <a
              href="https://www.gov.br/pt-br/servicos/solicitar-atendimento-por-meio-da-central-de-atendimento-a-mulher"
              className="mt-6 inline-block rounded-lg bg-purple-100 px-4 py-2 text-xs text-violet-700 underline decoration-violet-400 underline-offset-2 transition hover:bg-purple-200"
            >
              Saída Rápida
            </a>
          </div>
        </div>
      </section>

      <nav
        aria-label="Acesso rápido"
        className="mx-auto my-10 grid max-w-6xl grid-cols-2 gap-3 rounded-3xl bg-pink-100 px-5 py-6 sm:my-12 sm:grid-cols-4 sm:gap-6 sm:px-8"
      >
        {homeLinks.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center gap-2 rounded-xl px-3 py-2 text-center text-violet-950 transition hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <i
              className={`fa-solid ${item.icon} text-2xl text-pink-700`}
              aria-hidden="true"
            />
            <span className="text-xs font-bold">{item.label}</span>
            <span className="max-w-36 text-xs leading-tight">
              {item.description}
            </span>
          </Link>
        ))}
      </nav>

      <section className="rounded-t-2xl bg-gradient-to-r from-violet-950 to-violet-700 px-6 py-5 text-white sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-xl sm:text-2xl">
            Informações que salvam vidas
          </h2>
          <p className="mt-2 max-w-md text-xs text-violet-100 sm:text-sm">
            Conheça os diferentes tipos de violência, seus sinais,
            <br className="hidden sm:block" /> e saiba como se proteger.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 pb-12 pt-8 sm:px-10 sm:pt-10">
        <div className="mx-auto max-w-6xl">
          <section id="tipos-violencia" className="scroll-mt-6">
            <h2 className="font-serif text-2xl font-bold text-violet-950 sm:text-3xl">
              Tipos de Violência
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-violet-700">
              A violência contra a mulher pode se manifestar em diversas formas.
              <br className="hidden sm:block" /> Conheça os principais tipos:
            </p>

            <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {violenceTypes.map((type) => (
                <article
                  key={type.title}
                  className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-pink-50 px-5 py-6 text-center"
                >
                  <i
                    className={`fa-solid ${type.icon} text-2xl text-pink-400`}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 font-serif text-base font-bold text-violet-950">
                    {type.title}
                  </h3>
                  <p className="mt-3 max-w-56 text-xs leading-snug text-violet-900">
                    {type.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside
            id="direitos"
            className="mt-8 flex flex-col items-center gap-4 rounded-3xl bg-pink-200 px-6 py-7 text-center sm:flex-row sm:justify-center sm:gap-8 sm:px-10 sm:py-8 sm:text-left"
          >
            <i
              className="fa-regular fa-heart text-4xl text-pink-600"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-serif text-2xl text-violet-950 sm:text-3xl">
                Violência não é amor. É crime.
              </h2>
              <p className="mt-1 text-sm text-pink-700 sm:text-base">
                Você tem o direito a uma vida segura, livre e com dignidade.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="rede-apoio" className="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl font-bold text-violet-950 sm:text-3xl">
            Rede de Apoio
          </h2>
          <p className="mt-1 text-sm text-violet-700 sm:text-base">
            Conecte-se com profissionais e instituições
            <br className="hidden sm:block" /> que podem te ajudar.
          </p>

          <label className="mx-auto mt-7 flex max-w-3xl items-center gap-3 rounded-full border border-stone-400 px-6 py-2 shadow-sm focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-200">
            <span className="sr-only">Campo de texto da rede de apoio</span>
            <input
              type="text"
              placeholder="Buscar por serviços, cidade ou especialidade..."
              className="min-w-0 flex-1 bg-transparent text-sm text-violet-950 outline-none placeholder:text-violet-300"
            />
            <i
              className="fa-solid fa-magnifying-glass text-lg text-violet-700"
              aria-hidden="true"
            />
          </label>

          <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportServices.map((service) => (
              <article
                key={service.title}
                className="flex min-h-36 flex-col items-center justify-center rounded-2xl bg-purple-100 px-5 py-6 text-center"
              >
                <i
                  className={`fa-solid ${service.icon} text-2xl text-violet-900`}
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-serif text-base font-bold text-violet-950">
                  {service.title}
                </h3>
                <p className="mt-4 text-xs text-violet-950">
                  {service.description}
                </p>
              </article>
            ))}
          </div>

          <aside className="mt-14 flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-violet-700 via-violet-700 to-violet-950 px-6 py-7 text-center text-white sm:flex-row sm:justify-between sm:px-10 sm:py-8 sm:text-left">
            <i
              className="fa-solid fa-people-group text-4xl text-purple-200"
              aria-hidden="true"
            />
            <div className="sm:flex-1">
              <h2 className="font-serif text-2xl sm:text-3xl">
                Juntas somos mais fortes.
              </h2>
              <p className="mt-1 text-sm text-purple-100 sm:text-base">
                Seja voluntária! Sua ajuda pode transformar vidas.
              </p>
            </div>
            <Link
              to="/apoio"
              className="rounded-xl bg-purple-100 px-4 py-2 text-sm text-violet-700 transition hover:bg-white sm:text-base"
            >
              Quero ser voluntária
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}
