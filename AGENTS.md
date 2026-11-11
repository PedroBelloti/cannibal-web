<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site do Arthur The Cannibal: duas sequências por scroll e seções de pôster fixo

Direção de design, decisões e desvios em `docs/plan-redesenho-poster-fixo.md`; cores, tipo, voz e
mensagens da marca em `docs/brand-guidelines.md`. O redesenho vale
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
  - a carga vai por prioridade (`useFramePreload`): primeiro um frame a cada 16 mais o último
    (11 de 169, ~1,3 MB no Hero), que é o que segura o loader; depois a cada 8, 4, 2 e 1. Até
    chegar tudo, o desenho usa o frame carregado mais próximo antes do pedido e o troca quando o
    certo chega (`onLateFrame`). Esperar os 169 dava 14 s de loader em 4G de 9 Mbps;
  - frame com erro conta como carregado, gera um `console.error` único ao fim da carga com os
    caminhos, e o desenho usa o frame válido anterior;
  - com `prefers-reduced-motion: reduce` baixa e mostra só o `posterFrame` (`POSTER_FRAME` e
    `CINE_POSTER_FRAME` em `src/lib`), cards e textos seguem o progresso e `frameIndex` é o do
    pôster; a troca da preferência vale sem recarregar.

  Pontos sensíveis: a fórmula de progresso e o índice do frame (mudá-los desloca os cards em
  relação aos frames), a altura de `.scroll-animation` em `globals.css` (entra no progresso) e
  `coverRect`/`focusForRatio` (corte). Nada é desenhado nem notificado antes de a primeira passada
  da carga chegar.
- **Texto sobre as sequências**: `ui/PinnedTitle.tsx` (título preso em dois cantos) e
  `ui/SequenceQuote.tsx` (frase solta, uma por vez) servem ao Hero e à Mentalidade (`CinematicReveal`, `#mentalidade`; o link se chamava Trajetória). Card sem
  `speaker` e `source` é frase do site e sai sem aspas nem assinatura; fala atribuída ao Arthur só
  com fonte em `docs/perfil-comunicacao.md`. Texto de apoio,
  frases e link final ocupam o mesmo lugar (`--slot-h` em `globals.css`), um de cada vez. Os marcos
  de entrada e saída ficam em `src/lib/hero.ts` (`HERO_TEXT_FADE_END`) e `src/lib/cinematic.ts`
  (`CINE_INTRO_FADE_END`, `CINE_TITLE_SWAP`, `CINE_OUTRO`) e convivem com os `show`/`hide` das
  frases: mexeu num, confira o outro. Elemento que some por opacidade e tem link ou botão recebe
  `inert` junto; o link final da Mentalidade, em letra grande, recebe também `visibility: hidden`.
  Na Mentalidade os dois títulos dividem o lugar: o transparente recebe também
  `visibility: hidden` (`setTitleOpacity`), senão cobre o outro no teste de clique e é lido duas
  vezes pelo leitor de tela. O link final leva `relative z-10` e o texto de apoio
  `pointer-events-none`: elemento com opacidade abaixo de 1 é pintado acima dos vizinhos estáticos
  e, sem isso, o link não recebe o clique na composição larga.
