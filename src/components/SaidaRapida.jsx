import { useCallback, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';

export default function SaidaRapida({ modo = 'global', className = '' }) {
  const LINK_PADRAO = 'https://youtube.com';
  const [urlDestino] = useState(() => {
    const linkPersonalizado = localStorage.getItem('ella_link_saida_rapida');
    return linkPersonalizado?.trim() ? linkPersonalizado : LINK_PADRAO;
  });
  const [mostrarFlutuante, setMostrarFlutuante] = useState(false);

  const ancoraRef = useRef(null);
  const location = useLocation();

  const acionarSaida = useCallback(() => {
    window.location.replace(urlDestino);
  }, [urlDestino]);

  useEffect(() => {
    let ultimoEsc = 0;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const agora = Date.now();
        if (agora - ultimoEsc < 800) {
          acionarSaida();
        }
        ultimoEsc = agora;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [acionarSaida]);

  // Vigia a rolagem da tela apenas quando está no modo 'home'
  useEffect(() => {
    if (modo !== 'home') return;

    const observador = new IntersectionObserver(
      ([entry]) => {
        setMostrarFlutuante(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (ancoraRef.current) {
      observador.observe(ancoraRef.current);
    }

    return () => observador.disconnect();
  }, [modo]);

  // O botão flutuante precisa viver diretamente no <body>: dentro do hero da
  // home existe um `isolate`, que cria um contexto de empilhamento e fazia o
  // botão passar por trás dos cards e do footer ao rolar a página.
  const botaoFlutuante = () =>
    createPortal(
      <button
        onClick={acionarSaida}
        title="Sair imediatamente do site (ou aperte ESC duas vezes)"
        className="fixed bottom-5 left-5 z-[9990] rounded-lg bg-purple-100 px-4 py-2 text-xs font-semibold text-violet-700 underline decoration-violet-400 underline-offset-2 shadow-lg transition hover:bg-purple-200 cursor-pointer"
      >
        Saída Rápida
      </button>,
      document.body,
    );

  if (modo === 'global' && location.pathname === '/') {
    return null;
  }


  if (modo === 'home') {
    return (
      <>
        <div ref={ancoraRef} className="inline-block">
          <button
            onClick={acionarSaida}
            title="Sair imediatamente do site (ou aperte ESC duas vezes)"
            className={`rounded-lg bg-purple-100 px-4 py-2 text-xs font-medium text-violet-700 underline decoration-violet-400 underline-offset-2 transition hover:bg-purple-200 cursor-pointer ${className}`}
          >
            Saída Rápida
          </button>
        </div>

        {mostrarFlutuante && botaoFlutuante()}
      </>
    );
  }

  return botaoFlutuante();
}
