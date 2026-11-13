# Relatório — CRUDs, persistência e conexão com o banco

**Projeto:** ELLA (React + Vite + Express + Prisma + MySQL)
**Branch:** `feature/integracao-prisma-mysql`
**Último commit:** `781bcc4 feat: mensagens privadas e CRUD da rede de apoio`
**Data da verificação:** 13/11/2026

---

## 1. Arquitetura e conexão com o banco

```
React (Vite, :5173)
   │  fetch / httpClient
   ▼
API Express (:5000)
   │  Prisma Client + adapter MariaDB
   ▼
MySQL — schema backend_db (:3306)
```

| Item | Onde está | Observação |
| --- | --- | --- |
| API | `backend/src/app.js` | Express 5, CORS aberto, JSON até 8 MB |
| Entrada do backend | `backend/server.js` → `backend/src/server.js` | `npm run server` na raiz ou `npm run dev` em `backend/` |
| Configuração do banco | `backend/src/lib/prisma.js` | `PrismaMariaDb`, pool com `connectionLimit: 5` |
| Variáveis | `backend/.env` (não versionado) | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` |
| CLI do Prisma | `DATABASE_URL` no `.env` | Usada por migrate/studio; duplica os dados de `DB_*` |
| Schema | `backend/prisma/schema.prisma` | MySQL, client gerado em `backend/src/generated/prisma` |
| Migrations | `backend/prisma/migrations/` | 6 migrations, incluindo `20261113011347_mensagens_redes_apoio` |
| Seed | `backend/prisma/seed.js` | Admin idempotente + 6 redes quando a tabela está vazia |
| Cliente HTTP | `src/services/httpClient.js` | `VITE_API_URL` ou `http://127.0.0.1:5000` |

### Estado verificado agora

| Verificação | Resultado |
| --- | --- |
| `GET /api/status` | 200 — API no ar |
| `GET /teste-banco` | `{"conectado":1}` |
| Conexão direta no MySQL (3306) | OK |
| `GET /api/redes-apoio` | 200 — 6 cards |
| `GET /api/emergencia/acionamentos/total` | `{"total":2}` |
| Rotas protegidas sem token | 401 — `Token não informado` |

Contagens atuais no banco:

| Tabela | Registros |
| --- | --- |
| `User` | 4 |
| `ChatMessage` | 0 |
| `SupportNetwork` | 6 |
| `EmergencyCall` | 2 |

> **Ocorrência durante a auditoria:** a API estava no ar, mas o pool do Prisma
> retornava `45028 — pool failed to retrieve a connection`, enquanto a conexão
> direta no MySQL funcionava. Era pool obsoleto após reinício do MySQL. Um
> restart do backend (nodemon) restaurou a conexão. Se voltar a acontecer,
> reinicie o backend antes de suspeitar do banco.

---

## 2. Onde cada dado vive

| Dado | Persistência | Local |
| --- | --- | --- |
| Conta (nome, e-mail, senha, papel, tipo, CRM) | MySQL | `User` |
| Avatar, foto, apelido, bio, cidade, telefone | MySQL | `User` (`photo` em `LONGTEXT`) |
| Mensagens dos chats | MySQL | `ChatMessage` (privadas por `userId`) |
| Cards da Rede de Apoio | MySQL | `SupportNetwork` (`image` em `LONGTEXT`) |
| Acionamentos de emergência | MySQL | `EmergencyCall` |
| Sessão (token + usuário) | **localStorage** | `ella:token`, `usuarioLogado` |
| Preferências (Saída Rápida, mostrar foto) | **localStorage** | `ella:preferencias` |
| CRUD local legado de usuários | **localStorage** | `ella:usuarios` — **código morto**, sem importações |
| Inscrição de voluntária | **Nenhuma** | Só `console.log` e navegação |
| Lista de conversas do admin | **Memória** | Array fixo em `ChatAdmin.jsx` (ids 1–9) |

### Chaves de localStorage

| Chave | Conteúdo | Quem grava/lê |
| --- | --- | --- |
| `ella:token` | JWT retornado por `/cadastro` ou `/login` | `userService`, `Signup`, `Login`, `Header` |
| `usuarioLogado` | Objeto do usuário normalizado (`nome`, `tipo`, `role`…) | `userService`, `Header`, `RotaProtegida`, `Chat`, `DashboardAdmin` |
| `ella:preferencias` | `{ saidaRapida, mostrarFoto }` | `constants/saidaRapida.js`, `Perfil` |
| `ella:usuarios` | Lista de usuários do CRUD antigo | `src/api_crud.js` — **não usado em nenhuma tela** |

O `localStorage` guarda **apenas sessão e preferências**. Os dados de negócio
(contas, mensagens, redes, emergência) estão no MySQL.

---

## 3. CRUDs por módulo

### 3.1 Contas e usuários

**Telas:** `Signup.jsx`, `Login.jsx`, `Accounts.jsx`, `Perfil.jsx`,
`PerfilAdmin.jsx`, `Header.jsx`.

