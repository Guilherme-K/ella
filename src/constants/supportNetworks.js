// Imagens prontas que acompanham o projeto. O admin pode escolher uma delas
// ou enviar a própria imagem; sem escolha, a primeira é usada como padrão.
export const IMAGENS_REDES = [
  { id: 'acolhimento', nome: 'Acolhimento', src: '/redes/acolhimento.svg' },
  { id: 'seguranca', nome: 'Segurança', src: '/redes/seguranca.svg' },
  { id: 'justica', nome: 'Justiça', src: '/redes/justica.svg' },
  { id: 'saude', nome: 'Saúde', src: '/redes/saude.svg' },
  { id: 'comunidade', nome: 'Comunidade', src: '/redes/comunidade.svg' },
  { id: 'orientacao', nome: 'Orientação', src: '/redes/orientacao.svg' },
];

export const IMAGEM_REDE_PADRAO = IMAGENS_REDES[0].src;

export const MAX_PALAVRAS_DESCRICAO = 30;
export const MAX_CARACTERES_NOME = 120;
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
