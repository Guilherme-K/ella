import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="flex min-h-screen flex-1 items-center justify-center bg-purple-100 px-4 py-16"
    >
      <section className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink-700">
          Erro 404
        </p>

        <h1 className="mt-3 font-serif text-3xl font-bold text-violet-950">
          Página não encontrada
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-violet-700">
          O endereço que você acessou não existe ou foi movido. Se você está
          buscando ajuda, os canais continuam disponíveis.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-pink-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-800"
          >
            Voltar ao início
          </Link>

          <Link
            to="/apoio"
            className="rounded-full border border-pink-300 px-5 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            Rede de Apoio
          </Link>
        </div>
      </section>
    </main>
  )
}
