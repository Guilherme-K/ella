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
│   ├── routes/messages.js
│   ├── routes/supportNetworks.js
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

- E-mail: `elladmin@email.com`
- Senha: `12345678`
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
| GET | `/api/users` | Lista os usuários (sem senha) | Bearer token (admin) |
| GET | `/api/users/me` | Exibe o usuário autenticado | Bearer token |
| PATCH | `/api/users/me` | Atualiza perfil/avatar/foto do usuário autenticado | Bearer token |
| GET | `/api/users/:id` | Exibe um usuário | Não |
| POST | `/api/users` | Cadastra um usuário | Não |
| POST | `/api/users/login` | Login e geração do token JWT | Não |
| PATCH | `/api/users/:id` | Atualiza os próprios dados | Bearer token |
| DELETE | `/api/users/:id` | Exclui a própria conta | Bearer token |
| POST | `/api/emergencia/acionamentos` | Registra um acionamento do botão de emergência | Não |
| GET | `/api/emergencia/acionamentos/total` | Retorna o total de acionamentos | Não |
| GET | `/api/mensagens?chat=usuaria` | Lista as mensagens salvas do próprio usuário | Bearer token |
| POST | `/api/mensagens` | Salva uma mensagem do próprio usuário | Bearer token |
| PATCH | `/api/mensagens/:id` | Edita uma mensagem do próprio usuário | Bearer token |
| DELETE | `/api/mensagens/:id` | Exclui uma mensagem do próprio usuário | Bearer token |
| GET | `/api/redes-apoio` | Lista os cards da Rede de Apoio | Não |
| POST | `/api/redes-apoio` | Cadastra um card da Rede de Apoio | Bearer token (admin) |
| PATCH | `/api/redes-apoio/:id` | Atualiza um card da Rede de Apoio | Bearer token (admin) |
| DELETE | `/api/redes-apoio/:id` | Exclui um card da Rede de Apoio | Bearer token (admin) |

### Cadastro

```http
POST /api/users
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "12345678",
  "accountType": "psicologa",
  "crm": "CRP 00/000000"
}
```

Também é aceito o campo `nome` no lugar de `name`, para facilitar a
integração futura com o formulário atual do frontend. O `accountType` aceita
`usuaria` (padrão), `voluntaria` ou `psicologa`; o `crm` só é salvo para
psicólogas e não passa por validação de formato.

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
    "accountType": "usuaria",
    "crm": null,
    "avatar": "avatar-1",
    "photo": null,
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
O banco guarda apenas o identificador; as imagens SVG são geradas no
frontend com **DiceBear** (`@dicebear/core` e `@dicebear/styles`), a partir
das definições em `src/data/avatars.js`. Os presets usam apenas os estilos
da linha de arte do Lorelei: `lorelei`, `lorelei-neutral`, `adventurer` e
`adventurer-neutral`.

### Foto de perfil

Além dos presets, é possível enviar uma foto. O frontend converte a imagem
em data URL e envia no campo `photo`:

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "photo": "data:image/png;base64,iVBORw0KGgo..."
}
```

A API aceita apenas PNG, JPEG ou WebP com até 2 MB (o corpo JSON tem limite
de 8 MB para comportar o base64). A foto fica salva na coluna `photo`
(`LONGTEXT`) e, quando presente, tem prioridade sobre o avatar pré-setado.
Para remover a foto, envie `"photo": null`; para voltar a um preset, envie
o `avatar` junto com `"photo": null`.

### Mensagens do chat

As mensagens digitadas nas telas de chat são salvas no MySQL e ficam
**privadas**: cada registro pertence apenas a quem o criou, e todas as
consultas são filtradas pelo usuário do token. Não existe entrega em tempo
real nem troca de mensagens entre contas.

```http
POST /api/mensagens
Authorization: Bearer <token>
Content-Type: application/json

