export const violenceTypes = [
  {
    id: 'violencia-fisica',
    icon: 'fa-hand',
    title: 'Física',
    description: 'Agressões, tapas, empurrões, uso de arma, entre outros.',
  },
  {
    id: 'violencia-psicologica',
    icon: 'fa-brain',
    title: 'Psicológica',
    description: 'Insultos, ameaças, manipulação, humilhação e controle.',
  },
  {
    id: 'violencia-sexual',
    icon: 'fa-venus-mars',
    title: 'Sexual',
    description: 'Forçar relação, assédio, abusos e exploração sexual.',
  },
  {
    id: 'violencia-patrimonial',
    icon: 'fa-sack-dollar',
    title: 'Patrimonial',
    description:
      'Controle do dinheiro, destruição de bens e retenção de documentos.',
  },
  {
    id: 'violencia-moral',
    icon: 'fa-comment-dots',
    title: 'Moral',
    description: 'Calúnia, difamação e exposição da vida íntima.',
  },
  {
    id: 'violencia-digital',
    icon: 'fa-mobile-screen-button',
    title: 'Digital',
    description:
      'Perseguição online, divulgação de fotos e dados sem consentimento.',
  },
]

export const supportServices = [
  {
    id: 'psicologos',
    nome: 'Psicólogos',
    title: 'Psicólogos',
    categoria: 'Saúde mental e acolhimento',
    descricao:
      'Atendimento voluntário e acolhimento emocional com foco em escuta qualificada e fortalecimento psicológico.',
    description: 'Atendimento voluntário',
    detalhes:
      'Profissionais voluntários de psicologia oferecem acolhimento e suporte emocional para mulheres em situação de vulnerabilidade.',
    imagem: '/redes/psicologia.svg',
    image: '/redes/psicologia.svg',
    telefone: '188',
    site: 'https://site.cfp.org.br',
    icon: 'fa-brain',
  },
  {
    id: 'assistencia-social',
    nome: 'Assistência Social',
    title: 'Assistência Social',
    categoria: 'Assistência social',
    descricao:
      'Atendimento pelo CRAS e CREAS para proteção social, garantia de direitos e acesso a programas socioassistenciais.',
    description: 'CRAS / CREAS',
    detalhes:
      'Os Centros de Referência (CRAS e CREAS) acolhem famílias e pessoas em situação de risco, oferecendo orientação e benefícios.',
    imagem: '/redes/comunidade.svg',
    image: '/redes/comunidade.svg',
    site: 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento',
    icon: 'fa-people-roof',
  },
  {
    id: 'ongs-movimentos',
    nome: 'ONGs e Movimentos Sociais',
    title: 'ONGs e Movimentos Sociais',
    categoria: 'Acolhimento e orientação',
    descricao:
      'Organizações da sociedade civil dedicadas à defesa dos direitos das mulheres, acolhimento e orientação comunitária.',
    description: 'Acolhimento e orientação',
    detalhes:
      'Rede solidária de apoio mútuo, capacitação, assessoria jurídica comunitária e encaminhamentos.',
    imagem: '/redes/acolhimento.svg',
    image: '/redes/acolhimento.svg',
    site: 'https://www.geledes.org.br',
    icon: 'fa-heart',
  },
  {
    id: 'orgaos-governamentais',
    nome: 'Órgãos Governamentais',
    title: 'Órgãos Governamentais',
    categoria: 'Segurança e proteção',
    descricao:
      'Delegacias da Mulher, Ministério Público, Defensoria Pública e Disque 190 para proteção imediata e cumprimento das leis.',
    description: 'Delegacias da Mulher, Ministério Público e Disque 190',
    detalhes:
      'Canais públicos oficiais para investigação, aplicação de medidas protetivas e garantia dos direitos da mulher.',
    imagem: '/redes/seguranca.svg',
    image: '/redes/seguranca.svg',
    telefone: '190',
    site: 'https://www.gov.br/mulheres/pt-br',
    icon: 'fa-building-columns',
  },
  {
    id: 'terapia-ocupacional',
    nome: 'Terapia Ocupacional',
    title: 'Terapia Ocupacional',
    categoria: 'Autonomia e bem-estar',
    descricao:
      'Suporte especializado para promover a autonomia, reinserção nas atividades cotidianas e reconstrução de projetos de vida.',
    description: 'Suporte para autonomia e bem-estar',
    detalhes:
      'Acompanhamento para recuperação funcional, resgate da autoestima, rotina segura e fortalecimento da independência.',
    imagem: '/redes/terapia.svg',
    image: '/redes/terapia.svg',
    site: 'https://coffito.gov.br',
    icon: 'fa-hands-holding-circle',
  },
  {
    id: 'voluntarios',
    nome: 'Voluntários',
    title: 'Voluntários',
    categoria: 'Rede colaborativa',
    descricao:
      'Pessoas e profissionais dispostos a doar tempo, talento e carinho para apoiar quem mais precisa.',
    description: 'Faça parte dessa rede',
    detalhes:
      'Iniciativas de voluntariado integradas à plataforma ELLA para apoio em acolhimento, orientação e capacitação.',
    imagem: '/redes/voluntariado.svg',
    image: '/redes/voluntariado.svg',
    site: '/voluntaria',
    icon: 'fa-handshake-angle',
  },
  {
    id: 'ligue-180',
    nome: 'Ligue 180',
    title: 'Ligue 180',
    categoria: 'Orientação e atendimento',
    descricao:
      'Central gratuita de atendimento à mulher: orienta sobre direitos, informa serviços e recebe denúncias, 24 horas por dia.',
    description: 'Central gratuita de atendimento à mulher',
    detalhes:
      'Gratuito, disponível 24 horas por dia, todos os dias. Também atende pelo WhatsApp (61) 9610-0180.',
    imagem: '/redes/orientacao.svg',
    image: '/redes/orientacao.svg',
    telefone: '180',
    site: 'https://www.gov.br/mulheres/pt-br/ligue180',
    icon: 'fa-phone',
  },
  {
    id: 'delegacias-da-mulher',
    nome: 'Delegacias da Mulher',
    title: 'Delegacias da Mulher',
    categoria: 'Segurança e proteção',
    descricao:
      'Unidades policiais especializadas no atendimento de mulheres em situação de violência, com acolhimento e encaminhamento.',
    description: 'Unidades policiais especializadas',
    detalhes:
      'Quando não houver uma delegacia especializada na cidade, também é possível procurar uma delegacia comum.',
    imagem: '/redes/seguranca.svg',
    image: '/redes/seguranca.svg',
    telefone: '190',
    site: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/susp-mulheres/violencia-domestica-e-familiar',
    icon: 'fa-shield-halved',
  },
  {
    id: 'casa-da-mulher-brasileira',
    nome: 'Casa da Mulher Brasileira',
    title: 'Casa da Mulher Brasileira',
    categoria: 'Atendimento integrado',
    descricao:
      'Espaço público que reúne acolhimento, apoio psicossocial, atendimento policial, jurídico e alojamento de passagem.',
    description: 'Acolhimento e atendimento integrado',
    detalhes:
      'Pode oferecer apoio psicossocial, atendimento policial, jurídico, alojamento de passagem e outros serviços, conforme a unidade.',
    imagem: '/redes/acolhimento.svg',
    image: '/redes/acolhimento.svg',
    site: 'https://www.gov.br/mulheres/pt-br/acesso-a-informacao/acoes-e-programas/casa-da-mulher-brasileira',
    icon: 'fa-house-chimney-window',
  },
  {
    id: 'defensoria-publica',
    nome: 'Defensoria Pública',
    title: 'Defensoria Pública',
    categoria: 'Orientação jurídica',
    descricao:
      'Oferece orientação e assistência jurídica gratuita para quem não pode contratar advogado ou advogada.',
    description: 'Assistência jurídica gratuita',
    detalhes:
      'Pode orientar sobre direitos, medidas protetivas e procedimentos judiciais.',
    imagem: '/redes/justica.svg',
    image: '/redes/justica.svg',
    site: 'https://www.gov.br/mulheres/pt-br/central-de-conteudos/noticias/2026/agosto-defeso-eleitoral/especial-lei-maria-da-penha-saiba-onde-e-como-buscar-ajuda-em-casos-de-violencia-domestica-e-familiar',
    icon: 'fa-scale-balanced',
  },
  {
    id: 'creas',
    nome: 'CREAS',
    title: 'CREAS',
    categoria: 'Assistência social',
    descricao:
      'Centro de assistência social para pessoas e famílias em situação de risco ou com direitos violados.',
    description: 'Centro de referência especializado',
    detalhes:
      'Pode oferecer acompanhamento especializado, orientação e encaminhamentos para outros serviços públicos.',
    imagem: '/redes/comunidade.svg',
    image: '/redes/comunidade.svg',
    site: 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/unidades-de-atendimento/centro-de-referencia-especializado-de-assistencia-social-creas',
    icon: 'fa-people-group',
  },
  {
    id: 'servicos-de-saude',
    nome: 'Serviços de Saúde',
    title: 'Serviços de Saúde',
    categoria: 'Saúde e acolhimento',
    descricao:
      'Unidades de saúde que atendem necessidades da mulher e orientam sobre os serviços disponíveis na rede pública.',
    description: 'Unidades de saúde pública',
    detalhes:
      'Unidades básicas de saúde e hospitais podem fazer parte dos caminhos de atendimento, conforme a necessidade.',
    imagem: '/redes/saude.svg',
    image: '/redes/saude.svg',
    site: 'https://www.gov.br/saude/pt-br',
    icon: 'fa-heart-pulse',
  },
]

export const homeLinks = [
  {
    icon: 'fa-clipboard-check',
    label: 'Informações',
    description: 'Conheça os tipos de violência e seus direitos',
    to: '/informacoes',
  },
  {
    icon: 'fa-people-group',
    label: 'Rede de Apoio',
    description: 'Psicólogos, ONGs e órgãos governamentais',
    to: '/apoio',
  },
  {
    icon: 'fa-comment-dots',
    label: 'Chat',
    description: 'Converse com voluntários',
    to: '/chat',
  },
  {
    icon: 'fa-triangle-exclamation',
    label: 'Denúncia',
    description: 'Saiba como e onde denunciar',
    to: '/denuncia',
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
      'A violência contra a mulher pode ser física, psicológica, sexual, patrimonial, moral e vicária. Nenhuma forma de violência é aceitável, e pedir orientação é um direito.',
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
