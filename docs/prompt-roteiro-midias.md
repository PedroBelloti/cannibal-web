# Prompt para o agente de roteiro — grade de mídias do site

Copie tudo abaixo da linha e envie ao agente.

---

Você vai escrever o roteiro e a **grade de mídias** de um site de uma página com vídeo controlado
por scroll. Depois, outro agente vai gerar as mídias no Higgsfield e preencher o site direto a
partir da sua entrega. Por isso, siga as especificações e o formato de saída à risca: o que
estiver fora delas quebra o site ou exige retrabalho.

## Como o site funciona (leia antes de roteirizar)

- Não existe player de vídeo. Cada vídeo é fatiado em **169 imagens** que vão sendo desenhadas
  conforme a pessoa rola a página. Rolar para baixo avança, rolar para cima volta. Quem controla
  o ritmo é a pessoa, então **o vídeo é lido quadro a quadro, para frente e para trás**.
- O site tem **2 sequências de vídeo**, seguidas de 2 seções estáticas (números e rodapé):
  - **Sequência A (Hero)**: apresentação. Abre o site.
  - **Sequência B (Cinematic)**: uma história em 3 beats, com uma virada no meio.
- Textos e cards aparecem por cima do vídeo em faixas fixas de progresso (0 = início do vídeo,
  1 = fim). **O que o vídeo mostra em cada faixa precisa combinar com o texto daquela faixa.**
- A borda do vídeo recebe uma vinheta escura e se funde ao fundo da página, `#0a0a0b`.

## Regras técnicas de cada vídeo (obrigatórias)

1. **Uma única tomada contínua. Zero cortes**, zero troca de cena, zero fade para preto. Um corte
   vira um salto brusco no meio da rolagem.
2. **Movimento lento, contínuo e numa só direção**: pull-back, dolly-in, órbita parcial lenta,
   troca gradual de luz ou de cor, transformação gradual. Nada de câmera na mão, tremor, whip pan,
   zoom brusco ou ação rápida.
3. **16:9, 1080p, de 5 a 8 segundos.** A duração recomendada é 7 s, que dá 169 frames a 24 fps.
4. **Nenhum texto, logo legível ou legenda dentro do vídeo.** Todo texto entra pelo site.
5. **O primeiro frame é o pôster do site** e fica parado na tela enquanto a pessoa não rola. Ele
   precisa funcionar como uma imagem de capa.
6. **Celular**: no mobile o vídeo é cortado e só aparecem os **20% centrais da largura** do quadro
   (e 77% da altura). Calculado a partir do código, para uma tela de 390×844. O assunto principal
   tem que estar ou passar pelo **centro horizontal** nos momentos importantes. O que acontece só
   nas laterais fica invisível no celular.
7. **Propriedade intelectual**: proibido personagem de terceiros (Marvel, DC, filmes, games),
   rosto ou semelhança de pessoa real, e marcas de terceiros. Use um assunto original ou o produto
   e a marca do próprio cliente.
8. A identidade do assunto (forma, cores, material) tem que ser a mesma do primeiro ao último frame.

## Mapa da Sequência A (Hero), com as áreas que precisam ficar livres

| Progresso | Segundos (vídeo de 7 s) | O que o site mostra por cima | O que o vídeo deve respeitar |
|---|---|---|---|
| 0,00–0,08 | 0,0–0,6 s | Título H1 grande no **canto inferior esquerdo** + subtítulo | Pôster: assunto forte, mas com o **terço inferior esquerdo** escuro e calmo |
| 0,10–0,18 em diante | 0,7 s em diante | Frase gigante em 2 linhas ocupando **~55% da largura à esquerda** (só desktop) | A partir daqui, o assunto vai para o **centro-direita** e a metade esquerda fica escura |
| 0,10–0,30 | 0,7–2,1 s | Card 1 (citação) no alto, à direita | Beat 1 da apresentação |
| 0,35–0,55 | 2,5–3,9 s | Card 2 no meio, à direita | Beat 2: uma mudança visível (luz, cor, detalhe que acende) |
| 0,60–0,80 | 4,2–5,6 s | Card 3 embaixo, à direita | Beat 3: o movimento se resolve |
| 0,80–1,00 | 5,6–7,0 s | Só a interface do site | Fim calmo; o último frame pode ser quase vazio ou escuro |

