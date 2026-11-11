# Guia dos campos de texto

Site de uma página: duas sequências controladas por scroll e cinco seções abaixo delas. **Todo o
texto fica em `src/content/site.ts`**, tipado por `SiteContent`; nenhum componente tem texto fixo.
Fatos sobre o atleta só entram com fonte em `docs/perfil-comunicacao.md`.

A coluna "Tamanho" traz o texto atual como referência: é o que foi conferido no navegador de 390 a
1920 px. Texto mais longo que o atual não foi testado; depois de trocar, rode
`npm run lint && npx tsc --noEmit && npm run build` e role a página inteira em tela larga e em pé.
Todo título precisa caber em duas linhas em qualquer largura.

**Não mexa** em `show`/`hide` das frases nem nos frames, a não ser que troque o vídeo (seção "Os
vídeos").

## `meta`: aba do navegador e buscadores

| Campo | O que escrever | Tamanho |
|---|---|---|
| `title` | Nome + o que ele é | até 60 caracteres |
| `description` | O que é o site | 120 a 160 caracteres |
| `lang` | Idioma do conteúdo | `pt-BR` |
| `siteUrl` | URL final, com protocolo | PENDENTE: ainda `http://localhost:3000` |

## `brand` e `nav`: barra fixa no topo

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `brand.name` | Canto esquerdo da barra (escondido enquanto o Hero está na tela) e nome na largura toda do rodapé | "Arthur The Cannibal"; o rodapé depende do divisor `9.35` em `Footer.tsx` |
| `nav.label` | Nome da navegação para leitor de tela | curto |
| `nav.links[]` | Links da barra na composição larga; `href` é a âncora da seção | 1 palavra cada |
| `nav.cta` | Botão vermelho da barra | 2 palavras |

## `hero`: primeira sequência (`public/frames/`)

Os números entre parênteses são a fração do scroll da seção (0 = topo, 1 = fim).

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `title.top` / `title.bottom` | Título fixo: `top` no canto superior esquerdo, `bottom` no inferior direito (tela larga) ou acima do texto de apoio (tela em pé) | 1 palavra / 2 palavras; `bottom` fica numa linha só |
| `lead` | Texto de apoio embaixo à esquerda; some no começo do scroll (`HERO_TEXT_FADE_END`) | até 130 caracteres |
| `cta` | Botão abaixo do texto de apoio, some junto com ele | 2 palavras |
| `photoCredit` | Canto superior direito, fixo | até 30 caracteres |
| `cards[0..2]` | Frases soltas, uma por vez, no lugar do texto de apoio (0,10–0,30 · 0,35–0,55 · 0,60–0,80): `quote`, `speaker`, `source` | frase até 60 caracteres |
| `loader.text` | Tela de carga dos frames | até 24 caracteres |

## `cinematic`: segunda sequência (`public/frames2/`), `#trajetoria`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `titleBefore` | Título da primeira metade, coluna à esquerda (`top` em cima, `bottom` embaixo) | 1 + 2 palavras |
| `titleAfter` | Entra no lugar do anterior em 0,50 (`CINE_TITLE_SWAP`) | 1 + 2 palavras |
| `lead` | Texto de apoio no meio da coluna; some até 0,08 (`CINE_INTRO_FADE_END`) | até 120 caracteres |
| `cards[0..2]` | Frases no lugar do texto de apoio, mesmos intervalos do Hero | frase até 65 caracteres |
| `outro` | Link de texto no fim (0,86 em diante, `CINE_OUTRO`) | 3 palavras |
| `loader.text` | Tela de carga | até 24 caracteres |

O que os frames mostram: luz fria de academia no começo e luz quente no fim; a virada fica perto
da metade, onde o título troca.

## `record`: cartel, `#cartel`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `title` | Título da seção | até 30 caracteres |
| `score` | Placar gigante embaixo à esquerda | "8–1" |
| `methods[]` | Uma linha por método: `label`, `count` marcas, e `result`, a frase mostrada ao tocar | `label` 1 palavra; `result` até 45 caracteres |
| `loss` | Linha da derrota, marca vazada, sem toque | 1 palavra |
| `legend` | Frase com nenhum método escolhido; diz os números sem depender do toque | até 60 caracteres |
| `filterLabel` | Nome do grupo de botões para leitor de tela | curto |
| `photo` | Metade direita na tela larga; na tela em pé entra na pilha da seção | ver "Fotos" |

A soma dos `count` mais `loss.count` tem de bater com `score`, `title`, `legend` e
`sponsorCall.body`. Nada confere isso no código.

## `team`: equipe, `#equipe`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `photo` | Foto na largura toda; o crédito fica no canto superior direito dela | ver "Fotos" |
| `title` | Abaixo da foto, à esquerda | até 25 caracteres |
| `body` | Coluna estreita à direita do título | até 280 caracteres |

## `names`: faixa de nomes

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `items[]` | Nomes grandes andando para a esquerda | 6 nomes; menos que 4 deixa a volta visível em tela larga (não medido) |
| `caption` | Frase abaixo da faixa, dizendo quem são | até 60 caracteres |
| `label` | Nome da seção para leitor de tela | curto |

Só entram nomes com fonte no perfil. "Jungle Fight" fica fora: o perfil registra só a seletiva.

## `sponsorCall`: chamada, `#patrocinio`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `photo` | Metade esquerda | ver "Fotos" |
| `title` | Título | 2 palavras |
| `body` | Uma frase | até 75 caracteres |
| `cta` | Botão vermelho. PENDENTE: destino final (WhatsApp, e-mail ou Instagram); hoje leva a `#contato` | 2 palavras |

## `footer`, `#contato`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `menu.links[]` | Menu grande das seções | 1 palavra cada |
| `contact` / `partners` | Dois blocos: `title` e itens com `name`, `note` opcional e `href` opcional | `name` até 20, `note` até 16 caracteres |
| `photo` | Recorte do retrato, com crédito embaixo | ver "Fotos" |
| `legal` | Linha de direitos e créditos das fotos | até 110 caracteres |
| `disclaimer` | Aviso abaixo dos parceiros | até 50 caracteres |

Item sem `href` aparece como texto, não como link. PENDENTE: hoje nenhum item de contato ou
parceiro tem destino.

## Fotos

Cada foto é `{ src, alt, credit }`. `src` aponta para `public/photos/`; origem, comando de recorte
e verificação estão em `media/README.md`. `alt` descreve o que se vê. `credit` é `null` enquanto o
autor não for confirmado, e nesse caso a página não mostra crédito para ela. Regra do cliente:
nenhum rosto ou pessoa das fotos pode ser alterado, só recorte e redução.

## Os vídeos

`public/frames/` e `public/frames2/`: 169 WebP cada, gerados por `media/seq-a/` e `media/seq-b/`
(`media/README.md`). A configuração está em `src/lib/hero.ts` e `src/lib/cinematic.ts`. Trocou o
vídeo: ajuste `FRAME_COUNT` e o caminho, reposicione os `show`/`hide` das frases e os marcos de
texto, e confira o foco da tela em pé (`AGENTS.md`).

## Cores

Os tokens ficam em `src/app/globals.css`. `--bg` precisa ser igual ao fundo dos frames, senão a
borda do canvas aparece. `--accent` é usado só no botão principal e nas marcas acesas do cartel.
