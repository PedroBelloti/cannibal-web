# Guia de preenchimento do template

Site de uma página com dois vídeos controlados por scroll. **Todo o texto fica em
`src/content/site.ts`**: nenhum componente tem texto fixo. Cada valor vem com um indicador entre
colchetes, `[campo: o que escrever · limite]`, que aparece na tela até ser substituído.

## Como preencher (para agentes)

1. Leia o briefing: marca, produto, tom, público e idioma.
2. Substitua **todos** os `[...]` em `src/content/site.ts`, respeitando os limites de caracteres
   abaixo, porque o layout foi desenhado para eles. Apague os colchetes.
3. Ajuste `meta.lang` (`pt-BR`, `en`, ...) e `meta.siteUrl` (domínio final).
4. Confira se sobrou algum indicador:
   `grep -nE '"[^"]*\[[^"]*\][^"]*"' src/content/site.ts` não pode retornar nada (o template
   vazio tinha 74 linhas com indicadores).
5. Rode `npm run lint && npm run build` e role a página inteira no navegador.

**Não mexa** em `show`/`hide` dos cards nem nos frames, a não ser que troque o vídeo (veja a
seção "Os vídeos").

## O que vai em cada campo

A coluna "Exemplo original" mostra o texto do site Iron Man, para dar referência de tom e tamanho.

### `meta`: aba do navegador e buscadores
| Campo | O que escrever | Limite | Exemplo original |
|---|---|---|---|
| `title` | Marca + produto ou slogan | ≤ 60 caracteres | Stark Industries — Mark LXXXV |
| `description` | O que é e por que rolar a página | 120–160 caracteres | Arc reactor online. J.A.R.V.I.S. standing by. Scroll to engage the Mark LXXXV. |
| `lang` | Código do idioma do conteúdo | — | en |
| `siteUrl` | URL final, com protocolo | — | http://localhost:3000 |

### `brand` e `nav`: barra fixa no topo
| Campo | O que escrever | Limite | Exemplo original |
|---|---|---|---|
| `brand.name` | Nome da marca; a barra `/` é estética | ≤ 20 caracteres | Stark / Industries |
| `nav.links[].label` | Âncoras para as seções (`#systems`, `#footer`) | 1 palavra | Systems · Archive |
| `nav.cta.label` | Verbo de ação do botão | 1 palavra | Engage |

### `hero`: primeiro vídeo (`public/frames/`), tela cheia
O hero ocupa 400vh de rolagem. Os números entre parênteses mostram em que parte do scroll o
texto aparece (0 = topo, 1 = fim).

| Campo | Onde aparece | Limite | Exemplo original |
|---|---|---|---|
| `statusLabel` | Canto superior esquerdo, fixo | 2–3 palavras | Telemetry Link — Live |
| `eyebrow` | Selo acima do título | 3 blocos separados por `//` | MARK LXXXV // STARK INDUSTRIES // ONLINE |
| `title.line1` + `title.highlight` | Título H1 principal (some entre 0 e 0,08) | 1–3 palavras + 1–2 palavras | I am / Iron Man. |
| `lead` | Parágrafo abaixo do H1 | ≤ 140 caracteres | Mark LXXXV nanotech suit. Arc reactor calibrated. Scroll to run a full system diagnostic… |
| `statement.kicker` | Rótulo acima da frase gigante (entra em 0,10–0,18, só desktop) | 2–3 palavras | Protocol — Mk LXXXV |
| `statement.line1 / line2Prefix / highlight` | Frase gigante em 2 linhas, a última palavra destacada | 1 + 1 + 1 palavra | Build / with / Devini |
| `statement.caption` | Linha embaixo da frase gigante | ≤ 60 caracteres | Interfaces & products, engineered like the Mark LXXXV. |
| `bottomBar.center` / `scrollHint` | Rodapé do vídeo | 2 blocos `//` / 1 palavra | J.A.R.V.I.S. // DIAGNOSTIC / Scroll |
| `cards[0..2].quote` | Cards de vidro à direita (0,10–0,30 · 0,35–0,55 · 0,60–0,80) | ≤ 60 caracteres | Sometimes you gotta run before you can walk. |
| `cards[].speaker` / `source` | Autor / origem e ano | ≤ 20 / ≤ 24 caracteres | Tony Stark / IRON MAN — 2008 |
| `loader.eyebrow` / `text` | Tela de carregamento dos frames | 2 blocos `//` / ≤ 24 caracteres | SUIT UP PROTOCOL // BOOTING / Loading Mark LXXXV |

