import { Link, useLocation } from 'react-router-dom'
import { sections } from '../data/homeData'

export default function SectionPage() {
  const { pathname } = useLocation()
  const section = sections[pathname]

  return (
    <main className="flex-1 bg-gradient-to-br from-pink-50 to-purple-100 px-6 py-14 sm:px-10 sm:py-20">
      <article className="mx-auto max-w-4xl rounded-3xl border border-white bg-white/90 p-7 shadow-sm sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-500">
          {section.eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-violet-950 sm:text-5xl">
          {section.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-violet-800 sm:text-lg">
          {section.intro}
        </p>
        <section
          id={section.contact ? 'contato' : undefined}
          className="mt-9 rounded-2xl bg-pink-50 p-6 sm:p-8"
        >
          <h2 className="font-serif text-xl font-bold text-violet-950 sm:text-2xl">
            {section.heading}
          </h2>
          <p className="mt-3 leading-relaxed text-violet-950">{section.body}</p>
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
