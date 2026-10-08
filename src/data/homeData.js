export const violenceTypes = [
  {
    icon: 'fa-hand',
    title: 'Física',
    description: 'Agressões, tapas, empurrões, uso de arma, entre outros.',
  },
  {
    icon: 'fa-brain',
    title: 'Psicológica',
    description: 'Insultos, ameaças, manipulação, humilhação e controle.',
  },
  {
    icon: 'fa-venus-mars',
    title: 'Sexual',
    description: 'Forçar relação, assédio, abusos e exploração sexual.',
  },
  {
    icon: 'fa-sack-dollar',
    title: 'Patrimonial',
    description:
      'Controle do dinheiro, destruição de bens e retenção de documentos.',
  },
  {
    icon: 'fa-comment-dots',
    title: 'Moral',
    description: 'Calúnia, difamação e exposição da vida íntima.',
  },
  {
    icon: 'fa-mobile-screen-button',
    title: 'Digital',
    description:
      'Perseguição online, divulgação de fotos e dados sem consentimento.',
  },
]

export const supportServices = [
  {
    icon: 'fa-brain',
    title: 'Psicólogos',
    description: 'Atendimento voluntário',
  },
  {
    icon: 'fa-people-roof',
    title: 'Assistência Social',
    description: 'CRAS / CREAS',
  },
  {
    icon: 'fa-heart',
    title: 'ONGs e Movimentos Sociais',
    description: 'Acolhimento e orientação',
  },
  {
    icon: 'fa-building-columns',
    title: 'Órgãos Governamentais',
    description: 'Delegacias da Mulher, Ministério Público e Disque 190',
  },
  {
    icon: 'fa-hands-holding-circle',
    title: 'Terapia Ocupacional',
    description: 'Suporte para autonomia e bem-estar',
  },
  {
    icon: 'fa-handshake-angle',
    title: 'Voluntários',
    description: 'Faça parte dessa rede',
  },
]

export const homeLinks = [
  {
    icon: 'fa-clipboard-check',
    label: 'Informações',
    description: 'Conheça os tipos de violência e seus direitos',
    to: '#tipos-violencia',
  },
  {
    icon: 'fa-people-group',
    label: 'Rede de Apoio',
    description: 'Psicólogos, ONGs e órgãos governamentais',
    to: '#rede-apoio',
  },
  {
    icon: 'fa-comment-dots',
    label: 'Chat',
    description: 'Converse com voluntários',
    to: '/apoio',
  },
  {
    icon: 'fa-triangle-exclamation',
    label: 'Denúncia',
    description: 'Saiba como e onde denunciar',
    to: '/apoio',
  },
]

export const sections = {
  '/sobre': {
    eyebrow: 'Quem somos',
    title: 'Um espaço de acolhimento e informação',
    intro:
      'ELLA significa Educação, Liberdade, Laços e Assistência. Este espaço foi criado para compartilhar informação confiável e aproximar mulheres de redes de apoio.',
    heading: 'Você está no controle dos próximos passos',
    body:
      'Cada história é única. Busque apoio no seu tempo e, se puder, converse com alguém de confiança. Não é preciso enfrentar uma situação de violência sem ajuda.',
  },
  '/informacoes': {
    eyebrow: 'Conheça seus direitos',
    title: 'Informação é uma forma de proteção',
    intro:
      'A violência contra a mulher pode ser física, psicológica, sexual, patrimonial ou moral. Nenhuma forma de violência é aceitável, e pedir orientação é um direito.',
    heading: 'Onde buscar orientação',
    body:
      'A Central de Atendimento à Mulher oferece orientação e encaminhamento pelo número 180. Em uma emergência imediata, ligue para a Polícia Militar pelo 190.',
  },
  '/apoio': {
    eyebrow: 'Você não está sozinha',
    title: 'Encontre ajuda e atendimento',
    intro:
      'Se estiver em perigo imediato, procure um lugar seguro e ligue para os serviços de emergência. Se não for seguro telefonar, considere pedir a alguém de confiança que faça isso por você.',
    heading: 'Canais de atendimento',
    body:
      'Ligue 180 para a Central de Atendimento à Mulher, disponível para orientação e registro de denúncias. Em emergências, ligue 190. Você também pode procurar uma Delegacia da Mulher ou um serviço de assistência social da sua região.',
    contact: true,
  },
}
