import { useEffect } from 'react';

const VLIBRAS_SCRIPT = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const VLIBRAS_APP = 'https://vlibras.gov.br/app';

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
    script.src = VLIBRAS_SCRIPT;
    script.async = true;

    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget(VLIBRAS_APP);
      }
    };

    document.body.appendChild(script);
  }, []);

  return null;
}
