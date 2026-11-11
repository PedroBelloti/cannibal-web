# PLAN: redesenho do site do Arthur na direção "pôster fixo"

**Status:** aprovado em 2026-11-11; fases 1 a 6 implementadas e medidas no Chromium, sem commit;
falta celular real e as respostas que bloqueiam publicar ·
**Criado em:** 2026-11-11 · **Issue:** #6

Origem: `auditoria-design.md` (nota 5,5; 51 FAIL no lint da skill) e as decisões do Pedro em
2026-11-11: direção "pôster fixo" aprovada, vale só para o site do Arthur, a coisa viva é o cartel
que toca, e as fotos do roteiro em `~/Downloads` podem ser lidas para uso em alta qualidade.

## Resumo

**Objetivo.** Trocar a aparência de painel de ficção científica (cantos de HUD, contador `SEQ`,
etiquetas em maiúsculas pequenas, cartões de vidro, fonte monoespaçada) por um desenho que só
serve ao Arthur: o nome dele preso em dois cantos da tela enquanto as fotos passam por trás.

**Por quê.** Os enfeites atuais vêm do template e são os mesmos de qualquer site gerado por IA.
O que é só do Arthur (o codinome do quartel, o cartel, as fotos de luta, o protetor bucal com
"CANNIBAL" escrito) quase não aparece.

**O que não muda.** O motor das sequências: `ScrollSequence.tsx`, `useFramePreload.ts`, os 338
frames, a fórmula de progresso, o índice do frame, as alturas de `.scroll-animation`, os
`show`/`hide` dos cards, `coverRect`/`focusForRatio`, e a regra de que todo texto vem de
`src/content/site.ts`.

**Tamanho.** Feature grande: mexe em todas as seções, no contrato `SiteContent` e em
`globals.css`. Seis fases, com uma parada para o Pedro ver o Hero antes do resto.

## A ideia

"Nesta página, o codinome que o quartel deu a ele vira o título fixo: 'Arthur' preso num canto,
'The Cannibal' no canto oposto, e as fotos passam entre os dois."

O Hero (luz vermelha, sangue) é o lado do codinome. O Cinematic (treino, família) é o lado do
primeiro nome, com o mesmo recurso: "Forjado / no ringue" troca para "Movido / pela família".

## Posição do título: testada antes do PLAN

O risco anotado na auditoria ("o nome grande pode cobrir o atleta") foi medido num mock estático
sobre os frames reais, em 1440×900 e 390×844. Folhas em `.taste-skill/mock/` (pasta sem rastreio
no git).

| Variante | Resultado (VISTO nas capturas) | Decisão |
| --- | --- | --- |
| Hero, "The Cannibal" numa linha de 12,5vw no canto inferior direito | cobre boca e queixo do frame 34 ao 165 | descartada (`1-hero-diagonal-uma-linha.jpg`) |
| Hero, "The / Cannibal" em duas linhas de 9,5vw no canto inferior esquerdo | cobre queixo e boca nos frames 118 e 165, quando a câmera aproxima | descartada |
| Hero, "The / Cannibal" em duas linhas de 9,5vw encostado no canto inferior direito | fica sobre pescoço e ombro; olhos, nariz e boca livres nos 4 frames testados | **adotada** (`2-hero-duas-linhas.jpg`, linha de cima) |
| Cinematic, segunda palavra no canto inferior direito | cruza o antebraço e a luva | descartada |
| Cinematic, segunda palavra em duas linhas no canto inferior esquerdo | atleta inteiro livre; o título ocupa a parede vazia | **adotada** (`3-cinematic.jpg`, duas da esquerda) |
| Celular, segunda palavra numa linha de 15vw logo acima do texto de apoio | Hero: sobre o queixo, boca visível; Cinematic: sobre o calção | **adotada** (`4-celular.jpg`) |

Consequência: o Hero fica na diagonal (canto superior esquerdo → inferior direito) e o
Cinematic numa coluna à esquerda (superior → inferior), com o atleta à direita. As duas
sequências deixam de ter o mesmo desenho.

Fonte Schibsted Grotesk 400/600/800 MEDIDA carregada no mock, com acentos ("família",
"gíria"). Foram testados 4 frames do Hero e 2 do Cinematic, não os 169.

## Decisões e motivos

