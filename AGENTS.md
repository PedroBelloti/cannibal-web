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
- **Enquadramento em tela em pé**: o corte segue a proporção do canvas, não a largura. Com
  largura/altura até 1 o canvas mostra só uma faixa vertical do frame, centrada em
  `MOBILE_FOCUS_X` (`src/lib/hero.ts`) no Hero e em `CINE_MOBILE_FOCUS_X`
  (`src/lib/cinematic.ts`) no Cinematic (prop `portraitFocusX`); de 1 a 1,25 o foco caminha até o
  centro; a partir de 1,25 o corte é centralizado. Trocou o vídeo, reposicione.
- **Sequência por scroll**: `src/components/ui/ScrollSequence.tsx` é dono da section
  (`.scroll-animation`), do contêiner sticky, do canvas e do loader; desenha o frame do progresso e
  devolve aos filhos (render prop) os ids dos cards visíveis. A pré-carga fica em
  `useFramePreload.ts`, no mesmo diretório. `Hero.tsx` e `CinematicReveal.tsx` só passam frames,
  foco, pôster, modo de carga, cards e textos, e aplicam os efeitos de texto em
  `onProgress(progress, frameIndex)`, chamado dentro do rAF: escreva no DOM por ref, nunca em
  estado do React. Comportamento:
  - scroll e resize passam pelo mesmo rAF; o resize recalcula progresso, frame, cards e textos;
  - `loading="lazy"` (Cinematic) só baixa quando a seção chega a duas alturas de tela; o padrão
    `"eager"` baixa ao montar (Hero);
  - frame com erro conta como carregado, gera um `console.error` único ao fim da carga com os
    caminhos, e o desenho usa o frame válido anterior;
  - com `prefers-reduced-motion: reduce` baixa e mostra só o `posterFrame` (`POSTER_FRAME` e
    `CINE_POSTER_FRAME` em `src/lib`), cards e textos seguem o progresso e `frameIndex` é o do
    pôster; a troca da preferência vale sem recarregar.

  Pontos sensíveis: a fórmula de progresso e o índice do frame (mudá-los desloca os cards em
  relação aos frames), a altura de `.scroll-animation` em `globals.css` (entra no progresso) e
  `coverRect`/`focusForRatio` (corte). Nada é desenhado nem notificado antes de a carga terminar.
- **Validar**: `npm run lint && npx tsc --noEmit && npm run build`, e depois rolar a página inteira
  no navegador. O build não verifica a animação.
