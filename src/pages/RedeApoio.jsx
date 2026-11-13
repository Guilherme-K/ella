import BotaoVoltar from '../components/BotaoVoltar'

const servicos = [
  {
    titulo: 'Ligue 180',
    categoria: 'Orientação e atendimento',
    icone: 'fa-phone',
    descricao:
      'A Central de Atendimento à Mulher oferece orientação sobre direitos, informações sobre serviços próximos e recebe e encaminha denúncias de violência contra mulheres.',
    detalhes: 'Gratuito, disponível 24 horas por dia, todos os dias.',
    links: [
      {
        texto: 'Ligar para 180',
        url: 'tel:180',
      },
      {
        texto: 'WhatsApp',
        url: 'https://wa.me/556196100180',
      },
    ],
  },
  {
    titulo: 'Delegacias da Mulher',
    categoria: 'Segurança e proteção',
    icone: 'fa-shield-halved',
    descricao:
      'As Delegacias Especializadas de Atendimento à Mulher (DEAMs) são unidades policiais especializadas no atendimento de mulheres em situação de violência.',
    detalhes:
      'Quando não houver uma delegacia especializada disponível, também é possível procurar uma delegacia comum.',
    links: [
      {
        texto: 'Informações sobre atendimento',
        url: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/susp-mulheres/violencia-domestica-e-familiar',
      },
    ],
  },
  {
    titulo: 'Casa da Mulher Brasileira',
    categoria: 'Atendimento integrado',
    icone: 'fa-house',
    descricao:
      'É um espaço público que reúne diferentes serviços especializados, facilitando o acesso ao acolhimento, à orientação e à proteção.',
    detalhes:
      'Pode oferecer apoio psicossocial, atendimento policial, jurídico, alojamento de passagem e outros serviços, conforme a unidade.',
    links: [
      {
        texto: 'Conhecer o programa',
        url: 'https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/casa-da-mulher-brasileira',
      },
    ],
  },
  {
    titulo: 'Defensoria Pública',
    categoria: 'Orientação jurídica',
    icone: 'fa-scale-balanced',
    descricao:
      'Oferece orientação e assistência jurídica gratuita a pessoas que não possuem condições de contratar um advogado ou uma advogada.',
    detalhes:
      'Pode orientar sobre direitos, medidas protetivas e procedimentos judiciais.',
    links: [
      {
        texto: 'Saiba onde buscar ajuda',
        url: 'https://www.gov.br/mulheres/pt-br/central-de-conteudos/noticias/2026/agosto-defeso-eleitoral/especial-lei-maria-da-penha-saiba-onde-e-como-buscar-ajuda-em-casos-de-violencia-domestica-e-familiar',
      },
    ],
  },
  {
    titulo: 'CREAS',
    categoria: 'Assistência social',
    icone: 'fa-people-group',
    descricao:
      'O Centro de Referência Especializado de Assistência Social atende pessoas e famílias que vivenciam situações de risco social ou tiveram seus direitos violados.',
    detalhes:
      'Pode oferecer acompanhamento especializado, orientação e encaminhamentos para outros serviços públicos.',
    links: [
      {
        texto: 'Conhecer o CREAS',
        url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento/centro-de-referencia-especializado-de-assistencia-social-creas',
      },
    ],
  },
  {
    titulo: 'Serviços de Saúde',
    categoria: 'Saúde e acolhimento',
    icone: 'fa-heart-pulse',
    descricao:
      'As unidades de saúde podem prestar atendimento às necessidades de saúde da mulher e orientar sobre os serviços disponíveis na rede pública.',
    detalhes:
      'Unidades básicas de saúde e hospitais podem fazer parte dos caminhos de atendimento, conforme a necessidade.',
    links: [],
  },
]

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
  return (
    <main className="flex-1 bg-white">
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 pt-8 pb-20">
        {/* Botão Voltar alinhado à esquerda no topo */}
        <div className="mx-auto mb-8 max-w-5xl text-left">
          <BotaoVoltar />
        </div>

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
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
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
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
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

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico) => (
              <article
                key={servico.titulo}
                className="flex flex-col rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100">
                  <i
                    className={`fa-solid ${servico.icone} text-xl text-pink-600`}
                    aria-hidden="true"
                  />
                </div>

                <span className="mt-5 text-xs font-semibold uppercase tracking-wider text-pink-600">
                  {servico.categoria}
                </span>

                <h3 className="mt-2 font-serif text-xl font-bold text-violet-950">
                  {servico.titulo}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-gray-600">
                  {servico.descricao}
                </p>

                <p className="mt-4 rounded-xl bg-purple-50 p-3 text-xs leading-6 text-violet-800">
                  {servico.detalhes}
                </p>

                {servico.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {servico.links.map((link) => (
                      <a
                        key={link.texto}
                        href={link.url}
                        target={link.url.startsWith('tel:') ? undefined : '_blank'}
                        rel={link.url.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-pink-700 transition hover:text-pink-900"
                      >
                        {link.texto}
                        <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
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
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-600">
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
