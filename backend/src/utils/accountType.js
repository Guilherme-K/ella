import {
  ACCOUNT_TYPES,
  DEFAULT_ACCOUNT_TYPE,
} from '../constants/user.js';

// Normaliza o tipo de conta escolhido no cadastro (usuária, voluntária ou
// psicóloga). Retorna null quando o valor não é aceito, para cada rota decidir
// como responder ao cliente.
export function normalizeAccountType(value) {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_ACCOUNT_TYPE;
  }

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return ACCOUNT_TYPES.includes(normalized) ? normalized : null;
}

// O CRM é apenas informativo: não há checagem de formato ou de registro.
export function readCrm(value) {
  if (value === undefined || value === null) return null;

  const crm = String(value).trim();

  return crm.length > 0 ? crm.slice(0, 60) : null;
}
