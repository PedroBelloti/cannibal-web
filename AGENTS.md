<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site do Arthur The Cannibal: duas sequências por scroll e seções de pôster fixo

Direção de design, decisões e desvios em `docs/plan-redesenho-poster-fixo.md`. O redesenho vale
só para este site; o repositório nasceu de um template, mas não é mais tratado como um.

- **Texto**: tudo fica em `src/content/site.ts`, tipado por `SiteContent`. Os componentes não têm
  texto fixo; ao adicionar um texto novo, crie o campo lá em vez de escrever no JSX.
- **Campos de texto**: `TEMPLATE.md` traz cada campo, onde aparece e o limite de tamanho.
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
- **Texto sobre as sequências**: `ui/PinnedTitle.tsx` (título preso em dois cantos) e
  `ui/SequenceQuote.tsx` (frase solta, uma por vez) servem ao Hero e à Trajetória. Texto de apoio,
  frases e link final ocupam o mesmo lugar (`--slot-h` em `globals.css`), um de cada vez. Os marcos
  de entrada e saída ficam em `src/lib/hero.ts` (`HERO_TEXT_FADE_END`) e `src/lib/cinematic.ts`
  (`CINE_INTRO_FADE_END`, `CINE_TITLE_SWAP`, `CINE_OUTRO`) e convivem com os `show`/`hide` das
  frases: mexeu num, confira o outro. Elemento que some por opacidade e tem link ou botão recebe
  `inert` junto. Na Trajetória os dois títulos dividem o lugar: o transparente recebe também
  `visibility: hidden` (`setTitleOpacity`), senão cobre o outro no teste de clique e é lido duas
  vezes pelo leitor de tela. O link final leva `relative z-10` e o texto de apoio
  `pointer-events-none`: elemento com opacidade abaixo de 1 é pintado acima dos vizinhos estáticos
  e, sem isso, o link não recebe o clique na composição larga.
- **Seções abaixo das sequências** (`src/components/sections/`, ordem em `src/app/page.tsx`):
  `FightRecord` (`#cartel`), `Team` (`#equipe`), `NamesBand`, `SponsorCall` (`#patrocinio`) e
  `Footer` (`#contato`). São componentes de servidor; o único com estado é `ui/RecordMarks.tsx`.
  - Cartel: uma marca por luta, em linhas por método (`record.methods[].count`). O botão do método
    (`aria-pressed`) acende as marcas dele e troca a legenda (`aria-live`) por `result`; a legenda
    inicial já vem no HTML e diz os números sem script. A soma dos `count` mais `loss.count` tem de
    bater com `record.score` e com os textos: nada confere isso no código.
  - Fotos: `public/photos/*.webp`, origem e comando de recorte em `media/README.md`. Cada uma é um
    `Photo` em `site.ts`; `credit: null` significa autor não confirmado e a página não mostra
    crédito. Nenhum rosto ou pessoa pode ser alterado: só recorte e redução.
  - Rodapé: item de `contact`/`partners` sem `href` sai como texto. O nome na largura toda usa o
    divisor `9.35` (largura do nome em em); mudou o nome ou a fonte, meça de novo.
  - Vermelho (`--accent`) só no botão principal (`ui/Button.tsx`) e nas marcas acesas do cartel.
- **Entradas e movimento**: classes `.rise`, `.rise-late`, `.drift` e `.names-track` em
  `globals.css`, animações CSS presas ao scroll, sem JavaScript. Só valem com suporte a
  `animation-timeline: view()` e sem `prefers-reduced-motion`; fora disso o conteúdo fica parado e
  visível. Não use `.rise` na última tela: a faixa de animação não se completa sem scroll adiante
  e o texto fica meio transparente.
- **Scroll suave**: `providers/SmoothScrollProvider.tsx` (Lenis). Enquanto anima, o Lenis desfaz
  scroll que não partiu dele; o ouvinte `yieldToNativeJump` entrega a vez a link de âncora, End,
  PageDown e barra de rolagem. Sem ele, um clique no menu logo depois da roda do mouse não leva a
  lugar nenhum. Ao mexer nas opções do Lenis, teste roda seguida de clique num link do menu.
- **Validar**: `npm run lint && npx tsc --noEmit && npm run build`, e depois rolar a página inteira
  no navegador. O build não verifica a animação. A medição de
  design é `node ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs <url>` (0 FAIL; os
  avisos `no-footage` e `pinned-over-picture` são esperados, ver o PLAN).
