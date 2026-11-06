# ELLA

Frontend React + Vite da plataforma ELLA.

## Backend (API)

A pasta [`backend/`](./backend/README.md) contém a API REST com Express,
Prisma ORM 7 e MySQL (compatível com MySQL Workbench). As telas de
**cadastro**, **login** e **contas** já consomem essa API; o restante do
frontend continua usando os dados mock em `localStorage`.

Consulte [`backend/README.md`](./backend/README.md) para o passo a passo de
configuração do banco, migrations e endpoints.

## Integração com a API

A camada de serviços do frontend está em:

- `src/services/httpClient.js` — cliente HTTP baseado em `fetch`.
- `src/services/userService.js` — cadastro, login, listagem, atualização e exclusão.

A URL da API é lida de `VITE_API_URL` (veja `.env.example`); por padrão,
`http://127.0.0.1:5000`.

- `src/pages/Signup.jsx` — cadastro e login automático.
- `src/pages/Login.jsx` — login.
- `src/pages/Accounts.jsx` — listagem das contas cadastradas.

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
