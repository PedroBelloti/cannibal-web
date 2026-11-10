<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Template de site com vídeo controlado por scroll

- **Texto**: tudo fica em `src/content/site.ts`, tipado por `SiteContent`. Os componentes não têm
  texto fixo; ao adicionar um texto novo, crie o campo lá em vez de escrever no JSX.
- **Preencher para um cliente**: siga `TEMPLATE.md`, que traz cada campo, onde aparece, o limite
  de tamanho e um exemplo.
- **Vídeos**: `public/frames*/` + `src/lib/hero.ts` / `src/lib/cinematic.ts`. Os `show`/`hide`
  dos cards estão sincronizados com esses frames; trocou o vídeo, reposicione-os. Para gerar um
  vídeo novo, use a skill `scroll-video-hero`.
- **Enquadramento no celular (Hero)**: até 768 px o canvas mostra só uma faixa vertical do
  frame, centrada em `MOBILE_FOCUS_X` (`src/lib/hero.ts`). Trocou o vídeo, reposicione. O
  `CinematicReveal.tsx` ainda usa o corte central com zoom de 1,3.
- **Dívida conhecida**: `Hero.tsx` e `CinematicReveal.tsx` duplicam a lógica de canvas, preload e
  scroll (~370 linhas cada). Uma correção sistêmica deve extrair essa lógica para um componente
  só (há um modelo em `~/.claude/skills/scroll-video-hero/assets/ScrollSequence.tsx`).
- **Validar**: `npm run lint && npx tsc --noEmit && npm run build`, e depois rolar a página inteira
  no navegador. O build não verifica a animação.
