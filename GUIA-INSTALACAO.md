# Guia de instalação do projeto ELLA

Este guia é para quem **puxou o projeto em outra máquina** e já tem o MySQL
instalado (e talvez o banco de dados criado), mas **não tem as configurações
(`.env`) nem os módulos (`node_modules`)**. Ele explica o que instalar, o que
configurar e em que ordem rodar os comandos.

> ⚠️ Os arquivos `.env`, as pastas `node_modules`, `dist` e o cliente gerado
> pelo Prisma (`backend/src/generated/prisma`) **não são versionados**. Por
> isso um clone novo nunca "vem pronto": é preciso recriar tudo localmente.

---

## 0. Resumo rápido (para quem já conhece o projeto)

```powershell
# 1) Na raiz do projeto: módulos do frontend
npm install --legacy-peer-deps

# 2) Módulos do backend (tem package.json próprio)
cd backend
npm install
cd ..

# 3) Arquivos de ambiente (não versionados)
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
# edite backend/.env com usuário, senha, banco, JWT_SECRET e ADMIN_PASSWORD

# 4) Banco: aplicar migrations, gerar o Prisma Client e criar o admin
cd backend
npm run db:setup
cd ..

# 5) Rodar (dois terminais)
npm run server   # API em http://127.0.0.1:5000
npm run dev      # site em http://localhost:5173
```

Se o banco já estiver com as tabelas do Prisma e você **não quer mexer nos
dados**, pule o `db:setup` e rode apenas `npm run prisma:generate` dentro de
`backend/` (veja a seção 5).

---

## 1. Pré-requisitos

| Ferramenta | Versão recomendada | Como conferir |
| --- | --- | --- |
| Node.js | 20.19+ ou 22.12+ (Vite 8 / Prisma 7) | `node -v` |
| npm | vem com o Node | `npm -v` |
| MySQL | 8.x em execução | `mysql --version` |
| Git | qualquer versão recente | `git --version` |

O MySQL pode estar no serviço do Windows, no XAMPP, no Laragon ou em um
servidor remoto — o importante é que o backend consiga conectar nele.

> **No Windows**, se aparecer o erro `npm.ps1 não pode ser carregado porque a
> execução de scripts foi desabilitada`, rode os comandos pelo `cmd`:
> `cmd /c "npm install"` ou ajuste a política com
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---

## 2. Baixar / atualizar o projeto

Primeira vez na máquina:

```powershell
git clone https://github.com/Guilherme-K/ella.git
cd ella
```

Se o projeto já existe e você só quer atualizar:

```powershell
cd ella
git pull origin feature/integracao-prisma-mysql
```

> A branch de desenvolvimento no momento é `feature/integracao-prisma-mysql`.
> Se houver conflitos, resolva antes de continuar.

---

## 3. Instalar os módulos

O projeto tem **dois `package.json`**: um na raiz (frontend React/Vite) e
outro em `backend/` (API Express/Prisma). É preciso instalar os dois.

### 3.1 Frontend (raiz)

```powershell
npm install --legacy-peer-deps
```

O `--legacy-peer-deps` é necessário porque o pacote `react-vlibras-plugin`
declara suporte só até React 18, enquanto o projeto usa React 19. Sem essa
flag o npm aborta com `ERESOLVE conflicting peer dependency`.

### 3.2 Backend

```powershell
cd backend
npm install
cd ..
```

Aqui entram `express`, `@prisma/client`, `prisma`, `bcryptjs`, `jsonwebtoken`
etc. **Sem isso**, ao subir a API aparece `Cannot find package 'express'`.

> Alternativa, se existir `package-lock.json` atualizado: `npm ci` (raiz) e
> `npm ci` dentro de `backend/`.

---

## 4. Criar os arquivos de ambiente (`.env`)

São **dois** arquivos, ambos ignorados pelo Git:

### 4.1 Frontend — `.env` na raiz

```powershell
Copy-Item .env.example .env
```

Conteúdo esperado:

```env
VITE_API_URL=http://127.0.0.1:5000
```

Essa URL precisa ser **igual** à porta em que o backend roda. Se mudar a
porta da API, mude aqui também e reinicie o Vite.

### 4.2 Backend — `backend/.env`

```powershell
Copy-Item backend/.env.example backend/.env
```

Edite o arquivo e preencha:

```env
PORT=5000
NODE_ENV=development

# Conexão bruta usada pelo driver adapter (src/lib/prisma.js)
DB_USER=root
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=3306
DB_NAME=backend_db

# Conexão usada pelo Prisma CLI (migrations / studio)
DATABASE_URL="mysql://root:sua_senha@localhost:3306/backend_db"

# JWT
JWT_SECRET="troque-por-uma-chave-segura-e-longa"
JWT_EXPIRES_IN=1h

# Conta administrativa criada pelo seed
ADMIN_EMAIL=elladmin@email.com
ADMIN_NAME=Admin ELLA
ADMIN_PASSWORD=escolha-uma-senha-forte
```

