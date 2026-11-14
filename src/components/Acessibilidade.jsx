import { useState, useEffect } from 'react';

// Busca as vozes disponíveis. Em alguns navegadores (Chrome) a lista vem vazia
// na primeira chamada e só é preenchida depois do evento "voiceschanged".
function carregarVozes() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const sintese = window.speechSynthesis;
    const vozes = sintese.getVoices();

    if (vozes.length) {
      resolve(vozes);
      return;
    }

    let concluido = false;

    const finalizar = () => {
      if (concluido) return;
      concluido = true;
      try {
        sintese.removeEventListener('voiceschanged', finalizar);
      } catch {
        sintese.onvoiceschanged = null;
      }
      resolve(sintese.getVoices());
    };

    try {
      sintese.addEventListener('voiceschanged', finalizar);
    } catch {
      sintese.onvoiceschanged = finalizar;
    }

    // Não deixa a leitura travada se o navegador nunca disparar o evento.
    setTimeout(finalizar, 1500);
  });
}

function escolherVozPortugues(vozes) {
  return (
    vozes.find((voz) => /^pt[-_]BR$/i.test(voz.lang)) ||
    vozes.find((voz) => /^pt([-_]|$)/i.test(voz.lang)) ||
    null
  );
}

export default function Acessibilidade() {
  const [aberto, setAberto] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(100);
  const [altoContraste, setAltoContraste] = useState(false);
  const [escalaCinza, setEscalaCinza] = useState(false);
  const [sublinharLinks, setSublinharLinks] = useState(false);
  const [espacamentoTexto, setEspacamentoTexto] = useState(false);
  const [pausarAnimacoes, setPausarAnimacoes] = useState(false);
  const [cursorGrande, setCursorGrande] = useState(false);
  const [sobreClicavel, setSobreClicavel] = useState(false);
  const [guiaLeitura, setGuiaLeitura] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [lendo, setLendo] = useState(false);
  const [erroVoz, setErroVoz] = useState('');

  // Cancela qualquer leitura pendente ao sair da página.
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${tamanhoFonte}%`;
  }, [tamanhoFonte]);

  useEffect(() => {
    const html = document.documentElement;
    html.style.filter = [
      altoContraste ? 'invert(1) hue-rotate(180deg)' : '',
      escalaCinza ? 'grayscale(100%)' : ''
    ].filter(Boolean).join(' ');
  }, [altoContraste, escalaCinza]);

  useEffect(() => {
    const styleId = 'acessibilidade-estilos-extras';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    let css = '';

    if (sublinharLinks) {
      css += `
        a, button {
          text-decoration: underline !important;
          outline: 2px solid #8a2be2 !important;
        }
      `;
    }

    if (espacamentoTexto) {
      css += `
        body, p, span, a, li, h1, h2, h3, h4, label, input, textarea {
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
          line-height: 1.8 !important;
          font-family: Arial, Helvetica, sans-serif !important;
        }
      `;
    }

    if (pausarAnimacoes) {
      css += `
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }
      `;
    }

    if (cursorGrande) {
      css += `
        * {
          cursor: none !important;
        }
      `;
    }

    styleTag.innerHTML = css;
  }, [sublinharLinks, espacamentoTexto, pausarAnimacoes, cursorGrande]);

  useEffect(() => {
    if (!guiaLeitura && !cursorGrande) return;

    const moverMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (cursorGrande && e.target instanceof Element) {
        const ehClicavel = Boolean(
          e.target.closest('a, button, input, select, textarea, label, [role="button"], .cursor-pointer')
        );
        setSobreClicavel(ehClicavel);
      }
    };

    window.addEventListener('mousemove', moverMouse);
    return () => window.removeEventListener('mousemove', moverMouse);
  }, [guiaLeitura, cursorGrande]);

  const alternarLeituraVoz = async () => {
    setErroVoz('');

    if (
      !('speechSynthesis' in window) ||
      typeof window.SpeechSynthesisUtterance !== 'function'
    ) {
      setErroVoz('Seu navegador não suporta leitura em voz alta.');
      return;
    }

    const sintese = window.speechSynthesis;

    if (lendo) {
      sintese.cancel();
      setLendo(false);
      return;
    }

    const textoSelecionado =
      (window.getSelection?.()?.toString() || '').trim();
    const textoParaLer = (textoSelecionado || document.body.innerText || '').trim();

    if (!textoParaLer) {
      setErroVoz('Não há texto nesta página para ler.');
      return;
    }

    // Cancela uma fala anterior que possa ter ficado presa.
    sintese.cancel();

    const vozes = await carregarVozes();
    const voz = escolherVozPortugues(vozes);

    const fala = new window.SpeechSynthesisUtterance(textoParaLer.slice(0, 32000));
    fala.lang = 'pt-BR';
    fala.rate = 1;
    fala.pitch = 1;

    if (voz) {
      fala.voice = voz;
    }

    let iniciou = false;

    fala.onstart = () => {
      iniciou = true;
      setLendo(true);
    };

    fala.onend = () => {
      setLendo(false);
    };

    fala.onerror = (evento) => {
      setLendo(false);

      if (evento?.error === 'canceled' || evento?.error === 'interrupted') {
        return;
      }

      if (evento?.error === 'not-allowed') {
        setErroVoz('O navegador bloqueou a leitura. Toque em "Ouvir Texto" novamente.');
        return;
      }

      setErroVoz(
        voz
          ? 'Não foi possível iniciar a leitura em voz alta.'
          : 'Nenhuma voz em português foi encontrada. Verifique as vozes instaladas no sistema.'
      );
    };

    setLendo(true);
    sintese.speak(fala);

    // O Chrome às vezes deixa a fala em pausa até receber um "resume".
    sintese.resume();

    // Se nada começou, devolve o botão ao normal e avisa a usuária.
    setTimeout(() => {
      if (!iniciou && !sintese.speaking && !sintese.pending) {
        setLendo(false);
        setErroVoz(
          voz
            ? 'A leitura não iniciou. Toque em "Ouvir Texto" novamente.'
            : 'Nenhuma voz em português foi encontrada neste navegador.'
        );
      }
    }, 1500);
  };

  const resetarTudo = () => {
    setTamanhoFonte(100);
    setAltoContraste(false);
    setEscalaCinza(false);
    setSublinharLinks(false);
    setEspacamentoTexto(false);
    setPausarAnimacoes(false);
    setCursorGrande(false);
    setSobreClicavel(false);
    setGuiaLeitura(false);
    setErroVoz('');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setLendo(false);
    }
  };

  return (
    <>
      {cursorGrande && (
        <div
          style={{
            position: 'fixed',
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            pointerEvents: 'none',
            zIndex: 999999,
            transform: sobreClicavel ? 'translate(-18px, -4px)' : 'translate(-4px, -4px)'
          }}
        >
          {sobreClicavel ? (
            <svg width="54" height="54" viewBox="0 0 24 24">
              <path
                fill="#000000"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinejoin="round"
                d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10h1.5a1.5 1.5 0 0 1 1.5 1.5v.5h1a1.5 1.5 0 0 1 1.5 1.5v1.5c0 3.04-2.46 5.5-5.5 5.5h-2c-2.36 0-4.38-1.48-5.16-3.57l-1.57-4.18a1.5 1.5 0 0 1 2.55-1.52L9 13.5V11Z"
              />
            </svg>
          ) : (
            <svg width="54" height="54" viewBox="0 0 24 24">
              <path
                fill="#000000"
                stroke="#ffffff"
                strokeWidth="2"
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
              />
            </svg>
          )}
        </div>
      )}

            {guiaLeitura && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: `${mousePos.y - 25}px`,
            width: '100vw',
            height: '50px',
            backgroundColor: 'rgba(255, 235, 59, 0.25)',
            borderTop: '2px solid #7c3aed',
            borderBottom: '2px solid #7c3aed',
            pointerEvents: 'none',
            zIndex: 99998
          }}
        />
      )}

      <div style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: 99999, fontFamily: 'sans-serif' }}>
        {aberto && (
          <div style={{
            backgroundColor: '#ffffff',
            color: '#222222',
            border: '2px solid #7c3aed',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '12px',
            width: '250px',
            maxHeight: '75vh',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '7px'
          }}>
            <strong style={{ fontSize: '15px', marginBottom: '4px', color: '#5b21b6' }}>
              Acessibilidade ELLA
            </strong>

            <button onClick={alternarLeituraVoz} style={getEstiloBotao(lendo, '#fee2e2')}>
              <i className={`fa-solid ${lendo ? 'fa-stop' : 'fa-volume-high'}`}></i> {lendo ? 'Parar Leitura' : 'Ouvir Texto'}
            </button>

            {erroVoz && (
              <p role="alert" style={{ margin: 0, fontSize: '12px', lineHeight: 1.4, color: '#b91c1c' }}>
                {erroVoz}
              </p>
            )}

            <button onClick={() => setTamanhoFonte(t => Math.min(t + 10, 150))} style={getEstiloBotao(tamanhoFonte > 100)}>
              <i className="fa-solid fa-magnifying-glass-plus"></i> Aumentar Texto ({tamanhoFonte}%)
            </button>

            <button onClick={() => setTamanhoFonte(t => Math.max(t - 10, 80))} style={getEstiloBotao(tamanhoFonte < 100)}>
              <i className="fa-solid fa-magnifying-glass-minus"></i> Diminuir Texto
            </button>

            <button onClick={() => setEspacamentoTexto(!espacamentoTexto)} style={getEstiloBotao(espacamentoTexto)}>
              <i className="fa-solid fa-text-width"></i> Espaçamento de Texto
            </button>

            <button onClick={() => setGuiaLeitura(!guiaLeitura)} style={getEstiloBotao(guiaLeitura)}>
              <i className="fa-solid fa-grip-lines"></i> Guia de Leitura
            </button>

            <button onClick={() => setAltoContraste(!altoContraste)} style={getEstiloBotao(altoContraste)}>
              <i className="fa-solid fa-circle-half-stroke"></i> Alto Contraste
            </button>

            <button onClick={() => setEscalaCinza(!escalaCinza)} style={getEstiloBotao(escalaCinza)}>
              <i className="fa-solid fa-eye-low-vision"></i> Escala de Cinza
            </button>

            <button onClick={() => setSublinharLinks(!sublinharLinks)} style={getEstiloBotao(sublinharLinks)}>
              <i className="fa-solid fa-underline"></i> Destacar Links
            </button>

            <button onClick={() => setPausarAnimacoes(!pausarAnimacoes)} style={getEstiloBotao(pausarAnimacoes)}>
              <i className="fa-solid fa-pause"></i> Pausar Animações
            </button>

            <button onClick={() => setCursorGrande(!cursorGrande)} style={getEstiloBotao(cursorGrande)}>
              <i className="fa-solid fa-arrow-pointer"></i> Cursor Grande
            </button>

            <button onClick={resetarTudo} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
              borderRadius: '6px', border: '1px solid #7c3aed', backgroundColor: '#f3e8ff',
              color: '#5b21b6', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginTop: '4px'
            }}>
              <i className="fa-solid fa-rotate-left"></i> Restaurar Padrão
            </button>
          </div>
        )}

        <button
          onClick={() => setAberto(!aberto)}
          aria-label="Abrir menu de acessibilidade"
          title="Acessibilidade"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            marginLeft: 'auto'
          }}
        >
          <i className="fa-solid fa-universal-access"></i>
        </button>
      </div>
    </>
  );
}

const getEstiloBotao = (ativo, corAtiva = '#ede9fe') => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 10px',
  borderRadius: '6px',
  border: ativo ? '1px solid #7c3aed' : '1px solid #ddd',
  backgroundColor: ativo ? corAtiva : '#f9fafb',
  color: '#111',
  cursor: 'pointer',
  fontSize: '13px',
  textAlign: 'left',
  fontWeight: ativo ? '600' : 'normal'
});
