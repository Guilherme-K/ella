import BotaoVoltar from '../components/BotaoVoltar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Emergencia() {
  function registrarAcionamentoPolicia() {
    fetch(`${API_URL}/api/emergencia/acionamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tipo: 'ligacao_policial'
      }),
      keepalive: true
    }).catch((erro) => {
      console.error('Não foi possível registrar o acionamento:', erro)
    })
  }

  function compartilharLocalizacao() {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta localização.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        window.open(
          `https://www.google.com/maps?q=${latitude},${longitude}`,
          '_blank'
        )
      },
      () => {
        alert('Não foi possível acessar sua localização. Verifique a permissão do navegador.')
      }
    )
  }

  return (
    <main className="min-h-screen bg-[#c91d70] px-5 py-10 text-white">
      <section className="mx-auto flex w-full max-w-md flex-col items-center">

        {/* Botão Voltar alinhado à esquerda no topo e com cor clara para dar contraste */}
        <div className="mb-6 w-full text-left">
          <BotaoVoltar className="text-white hover:text-pink-200" />
        </div>

        <i className="fa-solid fa-triangle-exclamation mb-3 text-5xl" />

        <h1 className="text-2xl font-semibold">
          Botão de emergência
        </h1>

        <p className="mt-1 text-sm text-pink-100">
          Sua segurança é prioridade.
        </p>

        <p className="mb-5 mt-8 text-sm">
          Escolha como deseja ser ajudada:
        </p>

        <div className="flex w-full flex-col gap-4">

          <a
            href="tel:190"
            onClick={registrarAcionamentoPolicia}
            className="flex min-h-18 items-center gap-5 rounded-xl bg-[#b90060] px-6 transition hover:bg-[#aa0057]"
          >
            <i className="fa-solid fa-shield-halved text-3xl" />

            <span className="flex-1 text-center text-sm font-medium">
              Chamar a Polícia (190)
            </span>
          </a>

          <button
            type="button"
            onClick={compartilharLocalizacao}
            className="flex min-h-18 w-full items-center gap-5 rounded-xl bg-[#f4e3fa] px-6 text-[#c00065] transition hover:bg-white"
          >
            <i className="fa-solid fa-location-dot shrink-0 text-3xl" />

            <span className="flex-1 text-center text-sm font-medium leading-5">
              Ver minha localização no mapa
            </span>
          </button>

          <div className="mt-5 flex min-h-18 items-center gap-5 rounded-xl bg-[#f4e3fa] px-6 py-4 text-[#c00065]">

            <i className="fa-solid fa-shield-heart shrink-0 text-3xl" />

            <p className="flex-1 text-center text-sm font-medium leading-5">
              Se estiver em perigo, use um local seguro para acionar o botão de emergência.
            </p>

          </div>

        </div>
      </section>
    </main>
  )
}
