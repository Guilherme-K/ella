import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import BotaoVoltar from '../components/BotaoVoltar'

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

export default function Sobre() {
  return (
    <main className="flex-1 bg-white">
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 pt-8 pb-20">
        {/* Botão Voltar alinhado à esquerda no topo */}
        <div className="mx-auto mb-8 max-w-5xl text-left">
          <BotaoVoltar />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-5 inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
            Conheça a ELLA
          </span>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Mais do que uma plataforma,
            <span className="block text-pink-600">
              uma rede de apoio.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
            A ELLA nasceu da ideia de utilizar a tecnologia para aproximar
            mulheres da informação, do acolhimento e de uma rede de apoio.
            Queremos contribuir para que mais mulheres conheçam seus direitos,
            encontrem orientação e saibam onde buscar ajuda.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Nossa proposta
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Por que criamos a ELLA?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Acreditamos que o acesso à informação é uma parte importante
              para que mulheres possam reconhecer situações de violência,
              conhecer seus direitos e encontrar caminhos para buscar apoio.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Por isso, desenvolvemos a ELLA como uma plataforma que reúne
              conteúdos informativos, canais de orientação, recursos de
              emergência e uma proposta de rede de apoio.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-8">
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <FontAwesomeIcon
                icon={faHeart}
                className="mb-5 text-3xl text-pink-500"
              />

              <h3 className="text-xl font-bold text-gray-900">
                Nossa missão
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Contribuir para um ambiente onde informação, orientação
                e acolhimento estejam mais acessíveis às mulheres.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
            Por trás do projeto
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Quem somos nós?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Somos uma equipe de três estudantes que se uniu para desenvolver
            a ELLA, colocando em prática nossos conhecimentos em tecnologia
            e desenvolvimento de software.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {equipe.map((integrante) => (
              <article
                key={integrante.usuario}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={`https://github.com/${integrante.usuario}.png`}
                  alt={`Foto de ${integrante.nome}`}
                  className="mx-auto h-28 w-28 rounded-full border-4 border-pink-100 object-cover"
                />

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {integrante.nome}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {integrante.funcao}
                </p>

                <a
                  href={`https://github.com/${integrante.usuario}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar GitHub de ${integrante.nome}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  GitHub
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">
            Tecnologia também pode transformar realidades.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-pink-50">
            A ELLA representa nosso esforço em unir aprendizado,
            desenvolvimento e responsabilidade social em um único projeto.
          </p>
        </div>
      </section>
    </main>
  )
}