Pontos de atenção:

- **`DB_*` e `DATABASE_URL` precisam apontar para o mesmo banco.** O backend
  usa `DB_*`; o Prisma CLI usa `DATABASE_URL`.
- Se o usuário `root` **não tiver senha**, deixe `DB_PASSWORD=` vazio e use
  `mysql://root@localhost:3306/backend_db` (sem `:senha`).
- **Caracteres especiais na senha devem ser codificados apenas na
  `DATABASE_URL`**: `@` → `%40`, `#` → `%23`, `:` → `%3A`, `/` → `%2F`.
  Em `DB_PASSWORD` a senha vai normal.
- `ADMIN_PASSWORD` é **obrigatória no primeiro seed**. Se o admin ainda não
  existir e ela estiver vazia, o seed falha com
  `Defina ADMIN_PASSWORD no arquivo .env para criar a conta administrativa`.
- Para gerar um `JWT_SECRET` forte:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

---

## 5. Preparar o banco de dados

O cenário aqui é: **a máquina já tem MySQL e o banco pode já existir**. O que
fazer depende do estado desse banco.

### 5.1 Conferir se o banco existe

No MySQL Workbench, ou no terminal:

```powershell
mysql -u root -p -e "SHOW DATABASES LIKE 'backend_db';"
```

- Apareceu `backend_db`? Siga para 5.3.
- Não apareceu? Crie com o script do projeto:
  ```powershell
  cmd /c "mysql -u root -p < backend/database/create-database.sql"
  ```
  (ou execute o conteúdo de `backend/database/create-database.sql` no
  Workbench). Se usar outro nome, ajuste `DB_NAME` e `DATABASE_URL`.

### 5.2 Entender as tabelas do projeto

As migrations do Prisma criam as tabelas:

- `User`
- `ChatMessage`
- `EmergencyCall`
- `SupportNetwork`

> ⚠️ Se o banco existente foi criado pela **versão antiga (mysql2)** do
> backend, ele tem tabelas com outros nomes (`usuarios`, `conversas`,
> `mensagens`...). As migrations do Prisma **não convertem** esses dados
> automaticamente: elas criam as tabelas novas no mesmo schema. Se você
> precisa dos dados antigos, a migração tem de ser feita manualmente.

### 5.3 Aplicar as migrations (sem apagar dados)

Sempre que possível use **`deploy`**, que apenas aplica o que falta e **não
reseta** o banco:

```powershell
cd backend
npx prisma migrate status    # mostra o que já foi aplicado e o que falta
npm run prisma:migrate:deploy
cd ..
```

Regras importantes:

- **Nunca** rode `prisma migrate reset` se quiser manter os dados — ele apaga
  o banco.
- **Não use `prisma migrate dev` em banco compartilhado/produção**: ele pode
  pedir para resetar em caso de divergência.
- Se aparecer **`P3005 – database schema is not empty`** ou erro de *drift*
  porque o banco foi criado manualmente, há duas saídas:
  1. criar um schema limpo (ex.: `backend_db_dev`) e rodar o `deploy` nele; ou
  2. marcar as migrations já existentes como aplicadas (baseline):
     ```powershell
     cd backend
     npx prisma migrate resolve --applied 20261105000000_inicial
     # repita para cada migration já refletida no banco
     npm run prisma:migrate:deploy
     ```
  Só faça baseline se tiver certeza de que as tabelas já correspondem às
  migrations.

---

## 6. Gerar o Prisma Client

O cliente do Prisma é **gerado**, não vem no Git (a pasta
`backend/src/generated/prisma` está no `.gitignore`). Sem ele, a API quebra
com `Cannot find module '../generated/prisma/index.js'`.

```powershell
cd backend
npm run prisma:generate
cd ..
```

Esse passo precisa ser repetido sempre que:

- você clona o projeto;
- o `schema.prisma` muda;
- você troca de branch que alterou o schema.

---

## 7. Criar a conta admin e os dados iniciais (seed)

```powershell
cd backend
npm run prisma:seed
cd ..
```

O seed é **idempotente** (pode rodar várias vezes):

- cria/garante a conta admin com `role = admin`
  - e-mail padrão: `elladmin@email.com` (ou `ADMIN_EMAIL`)
  - senha: valor de `ADMIN_PASSWORD` no `backend/.env`
- cria 6 cards iniciais da Rede de Apoio **se** a tabela estiver vazia.

Se a conta admin já existir, o seed **não troca a senha**; apenas garante o
papel `admin`.

### Atalho: gerar + migrar + semear de uma vez

```powershell
cd backend
npm run db:setup
cd ..
```

`db:setup` = `prisma generate` + `prisma migrate deploy` + `prisma seed`.