### `cinematic`: segundo vídeo (`public/frames2/`), a história em 3 beats
| Campo | Onde aparece | Limite | Exemplo original |
|---|---|---|---|
| `statusLabel` | Canto superior esquerdo | 2–3 palavras | Flight Log — Archived |
| `eyebrow` | Selo à direita | 2 blocos `//` | TITAN II // FINAL FRAME |
| `titleBefore` | Título da 1ª metade (some entre 0,42 e 0,52) | 1–3 + 1 palavra | I am / Inevitable. |
| `titleAfter` | Título da 2ª metade, no lugar do anterior (0,48–0,58) | 1–3 + 1–2 palavras | And I am / Iron Man. |
| `lead` | Parágrafo abaixo dos títulos | ≤ 120 caracteres | Endgame — the snap heard across the universe… |
| `cards[].label` | Número + nome do beat | `0N — 1 palavra` | 01 — Ignition · 02 — Sync · 03 — Aftermath |
| `cards[].quote` | Fala de cada beat; casa com o que o vídeo mostra | ≤ 60 (o 3º, ≤ 80) caracteres | Yeah, I can fly. |
| `cards[].speaker` / `source` | Autor / origem | igual ao hero | Tony Stark / IRON MAN 3 — 2013 |
| `bottomBar.left / center / scrollHint` | Rodapé do vídeo | blocos `//` | MARK III // ARCHIVE · J.A.R.V.I.S. // PLAYBACK · Scroll |
| `outro.kicker` + `outro.cta` | Botão que aparece no fim (0,86+) e leva à próxima seção | 2 palavras cada | Next — engage / Open diagnostics |
| `loader` | Tela de carregamento | igual ao hero | FLIGHT LOG // RESTORING / Rendering Mark III |

O que o vídeo mostra em cada beat, para escrever falas que combinem com a imagem:
1. **0,10–0,30**: silhueta num campo de batalha vermelho, com poeira e destroços.
2. **0,35–0,55**: a câmera se aproxima e o fundo vermelho vira cinza claro.
3. **0,60–0,80**: gesto final e desintegração em partículas douradas.

### `systems`: seção estática com números
| Campo | O que escrever | Limite | Exemplo original |
|---|---|---|---|
| `eyebrow` | Selo da seção | 2 blocos `//` | J.A.R.V.I.S. // SYSTEMS NOMINAL |
| `title.lead` + `title.highlight` | Título H2 | 2–4 palavras + 1–2 palavras | And I… am… / Iron Man. |
| `body` | História ou proposta, que apresenta os números ao lado | 200–280 caracteres | A snap heard around the universe. The Mark LXXXV was engineered in six hours… |
| `cta` | Botão | 2–3 palavras | Open Suit Archive |
| `stats[0..3]` | 4 métricas: `label` curto, `value` com unidade, `note` explicativa | label ≤ 18, value ≤ 9, note ≤ 32 caracteres | Suit Integrity / 99.2% / Nanoparticle lattice |

### `footer`
| Campo | O que escrever | Limite | Exemplo original |
|---|---|---|---|
| `legal` | © empresa, endereço, linha de marca | ≤ 140 caracteres | © Stark Industries — 10880 Malibu Point, 90265… |
| `links[0..5]` | 6 itens (produtos, cases, páginas): `name` + `note` + `href` | ≤ 14 / ≤ 20 caracteres | Mark I / Cave, Afghanistan |
| `buildLine` | Versão · produto · status | ≤ 60 caracteres | Build 2026.04.21 · Mark LXXXV · J.A.R.V.I.S. Online |
| `disclaimer` | Aviso legal ou de uso | ≤ 50 caracteres | Proof of concept — fan art, no commercial use |

## Os vídeos

- `public/frames/` e `public/frames2/`: 169 WebP cada, 1920×1080, extraídos com o script da
  skill `scroll-video-hero`. Origem e retoques em `media/README.md`. A configuração está em `src/lib/hero.ts` e `src/lib/cinematic.ts`.
- Os vídeos atuais usam a imagem do Iron Man e de um ator real. Servem como **demonstração**, não
  para uso comercial. Para um cliente, gere um vídeo original com a skill `scroll-video-hero`,
  depois ajuste `FRAME_COUNT` e o caminho dos frames e reposicione os `show`/`hide` dos cards
  conforme os beats do novo vídeo.

## Cores

Os tokens ficam em `src/app/globals.css`. Troque só `--accent`: `--accent-soft` e `--accent-glow`
(o brilho dos pontos e selos) derivam dele por `color-mix`. O fundo `#0a0a0b`
precisa combinar com o fundo do vídeo, senão a borda do canvas aparece.