| Decisão | Motivo | Alternativa descartada |
| --- | --- | --- |
| Uma família de fonte, Schibsted Grotesk, por `next/font/google` | sorteada pela skill para a direção; já está no catálogo do Next instalado, sem dependência nova | manter Geist + Geist Mono: a monoespaçada fora de código é um dos sinais medidos |
| Cores da marca mantidas (`#0a0a0b`, tinta clara, `#d72631`) | já são do Arthur; o vermelho passa a aparecer só no botão principal e nas lutas acesas do cartel | paleta nova: sem motivo, a atual não é o problema |
| Título no mesmo tamanho nos dois cantos, tinta sólida, sem palavra colorida | palavra de destaque em cor é sinal medido; tamanho único deixa o título ser uma peça só | `mix-blend-mode: difference`: gera cores aleatórias sobre foto vermelha |
| Frases dos cards viram texto solto, uma por vez, no canto calmo da foto | cartão de vidro com borda é sinal medido; hoje o cartão cobre o rosto (achado F1 do PLAN anterior) | manter os cartões e só tirar o vidro |
| Um componente de título fixo, um de frase e um de botão, usados pelas duas sequências | hoje o bloco de card existe 4 vezes (2 no Hero, 2 no Cinematic) | repetir a marcação nova nas duas seções |
| Botão único: retangular, vermelho sólido; ação secundária é link de texto | uma forma de botão na página inteira | pílula de vidro atual |
| Cartel com 9 marcas e 3 filtros (`<button aria-pressed>`), agrupadas por método | só o total por método é conhecido; não dá para sugerir ordem cronológica | linha do tempo das lutas: não há dado por luta |
| A derrota aparece só como "1 derrota" | a narrativa de pausa e retorno saiu do site a pedido (HANDOFF, 10/11/2026) | citar a interrupção médica |
| Fotos novas: só recorte e redução para WebP | regra do cliente: nenhum rosto ou pessoa pode ser alterado | outpaint ou retoque: já inventou gente antes e foi descartado (`media/README.md`) |
| `Lenis`, `framer-motion` e `@phosphor-icons/react` ficam | não são a causa dos achados; `AnimatedSection` é reaproveitado para as entradas | trocar bibliotecas |

## Página, seção por seção

| # | Seção | Desenho | Foto |
| --- | --- | --- | --- |
| 1 | Hero (sequência A) | "Arthur" no canto superior esquerdo, "The / Cannibal" no inferior direito; texto de apoio e botão embaixo à esquerda; frases no mesmo lugar do texto de apoio | frames atuais |
| 2 | Trajetória (sequência B), `#trajetoria` | coluna à esquerda: palavra em cima, frase no meio, palavra embaixo; atleta livre à direita | frames atuais |
| 3 | Cartel, `#cartel` | frase curta em cima, "8–1" gigante embaixo à esquerda, as 9 marcas e os filtros no vão entre os dois | IMG_0438 (guarda no cage), metade direita; o fundo preto se funde com a página |
| 4 | Equipe, `#equipe` | foto larga (com adversário e público, decisão do Pedro) e, embaixo, texto em coluna estreita | IMG_7798 (Muay Thai, calção "KAIRÓS") |
| 5 | Faixa de nomes | uma linha de nomes grandes andando para a esquerda, cortada pelas bordas; uma frase embaixo dizendo quem são | — |
| 6 | Chamada, `#patrocinio` | foto na metade esquerda, texto e botão na direita | IMG_0554 (vitória) |
| 7 | Rodapé | menu grande de um lado, recorte do protetor "CANNIBAL" do outro, nome na largura toda fechando a página | IMG_3709 (retrato) |

Recortes propostos em `.taste-skill/mock/5-fotos-recortes.jpg`. Desvios da folha de direção,
declarados: a seção 4 não foi sorteada (o texto sobre equipes e técnicos precisa de um lugar); na
seção 3 a metade direita leva foto em vez de ficar vazia; a seção 6 usa meia largura porque a
IMG_0554 tem 1365 px de largura e não aguenta tela cheia.

Navbar: links "Trajetória", "Cartel", "Equipe" e o botão "Seja patrocinador"; sem vidro. O nome
pequeno do canto some enquanto o Hero está na tela, porque o título gigante já é o nome.

## Textos

Mudam ou saem; o que não está aqui fica como está em `site.ts`.

