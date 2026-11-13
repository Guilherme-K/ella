import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import womenArtwork from "../assets/mulheres.png";
import { homeLinks, supportServices, violenceTypes } from "../data/homeData";
import SaidaRapida from "../components/SaidaRapida";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const perguntasFrequentes = [
  {
    pergunta: "O que é a plataforma ELLA?",
    resposta:
      "A ELLA é uma plataforma que reúne informações, orientações e recursos de apoio para mulheres, ajudando a identificar situações de violência e encontrar caminhos para buscar ajuda.",
  },
  {
    pergunta: "Quem pode utilizar o site?",
    resposta:
      "Qualquer pessoa pode acessar as informações públicas da plataforma. Algumas funcionalidades podem exigir cadastro e autenticação.",
  },
  {
    pergunta: "Preciso criar uma conta para acessar as informações?",
    resposta:
      "Não. As informações disponíveis nas páginas públicas podem ser consultadas sem cadastro. Algumas áreas e funcionalidades podem exigir uma conta.",
  },
  {
    pergunta: "Onde encontro informações sobre os tipos de violência?",
    resposta:
      "Na página inicial, na seção Tipos de Violência, você encontra informações sobre violência física, psicológica, sexual, moral e patrimonial.",
  },
  {
    pergunta: "Como encontro serviços de apoio?",
    resposta:
      "Na seção Rede de Apoio, você encontra informações sobre serviços e instituições que podem oferecer orientação e atendimento.",
  },
  {
    pergunta: "O que acontece quando aperto em Chamar a Polícia (190)?",
    resposta:
      "O botão abre a opção de ligação para o número 190 no dispositivo. Você ainda precisa confirmar e realizar a chamada.",
  },
  {
    pergunta: "A ELLA chama a polícia automaticamente?",
    resposta:
      "Não. A plataforma não substitui os serviços de emergência. O botão facilita o acesso à opção de ligação para a Polícia Militar.",
  },
  {
    pergunta: "Como posso visualizar minha localização?",
    resposta:
      "Na página de emergência, você pode permitir o acesso à localização do dispositivo para abrir sua posição atual no Google Maps.",
  },
  {
    pergunta: "Como posso me tornar voluntária?",
    resposta:
      "Acesse a opção Quero ser voluntária, disponível na página inicial, para conhecer o processo de inscrição.",
  },
  {
    pergunta: "A plataforma substitui atendimento profissional?",
    resposta:
      "Não. A ELLA é uma ferramenta de informação e apoio. Ela não substitui serviços policiais, médicos, psicológicos ou jurídicos.",
  },
];

