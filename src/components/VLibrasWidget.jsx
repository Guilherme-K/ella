import { useEffect } from 'react';

export default function VLibrasWidget() {
  useEffect(() => {
    if (document.getElementById('vlibras-script')) return;

    const container = document.createElement('div');
    container.setAttribute('vw', '');
    container.className = 'enabled';
    container.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(container);

    const script = document.createElement('script');
    script.id = 'vlibras-script';
    // Usa o espelho oficial do pacote NPM do VLibras no JSDelivr
    script.src = 'https://jsdelivr.net';
    script.async = true;

    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br');
      }
    };

    document.body.appendChild(script);
  }, []);

  return null;
}
