// Imagens prontas que acompanham o projeto. O admin pode escolher uma delas
// ou enviar a própria imagem; sem escolha, a primeira é usada como padrão.
// São arquivos locais (SVG), então funcionam offline e não dependem de API.
export const IMAGENS_REDES = [
  { id: 'acolhimento', nome: 'Acolhimento', src: '/redes/acolhimento.svg' },
  { id: 'seguranca', nome: 'Segurança', src: '/redes/seguranca.svg' },
  { id: 'justica', nome: 'Justiça', src: '/redes/justica.svg' },
  { id: 'saude', nome: 'Saúde', src: '/redes/saude.svg' },
  { id: 'comunidade', nome: 'Comunidade', src: '/redes/comunidade.svg' },
  { id: 'orientacao', nome: 'Orientação', src: '/redes/orientacao.svg' },
  { id: 'psicologia', nome: 'Psicologia', src: '/redes/psicologia.svg' },
  { id: 'terapia', nome: 'Terapia Ocupacional', src: '/redes/terapia.svg' },
  { id: 'voluntariado', nome: 'Voluntariado', src: '/redes/voluntariado.svg' },
];

export const IMAGEM_REDE_PADRAO = IMAGENS_REDES[0].src;

// Sugestões de categoria usadas no formulário do painel.
export const CATEGORIAS_REDE = [
  'Orientação e atendimento',
  'Segurança e proteção',
  'Atendimento integrado',
  'Orientação jurídica',
  'Assistência social',
  'Saúde e acolhimento',
  'Saúde mental e acolhimento',
  'Autonomia e bem-estar',
  'Rede colaborativa',
  'Acolhimento e escuta',
  'Educação e prevenção',
  'Outros',
];

export const MAX_PALAVRAS_DESCRICAO = 30;
export const MAX_CARACTERES_NOME = 120;
export const MAX_CARACTERES_CATEGORIA = 80;
export const MAX_CARACTERES_DETALHES = 600;
export const MAX_CARACTERES_SITE = 500;
export const MAX_CARACTERES_TELEFONE = 40;
export const MAX_IMAGEM_BYTES = 2 * 1024 * 1024;

export function contarPalavras(texto) {
  return String(texto ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function imagemDaRede(imagem) {
  return imagem || IMAGEM_REDE_PADRAO;
}

// Converte o telefone exibido (ex.: "(61) 9610-0180") em link `tel:`.
export function linkTelefone(telefone) {
  const digitos = String(telefone ?? '').replace(/\D/g, '');

  return digitos ? `tel:${digitos}` : null;
}

// Aceita links http(s) e rotas internas (/...), evitando javascript: ou outros protocolos.
export function siteSeguro(site) {
  const valor = String(site ?? '').trim();

  if (!valor) return null;

  if (valor.startsWith('/') && !valor.startsWith('//')) {
    return valor;
  }

  try {
    const url = new URL(valor);

    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : null;
  } catch {
    return null;
  }
}
