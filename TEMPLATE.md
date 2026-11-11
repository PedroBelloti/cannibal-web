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
| `cards[0..2]` | Frases soltas, uma por vez, no lugar do texto de apoio (0,10–0,30 · 0,35–0,55 · 0,60–0,80): `quote`, `speaker`, `source`. Sem `speaker` e `source` a frase é do site e sai sem aspas e sem assinatura; só assine fala dele com fonte no perfil | frase até 60 caracteres |
| `loader.text` | Tela de carga dos frames | até 24 caracteres |

## `cinematic`: segunda sequência (`public/frames2/`), `#mentalidade`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `titleBefore` | Título da primeira metade, coluna à esquerda (`top` em cima, `bottom` embaixo) | 1 + 2 palavras |
| `titleAfter` | Entra no lugar do anterior em 0,50 (`CINE_TITLE_SWAP`) | 1 + 2 palavras |
| `lead` | Texto de apoio no meio da coluna; some até 0,08 (`CINE_INTRO_FADE_END`) | até 120 caracteres |
| `cards[0..2]` | Frases no lugar do texto de apoio, mesmos intervalos do Hero | frase até 65 caracteres |
| `outro` | Link em letra grande no fim (0,86 em diante, `CINE_OUTRO`): `lead` em branco e `highlight`, a palavra do destino, em vermelho | 2 palavras + 1; cabe numa linha só |
| `loader.text` | Tela de carga | até 24 caracteres |

O que os frames mostram: luz fria de academia no começo e luz quente no fim; a virada fica perto
da metade, onde o título troca.

## `record`: cartel, `#cartel`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `rate.label` | Ao lado do percentual gigante; os dois formam o título da seção | 2 palavras |
| `rate.note` | Segunda linha do rótulo, em cinza | até 12 caracteres |
| `methods[]` | Um botão por método: `label`, `count` marcas, e `result`, a frase mostrada ao tocar. Com `featured: true` o método vai para a linha de destaque, com o número grande | `label` 1 palavra, no plural; `result` até 45 caracteres; 2 em destaque |
| `loss` | Derrota, marca vazada, sem toque, ao lado dos métodos sem destaque | 1 palavra |
| `legend` | Frase com nenhum método escolhido; diz o número forte sem depender do toque | até 50 caracteres |
| `filterLabel` | Nome do grupo de botões para leitor de tela | curto |
| `photo` | Metade direita na tela larga; na tela em pé entra na pilha da seção | ver "Fotos" |

O percentual não é digitado: `FightRecord.tsx` calcula a partir da soma dos `count` e de
`loss.count`. `rate.note`, `legend`, os `result` e `sponsorCall.body` repetem esses números à mão
e nada confere isso no código: mudou um `count`, revise os quatro.

## `team`: equipe, `#equipe`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `photo` | Foto na largura toda (na tela larga, da altura da tela); o crédito fica no canto superior direito dela, em texto solto | ver "Fotos" |
| `title` | Abaixo da foto, à esquerda | até 25 caracteres |
| `body` | Coluna estreita à direita do título | até 280 caracteres |

## `names`: faixa de nomes

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `items[]` | Duas fileiras de nomes em sentidos opostos: a de cima cheia, a de baixo em contorno e começando na metade da lista | 6 nomes; a volta inteira precisa ser mais larga que a tela, com menos nomes meça de novo |
| `caption` | Frase abaixo da faixa, dizendo quem são | até 60 caracteres |
| `label` | Nome da seção para leitor de tela | curto |

Só entram nomes com fonte no perfil. "Jungle Fight" fica fora: o perfil registra só a seletiva.

## `sponsorCall`: chamada, `#patrocinio`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `photo` | Metade esquerda | ver "Fotos" |
| `title` | Título | 2 palavras |
| `body` | Uma frase | até 100 caracteres |
| `cta` | Botão vermelho que abre o WhatsApp. O rótulo diz o que acontece; "Seja patrocinador" fica só nos botões que trazem até esta seção | até 3 palavras |
| `instagram` | Botão escuro ao lado, que abre o perfil no Instagram | até 3 palavras |

## `footer`, `#contato`

| Campo | Onde aparece | Tamanho |
|---|---|---|
| `menu.links[]` | Menu grande das seções; um link sorteado fica vermelho de tempos em tempos | 1 palavra cada |
| `contact` / `partners` | Dois blocos: `title` e itens com `name`, `note` opcional e `href` opcional | `name` até 20, `note` até 16 caracteres |
| `photo` | Recorte do retrato, com crédito embaixo | ver "Fotos" |
| `legal` | Linha de direitos e créditos das fotos | até 110 caracteres |
| `disclaimer` | Aviso abaixo dos parceiros | até 50 caracteres |

Item sem `href` aparece como texto, não como link; endereço `http` abre em outra aba. O número
de seguidores na nota do Instagram e em `sponsorCall.body` é digitado: mudou, revise os dois.
PENDENTE: contato de imprensa e eventos.

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
borda do canvas aparece. `--accent` marca o que leva a algum lugar ou responde ao toque: botão
principal, marcas acesas ou sorteadas do cartel, a palavra de destino do link final da Mentalidade e o link
apontado ou sorteado do menu do rodapé.