- **Seções abaixo das sequências** (`src/components/sections/`, ordem em `src/app/page.tsx`):
  `FightRecord` (`#cartel`), `Team` (`#equipe`), `NamesBand`, `SponsorCall` (`#patrocinio`) e
  `Footer` (`#contato`). São componentes de servidor; o único com estado é `ui/RecordMarks.tsx`.
  - Cartel: o título é o percentual de vitórias gigante, calculado em `FightRecord.tsx` a partir
    dos `count` (não é texto digitado), com `record.rate` ao lado. Embaixo, uma marca por luta (um
    risco inclinado, a barra do "%"; vazado na derrota; SVG em `RecordMarks.tsx`): os
    métodos com `featured` na linha de destaque, com o número grande, e os outros mais a derrota
    na linha menor. O botão do método (`aria-pressed`) acende as marcas dele e troca a legenda
    (`aria-live`) por `result`; a legenda inicial já vem no HTML e vale sem script. Sem método
    escolhido, as marcas de um método sorteado acendem de tempos em tempos (`ui/useHintCycle.ts`,
    o mesmo aviso do menu do rodapé); só as marcas, porque texto vermelho pequeno não tem
    contraste. Ponteiro, foco ou método escolhido param o sorteio. `rate.note`,
    `legend`, os `result` e `sponsorCall.body` repetem os números à mão: nada confere isso no
    código. Na composição larga o bloco dos métodos fica preso ao pé da tela fixa e por isso usa
    `.rise-entry` em vez de `.rise`. Mensagens e provas: `docs/brand-guidelines.md`.
  - Faixa de nomes (`NamesBand`): duas fileiras em sentidos opostos, a de cima cheia e a de baixo
    em contorno (`.names-outline`), com as bordas esmaecidas por máscara (`.names-fade`). O mouse em cima freia as duas
    em ~0,4 s e a saída as solta do mesmo jeito (`ui/HoverBrake.tsx`, pelo `playbackRate` das
    animações; `animation-play-state` trava de uma vez). Toque não freia. A fileira de baixo é cópia para o olho (`aria-hidden`) e começa na
    metade da lista. O tamanho é só em `vw`, sem teto: a volta mede ~39,5em e precisa ser mais
    larga que a tela, senão aparece o vazio; menos nomes ou nomes mais curtos pedem medir de novo.
    A duração em `.names-track` vale para essa largura. O contorno é traço com preenchimento da
    cor do fundo por cima (`paint-order`): letra vazada mostra os cruzamentos internos da fonte.
  - Fotos: `public/photos/*.webp`, origem e comando de recorte em `media/README.md`. Cada uma é um
    `Photo` em `site.ts`; `credit: null` significa autor não confirmado e a página não mostra
    crédito. Nenhum rosto ou pessoa pode ser alterado: só recorte e redução.
  - Altura na composição larga: Cartel e Chamada são telas cheias presas (`.pin-screen` e
    `.pin-screen-body` em `globals.css`): o conteúdo ocupa a tela menos a barra e fica parado
    enquanto a seção rola `--pin-hold`, senão o primeiro toque da roda já mostra a seção seguinte
    embaixo. O placar do cartel encolhe em tela baixa para caber (terceiro limite do tamanho em
    `FightRecord.tsx`). A foto da Equipe tem a tela menos a barra (`100svh - --nav-h`), com
    `object-position` escolhido para manter as cabeças e o calção; trocou a foto, reposicione. O crédito sobre foto segue o do Hero: texto
    solto no alto à direita, com o véu `bg-scrim` por baixo, sem caixa nem sombra de texto.
  - Rodapé: o menu grande é `ui/HintMenu.tsx`, que de tempos em tempos (`ui/useHintCycle.ts`, só
    com o menu na tela) pinta um link sorteado com
    a cor de destaque para avisar que é clicável; o sorteio só roda com o menu na tela e o
    primeiro link acende logo que ele aparece (`HINT_FIRST_MS`); ponteiro ou foco no menu param o
    sorteio, e com movimento reduzido ele não roda. Item de `contact`/`partners` sem `href` sai como texto. O
    nome na largura toda sai de `hero.title` (`top` na cor do texto, `bottom` em vermelho) e usa
    o divisor `9.35` (largura do nome em em); mudou o nome ou a fonte, meça de novo.
  - Botão (`ui/Button.tsx`): placa vermelha com a ponta cortada na inclinação das marcas do
    cartel e uma seta; ponteiro ou foco fazem um tom mais escuro varrer a placa. O corte fica num
    `span` interno, porque `clip-path` no link cortaria o contorno de foco. Endereço `http` abre
    em outra aba. Caminho do patrocínio: os botões da barra e do Hero levam a `#patrocinio`, e o
    botão de lá abre o WhatsApp (`WHATSAPP_URL` em `site.ts`); não repita "Seja patrocinador"
    na chamada. Ao lado dele, o do Instagram usa `tone="quiet"` (placa `--surface`): só uma ação
    vermelha por bloco. Os dois levam o símbolo da rede em `icon`, de `ui/BrandGlyph.tsx`
    (desenhos do Simple Icons, CC0, na cor do texto; a cor da marca não entra). A 1366 px os dois
    não cabem lado a lado e empilham.
  - Vermelho (`--accent`) marca o que leva a algum lugar ou responde ao toque: o botão principal
    (`ui/Button.tsx`), as marcas acesas do cartel, a palavra de destino do link final da
    Mentalidade (`cinematic.outro.highlight`) e o link apontado ou sorteado do menu do rodapé.
    A única exceção é o apelido no nome do rodapé, em vermelho como assinatura. Fora disso, não.