| Operação | Frontend | API | Banco | Cobertura de UI |
| --- | --- | --- | --- | --- |
| Criar | `/cadastro` | `POST /cadastro` e `POST /api/users` | `User` | Completa |
| Ler | Login, lista de contas, minha área | `GET /api/users` (admin), `GET /api/users/me`, `GET /api/users/:id` | `User` | Completa |
| Atualizar | Minha área / Perfil admin | `PATCH /api/users/me`, `PATCH /api/users/:id` (só o próprio) | `User` | Completa |
| Excluir | — | `DELETE /api/users/:id` (só o próprio) | `User` + cascade em `ChatMessage` | **Sem botão na UI** |

- `POST /cadastro` e `POST /login` são rotas de compatibilidade que usam Prisma
  por baixo e devolvem os campos no formato antigo (`nome`, `tipo`, `token`).
- O cadastro público sempre cria `role: "usuaria"`; o `accountType` escolhido
  (usuária, voluntária ou psicóloga) serve para exibição no painel.
- Senhas usam `bcrypt` (custo 10). O login devolve JWT com validade de 1 hora.
- `Signup` e `Login` salvam `usuarioLogado` e `ella:token` manualmente; o
  `userService` faz o mesmo quando usado.
- `RotaProtegida` decide o acesso apenas pelo objeto em `usuarioLogado`. O
  backend revalida o papel no banco a cada requisição autenticada.
- `Accounts.jsx` é **somente leitura**: lista, busca e permite “Adicionar conta”
  (que leva ao cadastro). Não edita nem exclui contas.
- `Header.sair()` limpa `usuarioLogado` e `ella:token`, mas não invalida o JWT
  no servidor (JWT é stateless).

### 3.2 Mensagens dos chats

**Telas:** `ChatUsuario.jsx`, `ChatVoluntaria.jsx`, `ChatAdmin.jsx`
**Serviço/hook:** `src/services/messageService.js`, `src/hooks/useChatMessages.js`
**Componente:** `src/components/SavedChatMessage.jsx`

| Operação | Endpoint | Regra |
| --- | --- | --- |
| Criar | `POST /api/mensagens` | `chat` + `body` (até 2000 caracteres) |
| Ler | `GET /api/mensagens?chat=...` | Sempre filtrado por `userId` do token |
| Atualizar | `PATCH /api/mensagens/:id` | Só encontra mensagens do próprio usuário |
| Excluir | `DELETE /api/mensagens/:id` | Idem; resposta 204 |

- Chaves de conversa: `usuaria`, `voluntaria` e `admin:<idDaConversa>`
  (ex.: `admin:1`).
- **Privacidade:** não há destinatário nem entrega em tempo real. Cada registro
  pertence apenas a quem o criou; tentar acessar mensagem de outra conta
  retorna 404.
- O admin também tem mensagens privadas, separadas por conversa.
- As conversas do painel admin são **mock** (`conversas` e `mensagensIniciais`
  em `ChatAdmin.jsx`). Apenas o que o admin digita é persistido; a lista de
  contatos e as mensagens de exemplo continuam estáticas.
- `ChatUsuario` e `ChatVoluntaria` mantêm as bolhas de exemplo fixas na tela e
  exibem abaixo as mensagens salvas, com editar/excluir.

### 3.3 Rede de Apoio

**Telas:** `RedeApoio.jsx` (pública, `/apoio`), `AdminRedesApoio.jsx`
(`/admin/redes`)
**Serviço:** `src/services/supportNetworkService.js`

| Operação | Endpoint | Autenticação |
| --- | --- | --- |
| Ler | `GET /api/redes-apoio` | Pública |
| Criar | `POST /api/redes-apoio` | Bearer + `admin` |
| Atualizar | `PATCH /api/redes-apoio/:id` | Bearer + `admin` |
| Excluir | `DELETE /api/redes-apoio/:id` | Bearer + `admin` |

- Campos: `name` (até 120), `description` (até 30 palavras / 600 caracteres) e
  `image` opcional.
- Imagem aceita: preset `/redes/*.svg` ou data URL PNG/JPEG/WebP até 2 MB.
  Sem imagem, a página usa `/redes/acolhimento.svg`.
- A API devolve todos os cards; a paginação de **6 por página** é feita no
  frontend.
- Seed cria 6 cards iniciais quando a tabela está vazia.

### 3.4 Emergência (190)

**Telas:** `Home.jsx` (contador) e `Emergencia.jsx` (registro)

| Operação | Endpoint | Autenticação |
| --- | --- | --- |
| Criar acionamento | `POST /api/emergencia/acionamentos` | Pública |
| Ler total | `GET /api/emergencia/acionamentos/total` | Pública |

- Não existe atualização, exclusão nem listagem individual.
- O envio usa `keepalive` para não se perder ao abrir o discador do telefone.
- A Home exibe o total; o dashboard admin atualiza esse total a cada 10 s.

### 3.5 Módulos sem CRUD/persistência

