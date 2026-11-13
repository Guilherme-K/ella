
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { supportNetworkService } from '../services/supportNetworkService'
import { imagemDaRede } from '../constants/supportNetworks'

const REDES_POR_PAGINA = 6

const profissionais = [
  {
    icone: 'fa-user-doctor',
    titulo: 'Profissionais de saúde',
    descricao:
      'Oferecem cuidados e orientações relacionados à saúde física e ao bem-estar.',
  },
  {
    icone: 'fa-brain',
    titulo: 'Psicólogos e psicólogas',
    descricao:
      'Podem oferecer acompanhamento psicológico e apoio emocional.',
  },
  {
    icone: 'fa-scale-balanced',
    titulo: 'Profissionais do direito',
    descricao:
      'Orientam sobre direitos, procedimentos legais e possibilidades de proteção.',
  },
  {
    icone: 'fa-hand-holding-heart',
    titulo: 'Assistentes sociais',
    descricao:
      'Ajudam a identificar necessidades sociais e encaminhar pessoas aos serviços adequados.',
  },
]

export default function RedeApoio() {
  const [redes, setRedes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    let ativo = true

    supportNetworkService
      .list()
      .then((lista) => {
        if (ativo) setRedes(lista)
      })
      .catch((error) => {
        if (ativo) {
          setErro(
            error.message ||
              'Não foi possível carregar os serviços da rede agora.',
          )
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const totalPaginas = Math.max(
    1,
    Math.ceil(redes.length / REDES_POR_PAGINA),
  )
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = useMemo(
    () =>
      redes.slice(
        (paginaAtual - 1) * REDES_POR_PAGINA,
        paginaAtual * REDES_POR_PAGINA,
      ),
    [redes, paginaAtual],
  )

  return (
    <main id="conteudo" tabIndex={-1} className="flex-1 bg-white">
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
            Rede de Apoio ELLA
          </span>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-violet-950 md:text-5xl">
            Você não precisa encontrar todos os caminhos sozinha.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
            Uma rede de apoio reúne pessoas, profissionais e instituições
            que podem oferecer orientação, acolhimento e atendimento.
            Conheça os serviços disponíveis e saiba onde procurar ajuda.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#servicos"
              className="rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              Conhecer os serviços
            </a>

            <a
              href="https://www.gov.br/mulheres/pt-br/ligue180"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-pink-300 bg-white px-6 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
            >
              Conhecer o Ligue 180
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-700">
              Entenda a rede
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-violet-950">
              O que é uma Rede de Apoio?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              É o conjunto de serviços, instituições e profissionais que
              trabalham em diferentes áreas para oferecer suporte às mulheres.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Essa rede pode envolver atendimento social, psicológico,
              jurídico, de saúde e de segurança. Cada serviço possui
              responsabilidades específicas e pode encaminhar a mulher
              para outros atendimentos conforme suas necessidades.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-8">
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <i className="fa-solid fa-people-group text-3xl text-pink-600" />

              <h3 className="mt-5 font-serif text-xl font-bold text-violet-950">
                Apoio em diferentes áreas
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                A rede busca conectar a mulher aos serviços adequados,
                respeitando suas necessidades e as possibilidades de
                atendimento disponíveis em sua região.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="scroll-mt-8 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-700">
              Onde procurar ajuda
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-violet-950">
              Conheça os serviços da rede
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Existem diferentes instituições que podem oferecer atendimento
              e orientação. Conheça a função de cada uma.
            </p>
          </div>

          {carregando && (
            <p className="mt-12 text-center text-sm text-gray-500">
              Carregando serviços da rede...
            </p>
          )}

          {!carregando && erro && (
            <p
              role="alert"
              className="mx-auto mt-12 max-w-2xl rounded-2xl bg-red-50 px-5 py-4 text-center text-sm text-red-700"
            >
              {erro}
            </p>
          )}

          {!carregando && !erro && redes.length === 0 && (
            <p className="mx-auto mt-12 max-w-2xl rounded-2xl bg-purple-50 px-5 py-4 text-center text-sm text-violet-800">
              Nenhum serviço cadastrado no momento. Em caso de necessidade,
              ligue para o 180 ou para o 190.
            </p>
          )}

          {!carregando && !erro && visiveis.length > 0 && (
            <>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visiveis.map((rede) => (
                  <Link
                    key={rede.id}
                    to={`/apoio/${rede.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-md"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={imagemDaRede(rede.imagem)}
                        alt={`Imagem ilustrativa de ${rede.nome}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      {rede.categoria && (
                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm">
                          {rede.categoria}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-xl font-bold text-violet-950">
                        {rede.nome}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-7 text-gray-600">
                        {rede.descricao}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pink-700">
                        Ver detalhes
                        <i
                          className="fa-solid fa-arrow-right text-xs transition group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPaginas > 1 && (
                <nav
                  aria-label="Paginação das redes de apoio"
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className="rounded-full border border-purple-200 px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
                    (numero) => (
                      <button
                        key={numero}
                        type="button"
                        onClick={() => setPagina(numero)}
                        aria-current={numero === paginaAtual ? 'page' : undefined}
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                          numero === paginaAtual
                            ? 'bg-pink-600 text-white'
                            : 'border border-purple-200 text-violet-800 hover:bg-purple-50'
                        }`}
                      >
                        {numero}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => setPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className="rounded-full border border-purple-200 px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </nav>
              )}

              <p className="mt-4 text-center text-xs text-gray-500">
                {redes.length} serviço{redes.length === 1 ? '' : 's'} cadastrado
                {redes.length === 1 ? '' : 's'} · página {paginaAtual} de{' '}
                {totalPaginas}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-700">
              Quem atua nessa rede?
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-violet-950">
              Profissionais que podem oferecer apoio
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
              Diferentes profissionais podem participar do atendimento,
              conforme o serviço procurado e a necessidade de cada mulher.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profissionais.map((profissional) => (
              <article
                key={profissional.titulo}
                className="rounded-2xl border border-purple-100 bg-white p-6 text-center shadow-sm"
              >
                <i
                  className={`fa-solid ${profissional.icone} text-3xl text-pink-500`}
                  aria-hidden="true"
                />

                <h3 className="mt-4 font-semibold text-violet-950">
                  {profissional.titulo}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {profissional.descricao}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pink-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-700">
              Encontre atendimento
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-violet-950">
              Como encontrar um serviço próximo?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
              A disponibilidade de serviços especializados pode variar
              conforme o município. Um caminho é utilizar os canais
              nacionais de orientação para descobrir onde buscar atendimento.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="text-2xl font-bold text-pink-600">01</span>
              <h3 className="mt-3 font-semibold text-violet-950">
                Entre em contato
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Ligue 180 ou utilize o WhatsApp oficial para solicitar
                orientação.
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="text-2xl font-bold text-pink-600">02</span>
              <h3 className="mt-3 font-semibold text-violet-950">
                Informe sua região
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Consulte quais serviços especializados estão disponíveis
                em seu município.
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="text-2xl font-bold text-pink-600">03</span>
              <h3 className="mt-3 font-semibold text-violet-950">
                Conheça as possibilidades
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Verifique o atendimento oferecido, os horários e as formas
                de acesso ao serviço indicado.
              </p>
            </article>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://www.gov.br/mulheres/pt-br/ligue180"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
            >
              Acessar informações do Ligue 180
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-violet-950 to-violet-700 px-7 py-10 text-white sm:px-12">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <i className="fa-solid fa-triangle-exclamation text-4xl text-pink-200" />

            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold">
                Em caso de emergência
              </h2>

              <p className="mt-2 text-sm leading-7 text-purple-100">
                Se houver perigo imediato ou necessidade de intervenção
                policial, ligue para a Polícia Militar pelo número 190.
                O Ligue 180 é destinado à orientação, ao acolhimento e ao
                encaminhamento de denúncias.
              </p>
            </div>

            <a
              href="tel:190"
              className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-bold text-violet-900 transition hover:bg-pink-100"
            >
              Ligar 190
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-violet-950">
              Qual é o papel da ELLA?
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              A ELLA é um projeto que busca facilitar o acesso à informação
              e apresentar caminhos para encontrar serviços de apoio.
              A plataforma não substitui instituições públicas, atendimento
              profissional ou serviços de emergência.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              As instituições apresentadas nesta página são exemplos de
              serviços que compõem a rede pública de atendimento. Sua
              apresentação não significa que exista uma parceria formal
              entre essas instituições e a ELLA.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl font-bold text-violet-950">
            Fontes e informações oficiais
          </h2>

          <p className="mt-3 text-center text-sm text-gray-600">
            Consulte os canais oficiais para conferir informações
            atualizadas sobre os serviços.
          </p>

          <div className="mt-7 flex flex-col items-center gap-4">
            <a
              href="https://www.gov.br/mulheres/pt-br/ligue180"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-pink-700 underline underline-offset-4"
            >
              Ministério das Mulheres — Ligue 180
            </a>

            <a
              href="https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/casa-da-mulher-brasileira"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-pink-700 underline underline-offset-4"
            >
              Ministério das Mulheres — Casa da Mulher Brasileira
            </a>

            <a
              href="https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento/centro-de-referencia-especializado-de-assistencia-social-creas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-pink-700 underline underline-offset-4"
            >
              Ministério do Desenvolvimento Social — CREAS
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