---

## 8. Rodar o projeto

Use **dois terminais**.

### Terminal 1 — API (backend)

Na raiz do projeto:

```powershell
npm run server
```

- O script `preserver` roda automaticamente
  `npm --prefix backend run db:setup` (gera o client, aplica migrations e
  cria o admin) antes de iniciar.
- API disponível em **http://127.0.0.1:5000**.
- Alternativa: `cd backend` e `npm run dev` (nodemon).

> A primeira execução pode demorar: o `db:setup` roda generate + migrate +
> seed. Se algo falhar, a API não sobe — leia a mensagem e veja a seção 10.

### Terminal 2 — Frontend (Vite)

Na raiz do projeto:

```powershell
npm run dev
```

- Site disponível em **http://localhost:5173** (a porta aparece no terminal).
- O frontend conversa com a API definida em `VITE_API_URL` (`.env` da raiz).

### Outros comandos úteis

```powershell
npm run build     # build de produção do frontend (gera dist/)
npm run preview   # serve o build localmente
npm run lint      # análise de estilo/código
```

---

## 9. Conferir se está tudo funcionando

1. API responde:
   - http://127.0.0.1:5000/api/status
   - http://127.0.0.1:5000/teste-banco (deve retornar `{ "conectado": 1 }`)
2. Frontend abre em http://localhost:5173.
3. Login com a conta admin (`ADMIN_EMAIL` + `ADMIN_PASSWORD`) entra em `/admin`.
4. Cadastro de uma conta nova funciona e aparece em `/admin/contas`.
5. A página `/apoio` lista os cards criados pelo seed.

Checklist rápido:

- [ ] `npm install --legacy-peer-deps` na raiz
- [ ] `npm install` dentro de `backend/`
- [ ] `.env` na raiz com `VITE_API_URL`
- [ ] `backend/.env` com `DB_*`, `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`
- [ ] banco `backend_db` criado / correto
- [ ] `prisma migrate deploy` sem erros
- [ ] `prisma generate` executado
- [ ] `prisma seed` executado (admin criado)
- [ ] API em `http://127.0.0.1:5000`
- [ ] frontend em `http://localhost:5173`

---

## 10. Erros comuns e como resolver

| Erro | Causa | Solução |
| --- | --- | --- |
| `Cannot find package '@dicebear/core'` / `failed to resolve import` | módulos do frontend ausentes | `npm install --legacy-peer-deps` na raiz |
| `Cannot find package 'express'` (no backend) | módulos do backend ausentes | `npm install` dentro de `backend/` |
| `ERESOLVE conflicting peer dependency` (React 18 x 19) | peer do `react-vlibras-plugin` | repetir com `--legacy-peer-deps` |
| `Cannot find module '../generated/prisma/index.js'` | Prisma Client não gerado | `cd backend` e `npm run prisma:generate` |
| `P1001: Can't reach database server` | MySQL parado ou host/porta errados | iniciar o serviço MySQL, conferir `DB_HOST`/`DB_PORT` |
| `P1000: Authentication failed` | usuário/senha errados | conferir `DB_USER`/`DB_PASSWORD`; senha com `@`, `#`, `:` precisa de URL-encode na `DATABASE_URL` |
| `P1003: Database does not exist` | nome do banco errado ou não criado | criar `backend_db` ou corrigir `DB_NAME`/`DATABASE_URL` |
| `P3005: database schema is not empty` | banco manual/legado | usar schema limpo ou fazer baseline (seção 5.3) |
| `Defina ADMIN_PASSWORD no arquivo .env...` | seed sem senha do admin | preencher `ADMIN_PASSWORD` e rodar o seed de novo |
| `EADDRINUSE` / porta 5000 ocupada | outra API rodando | encerrar o processo ou trocar `PORT` **e** `VITE_API_URL` |
| Frontend chama a API errada / erro de CORS | `VITE_API_URL` ausente ou errada | ajustar o `.env` da raiz e reiniciar o `npm run dev` |
| `401 Token inválido ou expirado` | token expirado (`JWT_EXPIRES_IN`) | fazer login novamente |
| `npm.ps1 cannot be loaded` no Windows | política de execução do PowerShell | usar `cmd /c "npm ..."` ou `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Erro estranho do Prisma após trocar de branch | client/node_modules desatualizados | `cd backend`, apagar `node_modules`, `npm install`, `npm run prisma:generate` |

---

## 11. O que nunca deve ser versionado

Já está no `.gitignore`, mas fica o lembrete:

- `.env` e `backend/.env` (contêm senhas e segredos)
- `node_modules/` (raiz e `backend/`)
- `dist/` (build do frontend)
- `backend/src/generated/prisma` (cliente gerado)

Se você precisa compartilhar configuração, compartilhe os arquivos
`.env.example` — nunca os `.env` reais.
