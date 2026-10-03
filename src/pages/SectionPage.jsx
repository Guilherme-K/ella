import { Link, useLocation } from 'react-router-dom'

const sections = {
  '/sobre': {
    eyebrow: 'Quem somos',
    title: 'Um espaço de acolhimento e informação',
    intro:
      'ELLA significa Educação, Liberdade, Laços e Assistência. Este espaço foi criado para compartilhar informação confiável e aproximar mulheres de redes de apoio.',
    heading: 'Você está no controle dos próximos passos',
    body:
      'Cada história é única. Busque apoio no seu tempo e, se puder, converse com alguém de confiança. Não é preciso enfrentar uma situação de violência sem ajuda.',
  },
  '/informacoes': {
    eyebrow: 'Conheça seus direitos',
    title: 'Informação é uma forma de proteção',
    intro:
      'A violência contra a mulher pode ser física, psicológica, sexual, patrimonial ou moral. Nenhuma forma de violência é aceitável, e pedir orientação é um direito.',
    heading: 'Onde buscar orientação',
    body:
      'A Central de Atendimento à Mulher oferece orientação e encaminhamento pelo número 180. Em uma emergência imediata, ligue para a Polícia Militar pelo 190.',
  },
  '/apoio': {
    eyebrow: 'Você não está sozinha',
    title: 'Encontre ajuda e atendimento',
    intro:
      'Se estiver em perigo imediato, procure um lugar seguro e ligue para os serviços de emergência. Se não for seguro telefonar, considere pedir a alguém de confiança que faça isso por você.',
    heading: 'Canais de atendimento',
    body:
      'Ligue 180 para a Central de Atendimento à Mulher, disponível para orientação e registro de denúncias. Em emergências, ligue 190. Você também pode procurar uma Delegacia da Mulher ou um serviço de assistência social da sua região.',
    contact: true,
  },
}

export default function SectionPage() {
  const { pathname } = useLocation()
  const section = sections[pathname]

  return (
    <main className="flex-1 bg-gradient-to-br from-[#fff8fc] to-[#f0e2ff] px-6 py-14 sm:px-10 sm:py-20">
      <article className="mx-auto max-w-4xl rounded-3xl border border-white bg-white/90 p-7 shadow-sm sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">
          {section.eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#422760] sm:text-5xl">
          {section.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-violet-800 sm:text-lg">
          {section.intro}
        </p>
        <section
          id={section.contact ? 'contato' : undefined}
          className="mt-9 rounded-2xl bg-[#fff4fb] p-6 sm:p-8"
        >
          <h2 className="font-serif text-xl font-bold text-[#422760] sm:text-2xl">
            {section.heading}
          </h2>
          <p className="mt-3 leading-relaxed text-[#51465a]">{section.body}</p>
          {section.contact && (
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="tel:180"
                className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Ligar 180
              </a>
              <a
                href="tel:190"
                className="rounded-full border border-pink-300 px-5 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
              >
                Emergência: 190
              </a>
            </div>
          )}
        </section>
        <Link
          to="/"
          className="mt-7 inline-block text-sm font-medium text-pink-600 underline underline-offset-2"
        >
          Voltar ao início
        </Link>
      </article>
    </main>
  )
}