| Onde | Hoje | Proposto |
| --- | --- | --- |
| Hero, etiquetas | `eyebrow`, `statusLabel`, barra inferior, "SEQ 001 / 169", crédito do loader "ARTHUR // CANNIBAL" | removidos |
| Hero, bloco "Forjado no quartel / Disciplina e instinto" | aparece de 10% a 18% do scroll, só no desktop | removido: repete o texto de apoio e disputa o canto com o título |
| Hero, botão | não existe na primeira tela | "Seja patrocinador" → `#patrocinio` |
| Cinematic, títulos | "Forjado no / ringue" e "Movido pela / família", com a última palavra em vermelho | "Forjado / no ringue" e "Movido / pela família", sem cor |
| Cinematic, rótulos dos cards | "01 — Disciplina", "02 — Coragem", "03 — Vencer" | removidos; as três frases ficam |
| Cinematic, final | "Próximo round" + "Ver números" | link "Ver o cartel" → `#cartel` |
| Cinematic, contador e barra | "SEQ nnn / 169", barra de progresso, textos da barra | removidos (o roteiro, linha 21, já registrava "readout desligado a pedido do cliente") |
| Cartel, título | "Por trás do lutador" | "Oito vitórias em nove lutas" |
| Cartel, legenda | "3 KO, 3 decisões, 2 finalizações" | "3 nocautes, 3 decisões e 2 finalizações. 1 derrota." |
| Cartel, filtros | — | "Nocaute", "Decisão", "Finalização"; ao tocar: "3 das 8 vitórias vieram por nocaute." |
| Equipe, título | — | "Sete anos de Muay Thai" |
| Equipe, texto | `systems.body` | o mesmo, mais "Luta no peso galo, até 61 kg." |
| Faixa | — | Equipe Kairós · Brasília Luta Livre · Samurai Fight 7 · Move Nutrição · No Talk · Tarumã |
| Faixa, frase | — | "Onde ele treina, onde venceu e quem já está com ele." |
| Chamada | — | "Vamos vencer." + "Sua marca ao lado de um lutador de Brasília com 8 vitórias em 9 lutas." + botão "Seja patrocinador" |
| Rodapé | grade de 6 links pequenos, "Brasília DF // Vamos vencer" | menu das seções; blocos "Contato" e "Parceiros" (cupons); linha legal e créditos das fotos; nome na largura toda |

"Jungle Fight" fica fora da faixa: o perfil registra só a seletiva, e o nome solto sugeriria que
ele lutou no evento. Todos os nomes vêm de `perfil-comunicacao.md` (linhas 28, 29, 35 e 43).

## Contrato `SiteContent`

- `Headline` passa de `{ line1, highlight }` para `{ top, bottom }`.
- Saem: `hero.statusLabel`, `hero.eyebrow`, `hero.statement`, `hero.bottomBar`,
  `hero.loader.eyebrow`, os mesmos em `cinematic`, `cinematic.outro.kicker`, `TimedCard.label`,
  `systems` inteiro, `footer.buildLine`.
- Entram: `hero.cta`, `record` (título, placar, legenda, métodos com contagem, frase de
  resultado), `team` (título, texto, foto), `names` (lista, frase), `sponsorCall` (linha, texto,
  botão, foto), `footer.menu`, `footer.contact`, `footer.partners`.
- Cada foto leva `src`, `alt` e `credit` no conteúdo.

`TEMPLATE.md` é atualizado para o contrato novo, e o `AGENTS.md` da raiz deixa de chamar o
repositório de template.

## Código

**Novos:** `ui/PinnedTitle.tsx`, `ui/SequenceQuote.tsx`, `ui/Button.tsx`,
`sections/FightRecord.tsx` com `ui/RecordMarks.tsx` (o único componente novo com estado),
`sections/Team.tsx`, `sections/NamesBand.tsx`, `sections/SponsorCall.tsx`, `public/photos/*.webp`
e o comando de recorte registrado em `media/README.md`.

**Reescritos:** `Hero.tsx`, `CinematicReveal.tsx`, `Navbar.tsx`, `Footer.tsx`, `globals.css`,
`layout.tsx` (fonte), `site.ts`.

**Removidos:** `HudFrame.tsx`, `EyebrowBadge.tsx`, `SystemsNominal.tsx`; em `globals.css`,
`.card-surface`, `.hud-tick`, `.grain`, `--accent-glow`, `--card-bg`, `--card-border`,
`--hud-line`, `--font-mono`; as vinhetas radiais das duas sequências (entra uma película neutra
só onde há texto sobre a foto); a dependência `geist`, que nenhum arquivo de `src` importa
(MEDIDO por busca).