| Tela | Situação |
| --- | --- |
| `Voluntaria.jsx` (`/voluntaria`) | Formulário completo, mas envia os dados apenas para `console.log` e navega para o agradecimento. **Nada é salvo.** |
| `Contato.jsx`, `Sobre.jsx`, `Informacoes.jsx`, `Denuncia.jsx` | Conteúdo estático. |
| `Chat.jsx` | Apenas redireciona conforme o papel do usuário. |
| `ContaUser.jsx` | Componente vazio, não usado nas rotas. |

---

## 4. Matriz geral

| Funcionalidade | Criar | Ler | Atualizar | Excluir | Banco | localStorage |
| --- | --- | --- | --- | --- | --- | --- |
| Contas | ✅ | ✅ | ✅ | ⚠️ só API | `User` | token + usuário |
| Perfil/avatar/foto | — | ✅ | ✅ | — | `User` | preferências |
| Mensagens dos chats | ✅ | ✅ | ✅ | ✅ | `ChatMessage` | — |
| Rede de Apoio | ✅ admin | ✅ público | ✅ admin | ✅ admin | `SupportNetwork` | — |
| Emergência | ✅ | ✅ total | ❌ | ❌ | `EmergencyCall` | — |
| Voluntariado | ❌ | ❌ | ❌ | ❌ | — | — |
| CRUD local antigo | — | — | — | — | — | `ella:usuarios` (morto) |

---

## 5. Pontos de atenção

1. **Código morto de CRUD local** — `src/api_crud.js` implementa um CRUD de
   usuários em `localStorage` (`ella:usuarios`), mas não é importado por
   nenhuma tela. Convém remover para não confundir a documentação.
2. **`GET /api/users/:id` é público** e devolve nome, e-mail, foto, bio, cidade,
   telefone e CRM de qualquer usuário. Em uma plataforma sensível, o ideal é
   restringir a admin ou remover a rota pública.
3. **Exclusão de conta sem UI** — o backend e o `userService` já suportam
   `DELETE /api/users/:id`, mas nenhuma tela oferece o botão. A exclusão remove
   as mensagens em cascata.
4. **Inscrição de voluntária não persiste** — hoje os dados só aparecem no
   console. Se a inscrição for um requisito, falta uma tabela (ex.:
   `VolunteerApplication`) e um endpoint.
5. **Painel de contas é somente leitura** — admin não edita nem exclui contas
   pela interface; só lista e pesquisa.
6. **Conversas do admin são mock** — os ids 1–9 não correspondem a usuários
   reais; as mensagens salvas ficam em `admin:1`…`admin:9`.
7. **Sessão em localStorage** — o JWT fica exposto a XSS e expira em 1 h sem
   refresh. O frontend confia no objeto `usuarioLogado` para liberar rotas; a
   API revalida o papel no banco, então o risco maior é de UI, não de dados.
8. **Preferências não sincronizam** — “Saída Rápida” e “mostrar foto” ficam só
   no navegador; não seguem a conta em outro dispositivo.
9. **CORS aberto** (`cors()` sem origem) e **POST de emergência sem rate limit**
   — aceitável em desenvolvimento, mas deve ser fechado em produção.
10. **Imagens em base64 no MySQL** — `User.photo` e `SupportNetwork.image` são
    `LONGTEXT`; o limite de 2 MB evita abuso, mas aumenta o tamanho das linhas.
11. **Duplicidade de configuração** — `DB_*` (adapter) e `DATABASE_URL` (CLI)
    precisam ser mantidos em sincronia no `.env`.
12. **Pool do Prisma** — após reinício do MySQL, o backend pode ficar com pool
    inválido. Reiniciar o processo resolve.

---

## 6. Como validar rapidamente

```powershell
# API e banco
Invoke-RestMethod http://127.0.0.1:5000/api/status
Invoke-RestMethod http://127.0.0.1:5000/teste-banco
Invoke-RestMethod http://127.0.0.1:5000/api/redes-apoio
Invoke-RestMethod http://127.0.0.1:5000/api/emergencia/acionamentos/total

# Rotas protegidas devem responder 401 sem token
Invoke-WebRequest http://127.0.0.1:5000/api/mensagens?chat=usuaria
Invoke-WebRequest http://127.0.0.1:5000/api/users

# Qualidade
npm.cmd run lint
npm.cmd run build
```

---

## 7. Conclusão

- **No banco:** contas, perfis, mensagens privadas, redes de apoio e
  acionamentos de emergência.
- **No localStorage:** somente sessão (`ella:token`, `usuarioLogado`) e
  preferências (`ella:preferencias`); o antigo `ella:usuarios` é código morto.
- **CRUD completo:** mensagens e redes de apoio (com regras de admin).
- **CRUD parcial:** contas (exclusão só na API) e emergência (apenas criação e
  contagem).
- **Sem persistência:** inscrição de voluntária e lista de conversas do admin.
- A conexão com o MySQL está funcionando; o único incidente foi pool obsoleto,
  corrigido com restart do backend.
