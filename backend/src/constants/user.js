// Papéis disponíveis na plataforma.
// O cadastro público sempre cria "usuaria"; os demais papéis são definidos
// pela equipe (ou pelo seed do admin).
export const USER_ROLES = ['usuaria', 'voluntaria', 'psicologa', 'admin'];

export const DEFAULT_ROLE = 'usuaria';

// Tipo de conta escolhido no cadastro. O papel (role) continua sendo "usuaria"
// para todas elas; o tipo serve para a administração diferenciar voluntárias e
// psicólogas no painel.
export const ACCOUNT_TYPES = ['usuaria', 'voluntaria', 'psicologa'];

export const DEFAULT_ACCOUNT_TYPE = 'usuaria';

// Avatares pré-setados. O banco guarda apenas o identificador.
export const AVATAR_IDS = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
  'avatar-7',
  'avatar-8',
];

export const DEFAULT_AVATAR = 'avatar-1';
