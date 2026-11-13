// Preferências locais da plataforma (não vão para o banco).
export const PREFERENCIAS_KEY = 'ella:preferencias';

// Só aceita sites desta lista (nunca texto livre), para ninguém salvar um link
// malicioso. A mesma lista é usada na Home, no chat e em "Minha área".
export const SITES_SAIDA_RAPIDA = [
  { nome: 'youtube', url: 'https://www.youtube.com' },
  { nome: 'Wikipédia', url: 'https://pt.wikipedia.org' },
  { nome: 'G1', url: 'https://g1.globo.com' },
];

export const SAIDA_RAPIDA_PADRAO = SITES_SAIDA_RAPIDA[0].url;

export function lerPreferencias() {
  try {
    const salvo = JSON.parse(localStorage.getItem(PREFERENCIAS_KEY) || 'null');

    return {
      saidaRapida: salvo?.saidaRapida || SAIDA_RAPIDA_PADRAO,
      mostrarFoto: salvo?.mostrarFoto ?? true,
    };
  } catch {
    return { saidaRapida: SAIDA_RAPIDA_PADRAO, mostrarFoto: true };
  }
}

export function salvarPreferencias(preferencias) {
  localStorage.setItem(PREFERENCIAS_KEY, JSON.stringify(preferencias));
}

// Garante que a URL salva continua sendo uma das opções permitidas.
export function lerSaidaRapida() {
  const { saidaRapida } = lerPreferencias();

  return SITES_SAIDA_RAPIDA.some((site) => site.url === saidaRapida)
    ? saidaRapida
    : SAIDA_RAPIDA_PADRAO;
}

export function nomeSaidaRapida(url) {
  return (
    SITES_SAIDA_RAPIDA.find((site) => site.url === url)?.nome ?? 'Não definida'
  );
}