- **Entradas e movimento**: classes `.rise`, `.rise-late`, `.rise-entry`, `.drift` e `.names-track` em
  `globals.css`, animações CSS presas ao scroll, sem JavaScript. Só valem com suporte a
  `animation-timeline: view()` e sem `prefers-reduced-motion`; fora disso o conteúdo fica parado e
  visível. Não use `.rise` na última tela nem no pé de uma tela fixa (`.pin-screen`): a faixa de
  animação não se completa e o texto fica meio transparente; no pé de tela fixa use `.rise-entry`,
  que termina quando o bloco entra inteiro.
- **Aviso de scroll**: `ui/ScrollCue.tsx`, só na pilha em pé (`wide:hidden`): a mão do gesto de
  arrastar (Material Symbols, Apache 2.0) na borda direita, abaixo do meio (o pé da tela do Hero
  é do botão), que aparece depois de 2,5 s sem scroll (`IDLE_MS`), sobe e some em laço (`.scroll-cue` em
  `globals.css`) e some no primeiro movimento; não aparece na última meia tela da página. É
  enfeite, sem toque, e por isso branca, não vermelha, sobre um disco escuro a 35% (o quadrado a
  70% pesava demais sobre a foto).
- **Barra de navegação**: `ui/Navbar.tsx` fica transparente só enquanto uma sequência passa pela
  base da barra; medir pelo meio deixava uma tira da sequência atrás dela quando um link do menu
  encostava a seção seguinte na barra.
- **Scroll suave**: `providers/SmoothScrollProvider.tsx` (Lenis). Link de âncora da mesma página
  não salta: `providers/anchorScroll.ts` cancela o salto nativo e leva ao destino pelo Lenis, de
  0,9 s a 1,8 s conforme a distância, com curva que sai e chega devagar; grava o `#` no endereço,
  passa o foco à seção (`tabindex="-1"`) e, com movimento reduzido, salta na hora. O destino
  respeita o `scroll-mt-*` da seção (a altura da barra). Clique com Ctrl/Cmd/Shift ou link com
  `target` seguem nativos. O nome na barra aponta para `#inicio` (o Hero) pelo mesmo caminho: um
  `<Link href="/">` do Next trata o clique antes e não anda. Enquanto anima, o Lenis desfaz scroll que não partiu dele; o ouvinte
  `yieldToNativeJump` entrega a vez a End, PageDown, barra de rolagem e ao voltar do navegador.
  Ao mexer nas opções do Lenis, teste roda seguida de clique num link do menu.
- **Recarga volta ao topo**: o script `RELOAD_TO_TOP` no `<head>` de `src/app/layout.tsx` desliga
  a restauração de scroll do navegador e, em recarga, tira o `#` do endereço antes de o corpo
  existir. Precisa ser `<script>` inline: o `<Script beforeInteractive>` do Next não bloqueia e
  pode rodar depois do salto para o `#`. Link aberto direto com `#` (sem ser recarga) segue indo
  à seção. Efeito colateral: voltar de outro site também abre no topo.
- **Cabeçalhos de segurança**: `next.config.ts` desliga o `X-Powered-By` e manda CSP,
  `X-Frame-Options`, `nosniff`, `Referrer-Policy` e `Permissions-Policy` em todas as rotas. A CSP só
  aceita o próprio domínio: recurso de fora (fonte, script, imagem, embed) exige incluir o domínio
  na diretiva certa, senão o navegador bloqueia em silêncio. `script-src 'unsafe-inline'` é
  concessão aceita (scripts inline do Next e `RELOAD_TO_TOP`; nonce tiraria a página do cache).
  O HSTS vem da Vercel. Auditoria de 2026-11-11, skill `security-compendium-vpio`.
- **Validar**: `npm run lint && npx tsc --noEmit && npm run build`, e depois rolar a página inteira
  no navegador. O build não verifica a animação. A medição de
  design é `node ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs <url>` (0 FAIL; os
  avisos `no-footage` e `pinned-over-picture` são esperados, ver o PLAN).
