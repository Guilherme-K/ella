# Backend ELLA (Express + Prisma + MySQL)

API REST criada seguindo a estrutura do projeto `api-completa_JWT`, com
Prisma ORM 7 e MySQL (compatível com MySQL Workbench).

As telas de **cadastro**, **login** e **contas** do frontend React já
consomem esta API. O restante do site continua usando os dados mock em
`localStorage` (`src/api_crud.js`).

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── prisma.config.ts
├── src/
│   ├── app.js
│   ├── server.js
│   ├── constants/user.js
│   ├── lib/prisma.js
│   ├── middlewares/auth.js
│   ├── routes/index.js
│   ├── routes/legacyAuth.js
│   ├── routes/users.js
│   └── utils/
├── .env.example
└── package.json
```

## 1. Criar o banco no MySQL Workbench

1. Abra o MySQL Workbench e conecte-se ao seu servidor local.
2. Crie um schema (banco) chamado `backend_db`:

```sql
CREATE DATABASE IF NOT EXISTS backend_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

O mesmo comando está em [`database/create-database.sql`](./database/create-database.sql).

> Você pode usar outro nome, desde que atualize `DB_NAME` e `DATABASE_URL`
> no arquivo `.env`.

## 2. Configurar as variáveis de ambiente

Copie `.env.example` para `.env` e ajuste usuário, senha e nome do banco:

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` não é versionado. As variáveis são carregadas por
`src/config/env.js`, então o backend funciona mesmo sendo iniciado da raiz
do projeto (`npm run server`).

## 3. Instalar as dependências

```powershell
npm install
```

## 4. Criar as tabelas com o Prisma

Com o MySQL em execução e o `.env` configurado:

```powershell
# Gera o Prisma Client em src/generated/prisma
npm run prisma:generate

# Aplica a migration inicial (cria a tabela User)
npx prisma migrate deploy
```

Se preferir criar uma nova migration a partir do schema durante o
desenvolvimento:

```powershell
npm run prisma:migrate
```

Para inspecionar os dados visualmente:

```powershell
npm run prisma:studio
```

### Usuário administrador

O seed cria (ou atualiza) a conta administrativa de forma idempotente:

```powershell
npm run prisma:seed
```

- E-mail: `admin@email.com`
- Senha: `admin1234`
- Papel: `admin` (acesso à rota `/admin`)

O cadastro público sempre cria o papel `usuaria`; os demais papéis
(`voluntaria`, `psicologa`, `admin`) são definidos pela equipe.

## 5. Iniciar a API

```powershell
npm run dev
```

A API ficará disponível em `http://127.0.0.1:5000`.

## Endpoints

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| GET | `/` | Status da API | Não |
| GET | `/api/status` | Status da API | Não |
| GET | `/teste-banco` | Testa a conexão com o banco | Não |
| POST | `/cadastro` | Cadastro (compatível com o frontend da main) | Não |
| POST | `/login` | Login (compatível com o frontend da main) | Não |
| GET | `/api/users` | Lista os usuários (sem senha) | Não |
| GET | `/api/users/me` | Exibe o usuário autenticado | Bearer token |
| PATCH | `/api/users/me` | Atualiza perfil/avatar do usuário autenticado | Bearer token |
| GET | `/api/users/:id` | Exibe um usuário | Não |
| POST | `/api/users` | Cadastra um usuário | Não |
| POST | `/api/users/login` | Login e geração do token JWT | Não |
| PATCH | `/api/users/:id` | Atualiza os próprios dados | Bearer token |
| DELETE | `/api/users/:id` | Exclui a própria conta | Bearer token |

### Cadastro

```http
POST /api/users
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "12345678"
}
```

Também é aceito o campo `nome` no lugar de `name`, para facilitar a
integração futura com o formulário atual do frontend.

### Login

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "maria@example.com",
  "password": "12345678"
}
```

Resposta:

```json
{
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@example.com",
    "role": "usuaria",
    "avatar": "avatar-1",
    "nickname": null,
    "bio": null,
    "city": null,
    "phone": null
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Perfil e avatar

O frontend usa `GET /api/users/me` para carregar os dados da página
**Minha área** e `PATCH /api/users/me` para salvar alterações:

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "apelido": "Mari",
  "bio": "Acredito que ouvir também é cuidar.",
  "cidade": "São Paulo - SP",
  "telefone": "(11) 98765-4321",
  "avatar": "avatar-3"
}
```

Os avatares são pré-setados e identificados por `avatar-1` … `avatar-8`.
O banco guarda apenas o identificador; o desenho é feito no frontend
(`src/data/avatars.js`).

### Rotas protegidas

Envie o token no cabeçalho:

```http
Authorization: Bearer <token>
```

## Modelo de dados

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String?
  role      String   @default("usuaria")
  avatar    String   @default("avatar-1")
  nickname  String?
  bio       String?  @db.Text
  city      String?
  phone     String?
  createdAt DateTime @default(now())
}
```

## Integração com o frontend

As telas de cadastro, login e contas usam a API:

- `src/pages/Signup.jsx` chama `POST /cadastro`.
- `src/pages/Login.jsx` chama `POST /login`.
- `src/pages/Accounts.jsx` chama `GET /api/users` para exibir as contas.
- `src/pages/Perfil.jsx` (Minha área) chama `GET` e `PATCH /api/users/me`.
- `src/pages/PerfilAdmin.jsx` mostra os dados do admin e permite trocar o avatar.

As rotas `/cadastro` e `/login` são de compatibilidade com o frontend da
`main` e usam o Prisma por baixo dos panos. Elas retornam os campos
`id`, `nome`, `email`, `tipo`, `avatar` e `token`, no formato esperado
pelas telas atuais. O login também devolve `role`, para o redirecionamento
por papel (`admin` → `/admin`).

A camada de serviços em `src/services/` continua disponível:

- `httpClient.js` — cliente `fetch` com suporte a token Bearer.
- `userService.js` — métodos `list`, `me`, `updateMe`, `getById`, `create`, `login`, `update` e `remove`.

A URL da API é lida de `VITE_API_URL` no `.env` do frontend (veja
`.env.example`); por padrão usa `http://127.0.0.1:5000`.

O token JWT fica salvo em `localStorage` na chave `ella:token`, e o usuário
atual em `usuarioLogado` (usado pelas páginas de chat).

Exemplo de login:

```js
import { userService } from '../services/userService'

const { user, token } = await userService.login({ email, password })
```