{
  "chat": "usuaria",
  "body": "Estou passando por uma situação difícil."
}
```

O campo `chat` identifica a conversa e aceita `usuaria`, `voluntaria` ou
`admin:<idDaConversa>` (por exemplo, `admin:1`). Mensagens do painel admin
também são privadas do administrador autenticado. O texto é obrigatório e
limitado a 2000 caracteres.

```http
PATCH /api/mensagens/12
Authorization: Bearer <token>
Content-Type: application/json

{
  "body": "Texto corrigido."
}
```

As rotas `PATCH` e `DELETE` só encontram mensagens do próprio token; qualquer
outro registro responde `404`.

### Rede de Apoio

Os cards exibidos em `/apoio` vêm de `GET /api/redes-apoio`, que é pública e
ordena os registros por data de criação. A escrita fica restrita ao papel
`admin` (tela `/admin/redes`):

```http
POST /api/redes-apoio
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Casa da Mulher Brasileira",
  "description": "Espaço público que reúne acolhimento e atendimento.",
  "image": "/redes/acolhimento.svg"
}
```

- `name` é obrigatório e tem no máximo 120 caracteres.
- `description` é obrigatória e tem no máximo 30 palavras (600 caracteres).
- `image` é opcional: aceita uma das artes em `public/redes/*.svg` ou uma
  data URL PNG/JPEG/WebP de até 2 MB. Sem imagem, o frontend usa a arte
  padrão.
- `PATCH` aceita apenas os campos enviados; `DELETE` responde `204`.

O seed cria seis cards iniciais quando a tabela está vazia.

### Rotas protegidas

Envie o token no cabeçalho:

```http
Authorization: Bearer <token>
```

## Modelo de dados

```prisma
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  name        String?
  password    String?
  role        String   @default("usuaria")
  accountType String   @default("usuaria")
  crm         String?
  avatar      String   @default("avatar-1")
  photo       String?  @db.LongText
  nickname    String?
  bio         String?  @db.Text
  city        String?
  phone       String?
  createdAt   DateTime @default(now())
}

model EmergencyCall {
  id        Int      @id @default(autoincrement())
  type      String   @default("ligacao_policial")
  createdAt DateTime @default(now())
}

model ChatMessage {
  id        Int      @id @default(autoincrement())
  userId    Int
  chat      String   @default("usuaria")
  body      String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, chat])
}

model SupportNetwork {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(120)
  description String   @db.VarChar(600)
  image       String?  @db.LongText
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Integração com o frontend

As telas de cadastro, login e contas usam a API:

- `src/pages/Signup.jsx` chama `POST /cadastro`.
- `src/pages/Login.jsx` chama `POST /login`.
- `src/pages/Accounts.jsx` chama `GET /api/users` (somente admin) para exibir
  e pesquisar as contas.
- `src/pages/Perfil.jsx` (Minha área) chama `GET` e `PATCH /api/users/me`.
- `src/pages/PerfilAdmin.jsx` mostra os dados do admin e permite trocar o avatar ou enviar uma foto.
- `src/pages/Home.jsx` e `src/pages/Emergencia.jsx` usam as rotas
  `/api/emergencia/acionamentos` para contabilizar os acionamentos.
- `src/pages/ChatUsuario.jsx`, `ChatVoluntaria.jsx` e `ChatAdmin.jsx` usam
  `/api/mensagens` para salvar, editar e excluir as mensagens privadas de cada
  conversa.
- `src/pages/RedeApoio.jsx` (página pública `/apoio`) e
  `src/pages/AdminRedesApoio.jsx` (`/admin/redes`) usam `/api/redes-apoio`.

As rotas `/cadastro` e `/login` são de compatibilidade com o frontend da
`main` e usam o Prisma por baixo dos panos. Elas retornam os campos
`id`, `nome`, `email`, `tipo`, `accountType`, `crm`, `avatar` e `token`, no
formato esperado pelas telas atuais. O login também devolve `role`, para o
redirecionamento por papel (`admin` → `/admin`).

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

