# Relatório — Checagem de UI/UX de navegação

**Projeto:** ELLA (React + Vite + Express + Prisma)
**Branch:** `feature/integracao-prisma-mysql`
**Data:** 13/11/2026
**Escopo:** cabeçalho, menus, rotas, rodapé, estados ativos, links, botões de voltar e comportamento mobile.

---

## Como foi verificado

- Leitura de `Header`, `Footer`, `MainLayout`, `AdminLayout`, `RotaProtegida` e `App.jsx`.
- Navegação real em todas as rotas públicas, de autenticação e do painel admin.
- Login com a conta admin, teste de logout e de redirecionamento por papel.
- Teste de "← Voltar" com a página aberta diretamente (sem histórico interno).
- Navegação por teclado (Tab) e inspeção de foco.
- Lighthouse na Home: **Acessibilidade 0.91**, Boas práticas 0.83, SEO 0.83.

> Limitação: a ferramenta de navegador usa viewport fixo de **1000×700**. Não foi possível emular larguras mobile (360/390/414). O layout mobile do header/footer foi avaliado só por código.

---

## Inventário de rotas × navegação

| Rota | Página | Header | Footer | Outros acessos |
| --- | --- | --- | --- | --- |
| `/` | Home | ✅ Início | ✅ | CTAs |
| `/sobre` | Sobre | ✅ Sobre | ✅ Sobre nós | — |
| `/informacoes` | Informações | ✅ | ✅ | cards da Home + âncoras |
| `/apoio` | Rede de Apoio | ✅ | ✅ Rede de apoio | cards da Home |
| `/contato` | Contato | ❌ | ✅ | só rodapé |
| `/voluntaria` | Voluntariado | ❌ | ❌ | CTA da Home |
| `/denuncia` | Denúncia | ❌ | ❌ | card da Home |
| `/emergencia` | Emergência | ❌ | ❌ | botão da Home |
| `/login` | Login | ✅ | ❌ | CTAs |
| `/cadastro` | Cadastro | ✅ | ❌ | CTAs |
| `/perfiluser` | Minha área | ✅ "Minha área" | ❌ | — |
| `/chat` | Redirecionador | ❌ | ❌ | card "Chat" da Home |
| `/chatusuario` | Chat usuária | ✅ "Minha área" | ❌ | redireciona de `/chat` |
| `/chatvoluntaria` | Chat voluntária | ✅ "Minha área" | ❌ | redireciona de `/chat` |
| `/admin` | Dashboard | ✅ "Minha área" | ❌ | menu lateral |
| `/admin/chats` | Chats admin | menu lateral | ❌ | menu lateral |
| `/admin/redes` | Redes | menu lateral | ❌ | menu lateral |
| `/admin/perfil` | Perfil admin | avatar do header | ❌ | avatar |
| `/contas` | Contas | ❌ | ❌ | **só por URL** |

---

## Problemas encontrados

### P0 — Segurança e ações críticas

**1. "← Voltar" com `window.history.back()` sai do site**
`Denuncia.jsx`, `ChatUsuario.jsx` (e o mesmo padrão em `ChatVoluntaria.jsx`).
- **Evidência:** abrindo `/denuncia` em aba nova (histórico = 1), clicar em "← Voltar" levou para `about:blank`.
- **Impacto:** uma mulher que chega por link externo/favorito pode cair fora da plataforma justamente ao tentar voltar.
- **Recomendação:** trocar por `<Link to="/">` ou `useNavigate()` com fallback: se `location.key === 'default'`, ir para `/`; senão `navigate(-1)`.

**2. Links mortos `href="#"` em ações de emergência**
- `ChatUsuario.jsx` linha 64: botão "Ligue 180" → `href="#"`.
- `Denuncia.jsx` linha 72: botão "Ligar" (Emergência 190) → `href="#"`.
- **Impacto:** a ação mais crítica (ligar para ajuda) não disca nem navega; apenas salta para o topo.
- **Recomendação:** `href="tel:180"` e `href="tel:190"` (sem `target`), mantendo o estilo.

### P1 — Descoberta e estrutura de navegação

