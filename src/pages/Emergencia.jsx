
export default function Emergencia() {
  function compartilharLocalizacao() {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta localização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        window.open(
          `https://www.google.com/maps?q=${latitude},${longitude}`,
          '_blank'
        );
      },
      () => {
        alert('Não foi possível acessar sua localização. Verifique a permissão do navegador.');
      }
    );
  }

  return (
    <main className="min-h-screen bg-[#c91d70] px-5 py-10 text-white">
      <section className="mx-auto flex w-full max-w-md flex-col items-center">

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
            className="flex min-h-[72px] items-center gap-5 rounded-xl bg-[#b90060] px-6 transition hover:bg-[#aa0057]"
          >
            <i className="fa-solid fa-shield-halved text-3xl" />

            <span className="flex-1 text-center text-sm font-medium">
              Chamar a Polícia (190)
            </span>
          </a>

          <button
            type="button"
            onClick={compartilharLocalizacao}
            className="flex min-h-[72px] w-full items-center gap-5 rounded-xl bg-[#f4e3fa] px-6 text-[#c00065] transition hover:bg-white"
          >
            <i className="fa-solid fa-location-dot shrink-0 text-3xl" />

            <span className="flex-1 text-center text-sm font-medium leading-5">
              Compartilhar minha localização em tempo real
            </span>
          </button>

          <div className="mt-5 flex min-h-[72px] items-center gap-5 rounded-xl bg-[#f4e3fa] px-6 py-4 text-[#c00065]">

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