Fixos o tempo todo: rótulos pequenos nos 4 cantos e uma barra de progresso no rodapé. Não ponha
nada importante a menos de ~8% das bordas.

Referência de estilo que funcionou: estúdio preto puro, um assunto bem iluminado com contraluz e
fumaça leve, começando em close à esquerda; a câmera se afasta devagar enquanto o assunto desliza
para a direita e diminui; no meio, a cor da luz principal muda (de âmbar para ciano).

## Mapa da Sequência B (Cinematic), a história em 3 beats

| Progresso | Segundos (vídeo de 7 s) | O que o site mostra por cima | O que o vídeo deve respeitar |
|---|---|---|---|
| 0,00–0,52 | 0,0–3,6 s | **Título A** no **alto à direita** (bloco de ~1/3 da largura) | Alto à direita sem elementos fortes |
| 0,10–0,30 | 0,7–2,1 s | Card do beat 1, no alto à esquerda | **Beat 1: abertura**, cenário e tensão |
| 0,35–0,55 | 2,5–3,9 s | Card do beat 2, no meio à esquerda | **Beat 2: aproximação**, a câmera chega perto |
| 0,48–0,58 | 3,4–4,1 s | O Título A dá lugar ao **Título B** | **A virada visual acontece aqui**: troca de fundo, luz ou estado |
| 0,60–0,80 | 4,2–5,6 s | Card do beat 3, embaixo à esquerda | **Beat 3: desfecho**, a transformação |
| 0,86–1,00 | 6,0–7,0 s | Botão para a próxima seção, embaixo à direita | Final legível e calmo, com o canto inferior direito livre |

O assunto fica no **centro**: os textos ocupam a esquerda (cards) e o alto à direita (títulos).
Referência de estilo que funcionou: campo vermelho enfumaçado, com o assunto em silhueta ao longe
→ a câmera se aproxima enquanto o fundo vermelho se dissolve em cinza claro (a virada) → gesto
final e o assunto se desfaz em partículas douradas.

## O que você deve entregar

Entregue exatamente estas 4 partes, nesta ordem.

### Parte 1 — Conceito
- Logline do site em uma frase, o público e o tom.
- Paleta: `background` (perto de `#0a0a0b`, a não ser que haja um motivo forte), `accent` (cor
  de destaque em hex) e as 2 ou 3 cores dominantes dos vídeos.
- O assunto principal, descrito para manter a identidade igual nos dois vídeos.

### Parte 2 — Grade de mídias (uma ficha por sequência, A e B)
Para cada sequência:
- `duracao_s` (5–8) e o **movimento de câmera em uma frase**.
- `keyframe_inicial`: prompt de imagem em inglês, 16:9, descrevendo o primeiro frame, com a
  composição pedida no mapa acima.
- `keyframe_final`: prompt de imagem em inglês do último frame, com o mesmo assunto e cenário.
- `prompt_video`: prompt em inglês descrevendo **a evolução do primeiro ao último frame** numa
  tomada só, terminando sempre com:
  `single continuous shot, no cuts, no scene changes, slow steady camera, no handheld shake, no text, consistent subject identity, cinematic lighting, 16:9`
- `negativos`: o que deve ser evitado (lista curta).
- `beats`: uma tabela com `progresso` · `segundos` · `o que se vê no quadro` · `onde está o
  assunto (esquerda/centro/direita)` — cobrindo as faixas do mapa.
- `checagem_mobile`: uma linha confirmando que o assunto passa pelo centro horizontal nos beats.

### Parte 3 — Textos do site
Preencha este JSON respeitando os limites. Ele é colado direto no site, então mantenha as chaves
exatamente como estão. Os textos devem combinar com o que o vídeo mostra em cada faixa.