Antes de escrever: ler `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`
e `image.md`, como manda o `AGENTS.md`.

## Fases

| Fase | O que faz | Parada |
| --- | --- | --- |
| 0 | Commit da parte B (#4) e branch novo `feat/redesenho-poster-fixo` a partir dele | feita: `ebf1fa8` |
| 1 | Tokens de cor e tipo, fonte, `Button`, `PinnedTitle`, `SequenceQuote`, Hero e Navbar (adiantada da fase 3: a barra antiga cobria o título novo) | feita: o Pedro viu o Hero e manteve o título em uma linha. Sem commit |
| 2 | Cinematic com os mesmos componentes | feita, sem commit; ver "Fase 2: o que saiu diferente do desenho" |
| 3 | Cartel com as marcas que tocam, foto do cage | feita, sem commit |
| 4 | Equipe, faixa de nomes, chamada, rodapé; recortes das fotos | feita, sem commit |
| 5 | Limpeza: contrato `site.ts`, componentes e CSS mortos, `TEMPLATE.md`, `AGENTS.md`, `media/README.md` | feita, sem commit |
| 6 | Medição da skill (`lint.mjs`, `inspect.mjs`), até 3 rodadas de crítica sobre capturas, camada de movimento, relatório | feita, sem commit; ver "Fases 3 a 6" |

## Fase 2: o que saiu diferente do desenho

MEDIDO em 2026-11-11, sobre o build servido na porta 3102: lint, tipos e build com saída 0; os
48 pontos de frame e de frase iguais aos do `ebf1fa8`; `lint.mjs` da skill sem achado nos
arquivos tocados; `inspect.mjs` com 7 FAIL, todos do bloco de números e do rodapé antigos ou da
falta de fotos (fases 3 a 5). Estados dos textos conferidos em 6 pontos do scroll, em 390×844,
844×390 e 1920×1080, com e sem movimento reduzido; capturas também em 768×1024.

| Desvio | Motivo |
| --- | --- |
| Segunda palavra em uma linha no canto inferior esquerdo, não em duas | segue a decisão do item 8 e mantém o `h2` em duas linhas para o medidor |
| Frases no meio da coluna esquerda (tabela das seções), não embaixo à direita como no painel do mock | embaixo à direita a frase caía sobre a luva e o calção |
| O texto de apoio aparece em todas as larguras, no lugar das frases, e some até 8% do scroll | antes só existia no desktop |
| Os dois títulos trocam em sequência (um some antes de o outro entrar), em 50% ± 6% | no cruzamento antigo os dois ficavam sobrepostos e viravam borrão |
| O final é um link de texto, sem deslocamento | botão único na página; a pílula de vidro saiu |
| Legenda das frases em branco na tela em pé (vale também para o Hero) | em cinza sumia sobre a pele e o calção |
| A seção tem dois `h2` (antes e depois da troca) | os dois textos precisam existir para o leitor de tela; só um fica visível por vez |

Os marcos de texto ficam em `src/lib/cinematic.ts` (`CINE_INTRO_FADE_END`, `CINE_TITLE_SWAP`,
`CINE_OUTRO`), ao lado dos `show`/`hide` das frases em `site.ts`.

## Fases 3 a 6: resultado e o que saiu diferente do desenho

MEDIDO em 2026-11-11 no Chromium headless, sobre o build de produção servido na porta 3102:

- lint, `tsc --noEmit` e build com saída 0;
- `lint.mjs` da skill em `src`: 0 FAIL, 0 WARN; `inspect.mjs`: 0 FAIL, 2 WARN (abaixo);
- em 390×844, 844×390, 768×1024, 1280×720, 1440×900 e 1920×1080: sem rolagem horizontal, as 4
  fotos carregadas, nenhum título com mais de 2 linhas, nenhuma entrada parada pela metade, sem
  erro no console, botão do Hero clicável na carga, link "Ver o cartel" clicável e levando ao
  cartel;
- cartel em 390×844: os filtros acendem 3, 3 e 2 marcas e o segundo toque apaga; a legenda está em
  `aria-live`;
- movimento reduzido em 390×844: entradas sem animação, faixa de nomes parada, sem rolagem
  horizontal.

Avisos do inspetor que ficam, com o motivo:

| Aviso | Motivo |
| --- | --- |
| `no-footage` | o inspetor procura `<video>`; as duas sequências por scroll são desenhadas em canvas |
| `pinned-over-picture` | o título preso sobre a foto é a direção aprovada ("pôster fixo") |

Desvios do desenho:

| Desvio | Motivo |
| --- | --- |
| Entradas por animação CSS presa ao scroll (`.rise`, `.drift`), não por `AnimatedSection`, que foi removido | sem JavaScript e sem `framer-motion`; o conteúdo nunca fica escondido se a animação não rodar |
| O botão da chamada leva a `#contato`, no rodapé | o destino final (item 4) não foi definido |
| Itens de "Contato" e "Parceiros" são texto, sem link | sem destino definido; link para `#` seria um link morto |
| Crédito da foto da Equipe sobre a foto, no canto superior direito, com fundo cheio | abaixo da foto ele era lido como etiqueta acima da faixa de nomes; solto sobre o alto claro da foto, sumia |
| `framer-motion` e `@phosphor-icons/react` ficaram no `package.json` sem nenhum arquivo que os importe | remover dependência pede aprovação; fica como recomendação |

Defeitos achados pela medição e corrigidos:

| Defeito | Causa | Correção |
| --- | --- | --- |
| Link do menu, End, PageDown e barra de rolagem não funcionavam por cerca de 1,2 s depois da roda do mouse. Já existia antes do redesenho | o Lenis, enquanto anima, desfaz scroll que não partiu dele | `yieldToNativeJump` em `SmoothScrollProvider.tsx` |
| "Ver o cartel" não recebia o clique em 1440 px | o texto de apoio transparente era pintado por cima do link | `pointer-events-none` no texto de apoio e `relative z-10` no link |
| Título transparente da Trajetória cobria o visível no teste de clique e seria lido duas vezes | os dois `h2` ocupam o mesmo lugar e só a opacidade mudava | `visibility: hidden` no transparente (`setTitleOpacity`) |

Sem medição nesta etapa: a comparação dos 48 pontos de frame e de frase contra o `ebf1fa8` não foi
refeita depois da fase 2 (o script ficou numa pasta temporária que se perdeu); as fases 3 a 6 não
editaram a fórmula de progresso, o desenho do canvas nem `useFramePreload.ts`. Navegação por
teclado no cartel e a página com JavaScript desligado foram conferidas no servidor de
desenvolvimento, não no build final. Rodadas de crítica: as capturas do inspetor foram vistas nas
três larguras, sem nota escrita no formato de `critique.md`.

## Validação

- Todas as fases: `npm run lint && npx tsc --noEmit && npm run build`.
- **Sincronia das sequências (regressão).** Em 8 pontos de progresso × 3 larguras (390×844,
  1024×768, 1920×1080), o hash dos pixels do canvas e os ids dos cards visíveis têm de ser iguais
  antes e depois. O canvas não é tocado, então qualquer diferença é defeito. Cobre o risco de o
  redesenho deslocar frames ou cards.
- **Título sobre a foto.** Capturas em 7 pontos por sequência nas 3 larguras; nenhum olho, nariz
  ou boca coberto pelo título, e o título legível em todas. Cobre o risco principal da direção.
- **Cartel.** Os três filtros acendem 3, 3 e 2 marcas; funcionam por teclado com foco visível; a
  frase de resultado é anunciada (`aria-live`); com JavaScript desligado a legenda continua
  dizendo os números.
- **Movimento reduzido.** Pôster nas duas sequências (já existe), faixa de nomes parada, entradas
  sem deslocamento, nenhum conteúdo escondido.
- **Skill.** `lint.mjs` e `inspect.mjs` sem FAIL, fora os dois já explicados na auditoria que vêm
  de a foto ser desenhada em canvas; `long-pin` segue como WARN porque duas sequências de 400vh
  são o formato do site.
- **Fotos.** Cada WebP comparado com o recorte equivalente do original: mesma imagem, só menor.

Sem suíte E2E no projeto; a verificação segue por script Playwright temporário, como no PLAN
anterior.

## Critérios de aceite

- [ ] Nenhum canto de HUD, contador `SEQ`, etiqueta em maiúsculas pequenas, cartão de vidro, fonte
      monoespaçada, gradiente decorativo ou palavra colorida em título
- [ ] Título fixo nos dois cantos nas duas sequências, sem cobrir olhos, nariz ou boca em 390,
      1024 e 1920 px
- [ ] Frame desenhado e cards visíveis iguais aos de antes nos 48 pontos de comparação
- [ ] Botão "Seja patrocinador" na primeira tela
- [ ] Cartel que toca funcionando com toque, mouse e teclado, com texto de reserva
- [ ] Quatro fotos novas, só recortadas, com crédito na página
- [ ] `lint.mjs` e `inspect.mjs` da skill sem FAIL além dos dois artefatos declarados
- [ ] Lint, tipos e build com código 0; página inteira rolada no navegador
- [ ] `TEMPLATE.md`, `AGENTS.md`, `media/README.md` e `HANDOFF.md` atualizados

## Riscos

- **Primeira tela escura.** MEDIDO: a luminância média dos frames do Hero vai de 0,05 (frame 1) a
  0,22 (frame 56); a sequência nasce quase preta de propósito ("revelação pela luz",
  `media/README.md`). O título branco sobre preto resolve a leitura, mas a foto só aparece com
  cerca de 25% de scroll. Mudar o frame inicial mexe na fórmula sensível e fica fora deste PLAN.
- **Três linhas no título do Hero.** MEDIDO: o medidor da skill conta as linhas do `h1` e reprova
  acima de duas; "Arthur" + "The / Cannibal" (9,5vw) dá três. A fase 1 implementa "The Cannibal"
  numa linha a 7,5vw, que o medidor lê como duas linhas nas três larguras. A versão em duas
  linhas foi capturada para comparação; a escolha final é do Pedro na parada da fase 1.
- **`covered-text` nas frases.** Resolvido na fase 2: a opacidade passou do `figure` para o
  `blockquote` e a legenda, que é onde o inspetor lê. MEDIDO: o achado não aparece mais.
- **Frase do Hero sobre o queixo.** No frame 118 a frase embaixo à esquerda encosta no queixo
  (VISTO no mock). É texto pequeno; conferir na parada da fase 1.
- **Terceiros na IMG_7798.** O adversário, a equipe do evento e o público aparecem e são
  identificáveis.
- **Resolução.** IMG_0554 tem 2,8 MP; em tela de alta densidade pode aparecer mole mesmo em meia
  largura.
- **Marca d'água nos frames.** O canto superior esquerdo dos frames do Hero tem a assinatura do
  fotógrafo cortada pela borda (VISTO no mock); com o nome pequeno da navbar escondido ela fica à
  mostra.
- **Sem teste automatizado da animação.** A validação é por script e por olho.

## Fora do escopo

Regerar frames ou mudar o frame inicial; vídeo vertical para celular; trocar Lenis; suíte E2E
permanente; autorizações de uso das fotos; push, PR e deploy.

## Depende do Pedro ou do Arthur

| # | O quê | Bloqueia |
| --- | --- | --- |
| 1 | Autorizar o commit da parte B (#4) e o branch novo | respondido em 2026-11-11: autorizado (`ebf1fa8`) |
| 2 | Aceitar a retirada do bloco "Forjado no quartel / Disciplina e instinto" | respondido: aceito |
| 3 | IMG_7798: foto larga com adversário e público, ou recorte fechado só no Arthur | respondido: foto larga |
| 4 | Destino do botão "Seja patrocinador" (WhatsApp, e-mail ou Instagram) e dos links do rodapé | publicar |
| 5 | Crédito das fotos IMG_0554 e IMG_0438; autorização dos fotógrafos | publicar |
| 6 | Arthur confirmar os nomes da faixa e o que o cartel 8-1 cobre (MMA, Muay Thai ou os dois) | publicar |
| 7 | Pôr `.taste-skill/` no `.gitignore` e remover a dependência `geist` | respondido: autorizado, fica na fase 5 |
| 8 | Título do Hero na composição larga: uma linha (implementada) ou duas linhas (aprovada no mock, reprovada pelo medidor) | respondido em 2026-11-11: uma linha |

## Sem medição

- O título sobre os 169 frames de cada sequência: o mock cobriu 4 do Hero e 2 do Cinematic, em
  duas telas.
- Larguras intermediárias (768 a 1280 px) e tela em pé acima de 768 px.
- Quanto da escuridão da primeira tela vem da vinheta atual e quanto dos frames.
- As seções 3 a 7 não foram desenhadas; a tabela descreve intenção, e a crítica sobre capturas
  pode mudar a disposição.
- Nitidez real da IMG_0554 e da IMG_0438 no tamanho final.
- Celular real, Safari e Firefox.
- Opinião do Arthur sobre o nome dividido e sobre a foto da vitória na chamada.
