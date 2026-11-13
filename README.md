# ELLA

Frontend React + Vite da plataforma ELLA.

## Backend (API)

A pasta [`backend/`](./backend/README.md) contém a API REST com Express,
Prisma ORM 7 e MySQL (compatível com MySQL Workbench). As telas de
**cadastro**, **login**, **contas** e **Minha área** consomem essa API.

Consulte [`backend/README.md`](./backend/README.md) para o passo a passo de
configuração do banco, migrations e endpoints.

## Integração com a API

A camada de serviços do frontend está em:

- `src/services/httpClient.js` — cliente HTTP baseado em `fetch`.
- `src/services/userService.js` — cadastro, login, listagem, atualização e exclusão.

A URL da API é lida de `VITE_API_URL` (veja `.env.example`); por padrão,
`http://127.0.0.1:5000`.

- `src/pages/Signup.jsx` — cadastro (`POST /cadastro`).
- `src/pages/Login.jsx` — login (`POST /login`).
- `src/pages/Accounts.jsx` — listagem e pesquisa das contas cadastradas
  (`GET /api/users`, visível apenas para o admin).
- `src/pages/Perfil.jsx` — Minha área (`GET`/`PATCH /api/users/me`).
- `src/pages/PerfilAdmin.jsx` — perfil do admin (`GET`/`PATCH /api/users/me`).
- `src/pages/DashboardAdmin.jsx` — dashboard do admin com dados reais de
  `GET /api/users` (totais, tipos de conta, evolução das contas,
  preenchimento dos perfis, indicador de emergência e exportação CSV).
- `src/pages/Home.jsx` e `src/pages/Emergencia.jsx` — contador e registro dos
  acionamentos do botão de emergência (`/api/emergencia/acionamentos`).

As rotas `/cadastro` e `/login` são compatíveis com o frontend atual e usam
o backend Prisma/MySQL.

## Papéis, tipos de conta e avatar

Os papéis (`role`) são `usuaria`, `voluntaria`, `psicologa` e `admin`. O
cadastro público cria sempre o papel `usuaria`.

O formulário de cadastro também permite escolher o **tipo de conta**
(`accountType`): `usuaria`, `voluntaria` ou `psicologa`. O papel continua
sendo `usuaria` para todos os três; o tipo serve para a administração
diferenciar voluntárias e psicólogas no painel e no CSV. Psicólogas podem
informar um **CRM**, que é apenas exibido (não há validação de formato).

A conta administrativa é criada pelo seed:

- **E-mail:** `elladmin@email.com`
- **Senha:** `12345678`
- Acesso em `/admin`

A rota `/contas` e a listagem `GET /api/users` são restritas ao admin. A logo
do site (inclusive no painel administrativo) leva para a página inicial `/`.

Os avatares pré-setados (`avatar-1` … `avatar-8`) são escolhidos em
**Minha área** e no perfil do admin; o identificador escolhido fica salvo
no banco. As imagens são geradas com **DiceBear** (`@dicebear/core` +
`@dicebear/styles`) e definidas em `src/data/avatars.js`. Os oito presets
usam apenas a linha de arte do Lorelei (Lisa Wischofsky): `lorelei`,
`lorelei-neutral`, `adventurer` e `adventurer-neutral`.

Também é possível enviar uma **foto de perfil** em Minha área ou no perfil
do admin. A imagem (PNG, JPEG ou WebP, até 2 MB) é convertida em data URL e
salva no banco no campo `photo`; enquanto existir, ela substitui o avatar
pré-setado. Escolher um preset ou usar **Remover foto** volta a exibir o
avatar escolhido.

Para iniciar a API a partir da raiz do projeto:

```powershell
npm run server
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