```json
{
  "meta": { "lang": "pt-BR", "title": "≤60", "description": "120–160 caracteres" },
  "brand": { "name": "≤20, pode usar 'Marca / Submarca'" },
  "nav": { "links": ["1 palavra", "1 palavra"], "cta": "1 verbo" },
  "hero": {
    "statusLabel": "2–3 palavras",
    "eyebrow": "BLOCO // BLOCO // BLOCO",
    "title": { "line1": "1–3 palavras", "highlight": "1–2 palavras" },
    "lead": "≤140",
    "statement": { "kicker": "2–3 palavras", "line1": "1 palavra", "line2Prefix": "1 palavra", "highlight": "1 palavra", "caption": "≤60" },
    "bottomBar": { "center": "BLOCO // BLOCO", "scrollHint": "1 palavra" },
    "cards": [
      { "quote": "≤60", "speaker": "≤20", "source": "≤24" },
      { "quote": "≤60", "speaker": "≤20", "source": "≤24" },
      { "quote": "≤60", "speaker": "≤20", "source": "≤24" }
    ],
    "loader": { "eyebrow": "BLOCO // BLOCO", "text": "≤24" }
  },
  "cinematic": {
    "statusLabel": "2–3 palavras",
    "eyebrow": "BLOCO // BLOCO",
    "titleBefore": { "line1": "1–3 palavras", "highlight": "1 palavra" },
    "titleAfter": { "line1": "1–3 palavras", "highlight": "1–2 palavras" },
    "lead": "≤120",
    "bottomBar": { "left": "BLOCO // BLOCO", "center": "BLOCO // BLOCO", "scrollHint": "1 palavra" },
    "cards": [
      { "label": "01 — 1 palavra", "quote": "≤60", "speaker": "≤20", "source": "≤24" },
      { "label": "02 — 1 palavra", "quote": "≤60", "speaker": "≤20", "source": "≤24" },
      { "label": "03 — 1 palavra", "quote": "≤80", "speaker": "≤20", "source": "≤24" }
    ],
    "outro": { "kicker": "2 palavras", "cta": "2 palavras" },
    "loader": { "eyebrow": "BLOCO // BLOCO", "text": "≤24" }
  },
  "systems": {
    "eyebrow": "BLOCO // BLOCO",
    "title": { "lead": "2–4 palavras", "highlight": "1–2 palavras" },
    "body": "200–280 caracteres",
    "cta": "2–3 palavras",
    "stats": [
      { "label": "≤18", "value": "≤9, com unidade", "note": "≤32" },
      { "label": "≤18", "value": "≤9", "note": "≤32" },
      { "label": "≤18", "value": "≤9", "note": "≤32" },
      { "label": "≤18", "value": "≤9", "note": "≤32" }
    ]
  },
  "footer": {
    "legal": "≤140",
    "links": [
      { "name": "≤14", "note": "≤20" }, { "name": "≤14", "note": "≤20" }, { "name": "≤14", "note": "≤20" },
      { "name": "≤14", "note": "≤20" }, { "name": "≤14", "note": "≤20" }, { "name": "≤14", "note": "≤20" }
    ],
    "buildLine": "≤60",
    "disclaimer": "≤50"
  }
}
```

Os números (`stats`) precisam ser plausíveis para o tema. Se forem dados do cliente,
indique a fonte. Não invente estatística apresentando-a como fato real.

### Parte 4 — Autochecagem
Responda sim ou não, e corrija antes de entregar o que der "não":
- [ ] Cada vídeo é uma tomada única, sem nenhum corte implícito ("then", "cut to", "suddenly")?
- [ ] O movimento é lento e numa só direção do início ao fim?
- [ ] O primeiro frame da sequência A deixa o terço inferior esquerdo livre para o título?
- [ ] A virada da sequência B cai entre 0,48 e 0,58?
- [ ] O assunto passa pelo centro horizontal nos beats (mobile)?
- [ ] Não há personagem, pessoa real, marca de terceiros nem texto dentro dos vídeos?
- [ ] Todos os textos estão dentro dos limites de caracteres?
- [ ] O texto de cada card descreve ou comenta o que o vídeo mostra naquela faixa?

Se algum requisito conflitar com o roteiro desejado (por exemplo, uma cena que exige corte),
**não quebre a regra em silêncio**: aponte o conflito e proponha a alternativa que respeita a
tomada única (por exemplo, transformar o corte numa transição contínua de luz ou de fundo).