**3. Rotas importantes ausentes da navegação global**
`/voluntaria`, `/denuncia` e `/emergencia` só são alcançáveis por CTAs da Home; `/contato` só pelo rodapé.
- **Impacto:** quem está em outra página não encontra esses canais sem voltar à Home.
- **Recomendação:** no rodapé, adicionar "Voluntariado" e "Contato"; criar um bloco "Ajuda agora" com Emergência e Denúncia (ou incluir no header).

**4. Telefones do rodapé não são clicáveis**
`180` e `190` são texto puro em `Footer.jsx`.
- **Recomendação:** envolver em `<a href="tel:180">` / `tel:190`.

**5. `/contas` está fora do padrão do admin**
A rota é admin-only, mas abre com o **layout público** (header/footer do site) e não aparece no menu lateral; só é acessível digitando a URL.
- **Recomendação:** mover para `/admin/contas`, renderizar dentro de `AdminLayout` e adicionar item no menu — ou remover a rota duplicada.

**6. Header admin tem controles que não fazem nada**
Campo "Buscar usuária, voluntária, evento ou conteúdo...", botão de notificações (com ponto vermelho) e a seta do perfil (`faChevronDown`) não têm ação. A seta parece abrir um menu, mas é só ícone.
- **Impacto:** falsas affordances confundem e dão sensação de produto inacabado.
- **Recomendação:** implementar a busca, ou desabilitar/ocultar até existir; transformar a seta em indicador real de menu ou removê-la.

**7. Usuário logado ainda acessa `/login` e `/cadastro`**
Com sessão de admin ativa, as duas páginas continuam exibindo os formulários.
- **Recomendação:** redirecionar para o destino do papel (`/admin`, `/perfiluser`, `/chatvoluntaria`) quando já houver `usuarioLogado`.

### P2 — Consistência e acessibilidade

**8. Sem skip link ("Pular para o conteúdo")**
O menu vem antes do conteúdo no DOM.
- **Recomendação:** link oculto que aparece no foco, apontando para `<main id="conteudo">`.

**9. Contraste insuficiente (Lighthouse)**
Falhas em: links do header (`text-pink-500` sobre branco), "Login", o botão "Cadastre-se" (`text-white` sobre `bg-pink-400`) e textos do rodapé.
- **Recomendação:** escurecer para `pink-600/700` (ou violeta) e revisar o rodapé.

**10. Alvos de toque pequenos no rodapé**
Lighthouse aponta os links de "Links úteis" abaixo do tamanho mínimo.
- **Recomendação:** aumentar padding/line-height dos links do rodapé.

**11. Foco invisível em alguns campos**
Os inputs de chat usam `outline-none` sem anel de foco; o header admin tem `focus:ring`, mas o padrão não é consistente.
- **Recomendação:** aplicar `focus-visible:ring-2` em todos os interativos. (A navegação por Tab funciona; o outline padrão do navegador aparece nos links.)

**12. Rótulos inconsistentes**
"Rede de Apoio" (header) × "Rede de apoio" (footer) × "Redes de Apoio" (admin); "Sobre" × "Sobre nós".
- **Recomendação:** padronizar os nomes visíveis.

**13. Links sociais genéricos e na mesma aba**
`facebook.com`, `youtube.com`, `instagram.com`, `twitter.com` sem `target`/`rel`.
- **Recomendação:** usar os perfis reais e `target="_blank" rel="noopener noreferrer"`, ou remover.

**14. Sem página 404**
Qualquer rota desconhecida cai silenciosamente em `/`.
- **Recomendação:** página 404 amigável com link para a Home (ou pelo menos manter o redirecionamento com aviso).

**15. `ChatVoluntaria` não tem botão "Voltar"**
Só o logo do header permite sair. `ChatUsuario` tem, mas com o problema do item 1.
- **Recomendação:** adicionar "← Voltar" consistente nas duas telas de chat.

**16. `/admin/perfil` não tem item ativo no menu**
É acessível pelo avatar, mas nenhum item do menu lateral fica marcado.
- **Recomendação:** incluir "Perfil" no menu ou tratar o avatar como seção própria.

### Observações menores

- `Header` admin: o logo aponta para `/` (site público); não há breadcrumb/atalho de volta ao dashboard além do menu.
- H1 da Home usa `<br />` entre "Você não" e "está sozinha." — visualmente ok; o nome acessível tende a sair correto, mas vale revisar com leitor de tela.
- Lighthouse também aponta proporção de imagem do logo e `robots.txt` inválido (fora do escopo de navegação, mas fácil de corrigir).
- Layout mobile do header (grid de 2 linhas) e do rodapé (coluna) parece correto no código, mas **não foi validado em viewport real**.

