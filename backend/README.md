# Backend ELLA (Express + Prisma + MySQL)

API REST criada seguindo a estrutura do projeto `api-completa_JWT`, com
Prisma ORM 7 e MySQL (compatível com MySQL Workbench).

O frontend React continua usando os dados mock em `localStorage`
(`src/api_crud.js`) por enquanto. Nenhuma tela foi alterada.

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── prisma.config.ts
├── src/
│   ├── app.js
│   ├── server.js
│   ├── lib/prisma.js
│   ├── middlewares/auth.js
│   ├── routes/index.js
│   ├── routes/users.js
│   └── utils/
├── .env.example
└── package.json
```

## 1. Criar o banco no MySQL Workbench

1. Abra o MySQL Workbench e conecte-se ao seu servidor local.
2. Crie um schema (banco) chamado `ella_db`:

```sql
CREATE DATABASE ella_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

> Você pode usar outro nome, desde que atualize `DB_NAME` e `DATABASE_URL`
> no arquivo `.env`.

## 2. Configurar as variáveis de ambiente

Copie `.env.example` para `.env` e ajuste usuário, senha e nome do banco:

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` não é versionado e **não** foi criado automaticamente.

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

## 5. Iniciar a API

```powershell
npm run dev
```

A API ficará disponível em `http://localhost:3000` por padrão. A porta pode
ser alterada pela variável `PORT`.

## Endpoints

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| GET | `/` | Status da API | Não |
| GET | `/api/status` | Status da API | Não |
| GET | `/api/users` | Lista os usuários (sem senha) | Não |
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
  "user": { "id": 1, "name": "Maria Silva", "email": "maria@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Rotas protegidas

Envie o token no cabeçalho:

```http
Authorization: Bearer <token>
```

## Modelo de dados

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  password String?
}
```

## Próximo passo (quando for integrar o frontend)

A camada de serviços do frontend já foi criada em `src/services/`:

- `httpClient.js` — cliente `fetch` com suporte a token Bearer.
- `userService.js` — métodos `list`, `getById`, `create`, `login`, `update` e `remove`.

O frontend atualmente usa `src/api_crud.js` com `localStorage`. Para trocar
pelos endpoints reais, basta substituir as chamadas de `getUsers`,
`createUser`, `updateUser` e `deleteUser` pelos métodos do `userService` e
configurar `VITE_API_URL` no `.env` do frontend (veja `.env.example`).

Exemplo de login:

```js
import { userService } from '../services/userService'

const { user, token } = await userService.login({ email, password })
// O token fica salvo em localStorage na chave "ella:token"
```
