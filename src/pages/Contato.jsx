import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare, faHeart, faUsers } from '@fortawesome/free-solid-svg-icons'

const equipe = [
  {
    nome: 'Brenda Stefani Correia da Silva',
    usuario: 'Brenda0104',
    funcao: 'Desenvolvedora',
  },
  {
    nome: 'Guilherme Kendy',
    usuario: 'Guilherme-K',
    funcao: 'Desenvolvedor',
  },
  {
    nome: 'Larissa Karine Lino dos Santos',
    usuario: 'lali-reverie',
    funcao: 'Desenvolvedora',
  },
]

export default function Contato() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <section className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
            <FontAwesomeIcon icon={faHeart} />
            Estamos aqui para ouvir
          </span>

          <h1 className="mb-5 text-4xl font-bold text-slate-800 md:text-5xl">
            Entre em contato
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            A ELLA é um projeto desenvolvido para informar, acolher e
            fortalecer mulheres. Conheça nossa equipe e acompanhe o trabalho
            de quem está por trás da plataforma.
          </p>
        </section>

        <section className="mb-14 rounded-3xl bg-white p-8 shadow-sm md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <FontAwesomeIcon icon={faUsers} className="text-xl" />
            </span>

            <h2 className="text-2xl font-bold text-slate-800">
              Nossa equipe
            </h2>
          </div>

          <p className="mb-8 leading-relaxed text-slate-600">
            Somos uma equipe responsável pelo desenvolvimento da ELLA.
            Você pode conhecer nossos integrantes e acompanhar seus projetos
            por meio dos perfis no GitHub.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {equipe.map((integrante) => (
              <article
                key={integrante.usuario}
                className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-violet-200 text-2xl text-white">
                  <FontAwesomeIcon icon={faGithub} />
                </div>

                <h3 className="mb-2 font-bold text-slate-800">
                  {integrante.nome}
                </h3>

                <p className="mb-5 text-sm text-slate-500">
                  {integrante.funcao}
                </p>

                <a
                  href={`https://github.com/${integrante.usuario}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-pink-700 transition hover:text-pink-900"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  {integrante.usuario}
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="text-xs"
                  />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-pink-100 to-violet-100 px-8 py-10 text-center">
          <FontAwesomeIcon
            icon={faHeart}
            className="mb-4 text-3xl text-pink-600"
          />

          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            Obrigada por conhecer a ELLA!
          </h2>

          <p className="mx-auto max-w-2xl leading-relaxed text-slate-600">
            Acreditamos que informação, acolhimento e acesso a redes de apoio
            são importantes para fortalecer mulheres. Cada pessoa que conhece
            e compartilha esse propósito contribui para ampliar essa iniciativa.
          </p>
        </section>
      </div>
    </main>
  )
}