---

## O que já está bom

- Todas as rotas públicas e protegidas renderizam sem erro.
- `aria-current` funciona no header e no menu admin (item ativo correto).
- Login/logout funcionam: o logout limpa `usuarioLogado` + `ella:token` e volta para `/`.
- `RotaProtegida` bloqueia por papel e redireciona para `/login` (com `state.from`) ou `/`.
- Âncoras internas existem: `#servicos` em `/apoio` e os ids `violencia-*` em `/informacoes`.
- Menu admin marca corretamente Dashboard/Chats/Redes, e os itens "em desenvolvimento" estão com `aria-disabled`.
- Navegação por teclado (Tab) percorre os links na ordem esperada.

---

## Prioridade sugerida

1. **P0:** corrigir `href="#"` de 180/190 e o "← Voltar".
2. **P1:** completar rodapé (telefones `tel:`, Voluntariado, Emergência, Denúncia) e recolocar `/contas` no admin.
3. **P2:** skip link, contraste, foco, rótulos, redirect de login, 404.
4. Validar tudo em viewport mobile real depois dos ajustes.

---

## Correções implementadas (P0 + P1 + P2)

**P0**
- Novo `src/components/VoltarLink.jsx`: usa o histórico quando existe navegação
  interna e cai para `/` quando a página foi aberta diretamente. Aplicado em
  `Denuncia`, `ChatUsuario` e `ChatVoluntaria` (que antes não tinha botão).
- `Denuncia`: botão "Ligar" agora é `tel:190`.
- `ChatUsuario`: botão "Ligue 180" agora é `tel:180`.

**P1**
- Rodapé: "Voluntariado" nos links úteis; "Disque 180" e "190" clicáveis
  (`tel:`); atalhos "Emergência" e "Como denunciar".
- `/contas` movido para `/admin/contas` dentro do `AdminLayout`, com item
  "Contas" no menu lateral; a URL antiga redireciona.
- Header admin: busca e sino marcados como desabilitados ("em breve") e a seta
  falsa de dropdown removida.
- `src/utils/navegacao.js`: destino por papel compartilhado. Usuário logado que
  abre `/login` ou `/cadastro` é redirecionado para sua área.

**P2**
- Skip link "Pular para o conteúdo" em `MainLayout` e `AdminLayout`; todas as
  `<main>` receberam `id="conteudo"` e `tabIndex={-1}` para receber o foco.
- Foco visível global em `src/index.css` (outline rosa em links, botões e
  campos), inclusive nos inputs que usavam `outline-none`.
- Contraste corrigido em header, hero, rodapé, Home, Informações, Sobre,
  Voluntária, Login, Cadastro, Perfil, Dashboard, Contas, Chats e Redes.
- Rodapé: rótulos padronizados ("Sobre", "Rede de Apoio"), links sociais com
  `target="_blank"` + `rel="noopener noreferrer"`, ícones com área de toque de
  36×36 px e itens de texto com no mínimo 24 px de altura.
- `Brand` com `object-contain` (sem distorção da logo).
- Página 404 (`NaoEncontrada`) no lugar do redirect silencioso para `/`.
- `public/robots.txt` criado.
- Acessibilidade do menu admin: item "Perfil" ativo com `aria-current`,
  `aria-label` nos links do menu e remoção de nome acessível divergente no
  atalho de perfil do header.

**Validação:** `npm.cmd run lint` e `npm.cmd run build` passaram; fluxos de
voltar, telefones, menu admin, `/contas` e redirect de login testados no
navegador. Lighthouse (desktop) ficou em 1.0 de acessibilidade, boas práticas e
SEO em Home, Login, Cadastro, Apoio, Informações, Sobre, Voluntária, Contato,
Emergência, Denúncia, Perfil, 404 e telas do admin. P0 + P1 no commit `2085223`
e P2 no commit seguinte, ambos na branch `feature/integracao-prisma-mysql`.

> Pendente apenas a validação em viewport mobile real (o navegador de testes
> usa viewport fixo de 1000×700).

