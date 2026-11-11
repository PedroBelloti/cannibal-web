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
- **Enquadramento no celular**: até 768 px o canvas mostra só uma faixa vertical do frame,
  centrada em `MOBILE_FOCUS_X` (`src/lib/hero.ts`) no Hero e em `CINE_MOBILE_FOCUS_X`
  (`src/lib/cinematic.ts`) no Cinematic. Trocou o vídeo, reposicione.
- **Sequência por scroll**: `src/components/ui/ScrollSequence.tsx` é dono da section
  (`.scroll-animation`), do contêiner sticky, do canvas e do loader; pré-carrega os frames, desenha
  o frame do progresso e devolve aos filhos (render prop) os ids dos cards visíveis. `Hero.tsx` e
  `CinematicReveal.tsx` só passam frames, foco do celular, cards e textos, e aplicam os efeitos de
  texto em `onProgress(progress, frameIndex)`, chamado dentro do rAF: escreva no DOM por ref,
  nunca em estado do React. Pontos sensíveis: a fórmula de progresso e o índice do frame
  (mudá-los desloca os cards em relação aos frames), a altura de `.scroll-animation` em
  `globals.css` (entra no progresso) e `coverRect` (corte com foco do celular). Nada roda antes de
  todos os frames carregarem; frame com erro conta como carregado. Pendente (issue #4, parte B):
  progresso no resize, corte por proporção da tela, carga adiada, aviso de frame com erro e
  `prefers-reduced-motion`, todos dentro do componente, sem mudar os consumidores.
- **Validar**: `npm run lint && npx tsc --noEmit && npm run build`, e depois rolar a página inteira
  no navegador. O build não verifica a animação.
