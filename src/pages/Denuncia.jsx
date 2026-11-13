import VoltarLink from '../components/VoltarLink'

export default function Denuncia() {
  return (
    <main id="conteudo" tabIndex={-1} className="min-h-screen bg-[#fff5ff] px-6 py-10">

      <div className="max-w-5xl mx-auto">

        <VoltarLink className="text-purple-900 mb-8" />

        <h1 className="text-3xl font-bold text-purple-950 mb-3">
          Saiba como e onde denunciar
        </h1>

        <p className="text-purple-900 mb-10">
          Conheça os canais disponíveis para buscar ajuda.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-pink-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-purple-950 mb-3">
              Ligue 180
            </h2>

            <p className="text-purple-900 mb-6">
              Central de Atendimento à Mulher. Receba orientações e registre denúncias.
            </p>

            <a
              href="https://www.gov.br/mulheres/pt-br/ligue180"
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-pink-600 text-white rounded-full py-3"
            >
              Acessar
            </a>
          </div>

          <div className="bg-purple-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-purple-950 mb-3">
              Delegacia da Mulher
            </h2>

            <p className="text-purple-900 mb-6">
              Procure uma delegacia especializada para registrar uma ocorrência.
            </p>

            <a
              href="https://www.google.com/maps/search/delegacia+da+mulher/"
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-purple-800 text-white rounded-full py-3"
            >
              Encontrar
            </a>
          </div>

          <div className="bg-pink-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-purple-950 mb-3">
              Emergência – 190
            </h2>

            <p className="text-purple-900 mb-6">
              Em situações de perigo imediato, ligue para a Polícia Militar.
            </p>

            <a
              href="tel:190"
              className="block text-center bg-pink-600 text-white rounded-full py-3"
            >
              Ligar
            </a>
          </div>

        </section>

        <div className="mt-10 bg-purple-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-purple-950 mb-2">
            Você não está sozinha!
          </h2>

          <p className="text-purple-900">
            Você tem direitos e merece ser protegida.
          </p>
        </div>

      </div>
    </main>
  )
}
