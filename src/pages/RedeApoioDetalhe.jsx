import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { supportNetworkService } from '../services/supportNetworkService'
import {
  imagemDaRede,
  linkTelefone,
  siteSeguro,
} from '../constants/supportNetworks'
import VoltarLink from '../components/VoltarLink'

// O `key={id}` remonta o conteúdo ao trocar de serviço, garantindo que o
// estado de carregamento volte ao início sem setState síncrono no efeito.
export default function RedeApoioDetalhe() {
  const { id } = useParams()

  return <DetalheRede key={id} id={id} />
}

function DetalheRede({ id }) {
  const [rede, setRede] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    supportNetworkService
      .get(id)
      .then((dados) => {
        if (ativo) setRede(dados)
      })
      .catch((error) => {
        if (ativo) {
          setErro(
            error.message ||
              'Não foi possível carregar esta rede de apoio agora.',
          )
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  const telefone = linkTelefone(rede?.telefone)
  const site = siteSeguro(rede?.site)

  if (carregando) {
    return (
      <main id="conteudo" tabIndex={-1} className="flex-1 bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-gray-600" role="status">
            Carregando rede de apoio...
          </p>
        </div>
      </main>
    )
  }

  if (erro || !rede) {
    return (
      <main
        id="conteudo"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center bg-white px-6 py-20"
      >
        <section className="w-full max-w-xl rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-700">
            Rede de apoio
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-violet-950">
            Serviço não encontrado
          </h1>

          <p role="alert" className="mt-4 text-sm leading-7 text-gray-600">
            {erro || 'Este serviço não está mais disponível.'}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/apoio"
              className="rounded-full bg-pink-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-800"
            >
              Ver todas as redes
            </Link>

            <a
              href="tel:180"
              className="rounded-full border border-pink-300 px-5 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
            >
              Ligar 180
            </a>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main id="conteudo" tabIndex={-1} className="flex-1 bg-white">
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Você está em" className="text-xs text-gray-600">
            <Link to="/" className="underline underline-offset-4 hover:text-pink-700">
              Início
            </Link>{' '}
            <span aria-hidden="true">/</span>{' '}
            <Link
              to="/apoio"
              className="underline underline-offset-4 hover:text-pink-700"
            >
              Rede de Apoio
            </Link>{' '}
            <span aria-hidden="true">/</span>{' '}
            <span className="text-violet-900">{rede.nome}</span>
          </nav>

          <VoltarLink
            to="/apoio"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-purple-50"
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Voltar para a Rede de Apoio
          </VoltarLink>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
              <img
                src={imagemDaRede(rede.imagem)}
                alt={`Imagem ilustrativa de ${rede.nome}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div>
              {rede.categoria && (
                <span className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-700">
                  {rede.categoria}
                </span>
              )}

              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-violet-950">
                {rede.nome}
              </h1>

              <p className="mt-5 text-base leading-8 text-gray-700">
                {rede.descricao}
              </p>

              {rede.detalhes && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-[#faf5ff] p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-900">
                    Como funciona
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-gray-700">
                    {rede.detalhes}
                  </p>
                </div>
              )}

              {(telefone || site) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {telefone && (
                    <a
                      href={telefone}
                      className="inline-flex items-center gap-2 rounded-full bg-pink-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-800"
                    >
                      <i className="fa-solid fa-phone" aria-hidden="true" />
                      Ligar {rede.telefone}
                    </a>
                  )}

                  {site &&
                    (site.startsWith('/') ? (
                      <Link
                        to={site}
                        className="inline-flex items-center gap-2 rounded-full border border-pink-300 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
                      >
                        Acessar página
                        <i
                          className="fa-solid fa-arrow-right"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <a
                        href={site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-pink-300 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
                      >
                        Visitar site oficial
                        <i
                          className="fa-solid fa-arrow-up-right-from-square"
                          aria-hidden="true"
                        />
                        <span className="sr-only">(abre em nova aba)</span>
                      </a>
                    ))}
                </div>
              )}

              <p className="mt-6 text-xs leading-6 text-gray-600">
                A ELLA apresenta serviços que compõem a rede pública de
                atendimento. A indicação não representa uma parceria formal
                entre o serviço e a plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-violet-950 to-violet-700 px-7 py-10 text-white sm:px-12">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <i
              className="fa-solid fa-triangle-exclamation text-4xl text-pink-200"
              aria-hidden="true"
            />

            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold">
                Em caso de emergência
              </h2>

              <p className="mt-2 text-sm leading-7 text-purple-100">
                Se houver perigo imediato ou necessidade de intervenção
                policial, ligue para a Polícia Militar pelo número 190. O
                Ligue 180 é destinado à orientação, ao acolhimento e ao
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

      <section className="bg-gray-50 px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-violet-950">
            Conheça outros serviços
          </h2>

          <p className="max-w-2xl text-sm leading-7 text-gray-600">
            A rede de apoio reúne diferentes instituições. Veja a lista
            completa e encontre o serviço mais adequado para cada necessidade.
          </p>

          <Link
            to="/apoio"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-pink-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-800"
          >
            Ver todas as redes de apoio
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