export default function Home() {
  const [buscaApoio, setBuscaApoio] = useState("");
  const [perguntaAberta, setPerguntaAberta] = useState(null);
  const [totalAcionamentos, setTotalAcionamentos] = useState(null);
  const [erroContagem, setErroContagem] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function buscarAcionamentos() {
      try {
        const resposta = await fetch(
          `${API_URL}/api/emergencia/acionamentos/total`,
        );

        if (!resposta.ok) {
          throw new Error("Não foi possível consultar os acionamentos.");
        }

        const dados = await resposta.json();
        const total = Number(dados.total);

        if (!Number.isFinite(total)) {
          throw new Error("Contagem inválida.");
        }

        if (ativo) {
          setTotalAcionamentos(total);
          setErroContagem(false);
        }
      } catch (erro) {
        if (ativo) {
          setErroContagem(true);
        }
      }
    }

    buscarAcionamentos();

    const intervalo = window.setInterval(buscarAcionamentos, 5000);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, []);

  const servicosFiltrados = supportServices.filter((service) => {
    const pesquisa = buscaApoio
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    if (pesquisa.length < 2) return true;

    const titulo = service.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const descricao = service.description
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    return titulo.includes(pesquisa) || descricao.includes(pesquisa);
  });

  return (
    <main className="flex-1 bg-white">
      <section
        id="inicio"
        className="relative isolate flex items-center overflow-hidden bg-linear-to-r from-pink-50 via-pink-50 to-purple-100 px-6 py-8 sm:px-10 sm:py-10 lg:px-16"
      >
        <img
          src={womenArtwork}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-20 h-full w-3/4 object-contain object-right opacity-70 sm:w-2/3 sm:opacity-100"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-pink-50 via-pink-50/95 to-transparent" />
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

            {/* Botão de Emergência */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/emergencia"
                className="inline-flex items-center gap-2 rounded-full bg-pink-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              >
                <i className="fa-solid fa-bell" aria-hidden="true" />
                Botão de Emergência
              </Link>
            </div>

            {/* Botão Saída Rápida logo abaixo */}
            <div className="mt-4">
              <SaidaRapida modo="home" />
            </div>
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

      <section className="bg-linear-to-r from-violet-950 to-violet-700 px-6 py-5 text-white sm:px-10">
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
                <Link
                  key={type.id}
                  to={`/informacoes#${type.id}`}
                  className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-pink-50 px-5 py-6 text-center transition hover:-translate-y-1 hover:bg-pink-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                </Link>
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

          <Link
            to="/apoio"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pink-700 transition hover:text-pink-900"
          >
            Conheça nossa Rede de Apoio
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>

          <label className="mx-auto mt-7 flex max-w-3xl items-center gap-3 rounded-full border border-stone-400 px-6 py-2 shadow-sm focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-200">
            <span className="sr-only">Pesquisar na rede de apoio</span>

            <input
              type="text"
              value={buscaApoio}
              onChange={(e) => setBuscaApoio(e.target.value)}
              placeholder="Buscar por serviços, cidade ou especialidade..."
              className="min-w-0 flex-1 bg-transparent text-sm text-violet-950 outline-none placeholder:text-violet-300"
            />

            {buscaApoio && (
              <button
                type="button"
                onClick={() => setBuscaApoio("")}
                aria-label="Limpar pesquisa"
                className="text-violet-600 hover:text-violet-900"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}

            <i
              className="fa-solid fa-magnifying-glass text-lg text-violet-700"
              aria-hidden="true"
            />
          </label>

          <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicosFiltrados.length > 0 ? (
              servicosFiltrados.map((service) => (
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
              ))
            ) : (
              <p className="col-span-full py-8 text-center text-sm text-violet-700">
                Nenhum serviço encontrado. Tente pesquisar por outro nome ou especialidade.
              </p>
            )}
          </div>

          <section
            id="contador-emergencia"
            className="mt-14 rounded-3xl border border-pink-100 bg-pink-50 px-6 py-8 sm:px-10"
          >
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                  Indicador de emergência
                </span>

                <h2 className="mt-2 font-serif text-2xl font-bold text-violet-950 sm:text-3xl">
                  Você não está sozinha.
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-violet-800">
                  Acompanhe quantas vezes o botão de ligação para a Polícia
                  (190) foi acionado pelos usuários da plataforma.
                </p>
              </div>

              <div
                className="min-w-44 rounded-2xl bg-white px-8 py-5 text-center shadow-sm"
                aria-live="polite"
              >
                <p className="text-4xl font-bold text-pink-700">
                  {totalAcionamentos === null
                    ? "—"
                    : totalAcionamentos.toLocaleString("pt-BR")}
                </p>

                <p className="mt-2 text-xs font-semibold text-violet-900">
                  Acionamentos registrados
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {totalAcionamentos === null
                    ? erroContagem
                      ? "Contagem indisponível"
                      : "Carregando..."
                    : "Atualizado automaticamente"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-violet-700">
              O número representa quantas vezes o botão foi acionado. Ele não
              confirma se a ligação foi completada ou atendida.
            </p>
          </section>

          <aside className="mt-14 flex flex-col items-center gap-5 rounded-3xl bg-linear-to-r from-violet-700 via-violet-700 to-violet-950 px-6 py-7 text-center text-white sm:flex-row sm:justify-between sm:px-10 sm:py-8 sm:text-left">
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
              to="/voluntaria"
              className="rounded-xl bg-purple-100 px-4 py-2 text-sm text-violet-700 transition hover:bg-white sm:text-base"
            >
              Quero ser voluntária
            </Link>
          </aside>

          <section id="perguntas-frequentes" className="mt-16">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-2xl font-bold text-violet-950 sm:text-3xl">
                  Perguntas Frequentes
                </h2>

                <p className="mt-2 text-sm text-violet-700">
                  Tire suas dúvidas e conheça melhor a plataforma ELLA.
                </p>
              </div>

              <div className="space-y-3">
                {perguntasFrequentes.map((item, index) => {
                  const aberta = perguntaAberta === index;

                  return (
                    <article
                      key={item.pergunta}
                      className="overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setPerguntaAberta(aberta ? null : index)}
                        aria-expanded={aberta}
                        aria-controls={`faq-resposta-${index}`}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-purple-50"
                      >
                        <span className="text-sm font-semibold text-violet-950 sm:text-base">
                          {item.pergunta}
                        </span>

                        <i
                          className={`fa-solid fa-chevron-down shrink-0 text-sm text-pink-600 transition-transform duration-200 ${aberta ? "rotate-180" : ""
                            }`}
                          aria-hidden="true"
                        />
                      </button>

                      {aberta && (
                        <div
                          id={`faq-resposta-${index}`}
                          className="border-t border-purple-100 px-5 py-4"
                        >
                          <p className="text-sm leading-relaxed text-gray-600">
                            {item.resposta}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
