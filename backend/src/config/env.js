import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Carrega o .env do backend independentemente da pasta de onde o processo
// foi iniciado (por exemplo, `npm run server` na raiz do projeto).
const currentDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(currentDir, '../../.env'),
});
