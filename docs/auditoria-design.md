# Auditoria de design: o que o site tem de genérico e a direção proposta

**Status:** auditoria concluída em 2026-11-11; proposta aguardando decisão do Pedro. Nenhum
arquivo de código foi alterado. · **Ferramenta:** skill `design-taste-frontend` (tasteskill v2).

Rótulos: MEDIDO (script, navegador), VISTO (captura de tela), INFERIDO (leitura ou julgamento),
RELATO (documento do projeto), PENDENTE.

## Resumo

O que o site tem de próprio são as duas sequências de fotos reais do Arthur. Todo o resto da
aparência veio do template "iron-man": cantoneiras vermelhas, contador `SEQ 001 / 169`,
separadores `//`, rótulos minúsculos em fonte monoespaçada, pontos brilhando, pílulas de vidro.
É uma fantasia de painel de ficção científica. Ela não diz nada sobre um lutador de Muay Thai e
MMA de Brasília, e é exatamente o conjunto que identifica página feita por IA.

A proposta mantém o motor de scroll e os frames como estão e troca a camada que fica por cima
deles: o nome vira o elemento fixo da página, em tipografia grande, e os enfeites saem.

## Como foi medido

Build da árvore de trabalho servido por `next start` em `127.0.0.1:3102`.

| Verificação | Comando | Resultado |
| --- | --- | --- |
| Padrões no código | `lint.mjs src` | 51 FAIL, 15 WARN |
| Página no navegador em 1440, 768 e 390 px | `inspect.mjs` | 9 FAIL, 9 WARN |
| Capturas em 7 pontos de cada sequência, mais as seções finais, em 1440×900 e 390×844 | script Playwright temporário | 4 pranchas de contato |

As capturas de página inteira do `inspect.mjs` repetem o Hero fixo em todos os blocos, por causa
do `position: sticky`. Por isso as sequências foram julgadas pelas capturas do script, não por elas.

## O que a medição acusou

| Regra | Quantas vezes | Onde (exemplos) |
| --- | --- | --- |
| Fonte monoespaçada fora de código | 30 no código; 38% do texto renderizado | `globals.css:22`, `layout.tsx:12`, `Navbar.tsx`, `Footer.tsx`, `SystemsNominal.tsx` |
| Rótulo minúsculo em maiúsculas espaçadas | 32 | barra inferior do Hero e do Cinematic, estatísticas, rodapé |
| Texto abaixo de 13 px | 28 blocos | rótulos de 10 e 11 px |
| Tamanhos de fonte | 12 (o teto é cerca de 5) | 10, 11, 13, 14, 16, 18, 20, 30, 60, 66, 72, 96 px |
| Linha fina e caixa com contorno de 1 px | 12 e 6 | `Hero.tsx:111`, `CinematicReveal.tsx:56`, `Footer.tsx:10`, `globals.css:40` |
| Sombra e brilho em repouso | 6 | `globals.css:44`; pontos em `Navbar.tsx:33`, `Hero.tsx:97`, `Footer.tsx:18`, `EyebrowBadge.tsx:12` |
| Vidro (`backdrop-filter`) | 7 | `globals.css:42`, `Navbar.tsx:22`, `SystemsNominal.tsx:35`, `CinematicReveal.tsx:217` |
| Degradê decorativo | 3 | `Hero.tsx:58`, `CinematicReveal.tsx:72`, `globals.css:66` |
| Etiqueta acima do título | 1 medida, 3 no texto | "CARTEL // NÚMEROS", "CAPÍTULO 02 // TRAJETÓRIA", "MMA // MUAY THAI // BRASÍLIA DF" |
| Numeração 01/02/03 | 3 | "01 — Disciplina", "02 — Coragem", "03 — Vencer" |
| Sem botão de verdade na primeira tela | 1 | só a pílula "Patrocine" do menu |
| Contraste abaixo de 4,5:1 em 768 e 390 px | 2 | "CARTEL // NÚMEROS" 4:1; rótulos das estatísticas 4,1:1 |

Dois itens do medidor não valem para este site e não entram na conta: "0 imagens" e "sem vídeo".
As fotos são desenhadas em `<canvas>`, que o medidor não conta. Os avisos de seção fixa longa são
do formato de vídeo por scroll, que é o produto.

## O que as capturas mostram

1. **Primeira tela quase toda preta.** VISTO: no progresso 0 só aparecem o nome e os rótulos
   pequenos; a foto fica escura. Causa não medida (primeiro quadro escuro da sequência ou a
   vinheta de `Hero.tsx:58`).
2. **O mesmo título cinco vezes.** Linha branca mais palavra vermelha: Arthur / The Cannibal,
   Disciplina e / instinto, Forjado no / ringue, Movido pela / família, Por trás do / lutador. O
   tipo `Headline = { line1, highlight }` em `site.ts:20` fixa esse padrão no contrato de texto.
3. **O vermelho está em tudo**, então não marca nada: pontos, cantoneiras, rótulos, palavra
   destacada, barra de progresso, contador, fonte das citações. No Hero ele ainda disputa com a
   luz vermelha da própria foto.
4. **Texto em cima do atleta.** Os cards de vidro cobrem orelha e pescoço no desktop e olhos e
   nariz no celular (F1 do `plan-componente-sequencia.md`). No celular, o título do Cinematic
   passa sobre a cabeça e o botão "Ver números" fica sobre o abdômen.
5. **Barra inferior do Cinematic no celular quebra.** "MUAY THAI // QUARTEL", "DISCIPLINA //
   FAMÍLIA" e "CONTINUE" quebram em duas linhas e encostam na cantoneira e no card.
6. **Os números mais fortes estão pequenos.** 8-1, 3 KO e 61 kg aparecem em 24 a 30 px numa lista
   com linhas finas; metade da tela do desktop fica vazia.
7. **Rodapé de sitemap.** Seis links, todos com `href: "#"` (`site.ts`); o nome não volta grande.
8. **Contador parado.** `Hero.tsx:130` mostra `SEQ 001 / 169` fixo; o do Cinematic atualiza
   (`CinematicReveal.tsx:49`). RELATO: o roteiro (`roteiro-grade-midias.md:21`) registra que o
   cliente pediu o readout desligado. INFERIDO: o contador `SEQ` é resto do mesmo painel.

O que funciona e fica: as duas sequências são fotos reais, com luz forte, e o scroll as controla
bem. O título do Hero cabe em duas linhas nas três larguras (96, 72 e 48 px).

## Nota

Avaliação minha pela régua do `critique.md` da skill (INFERIDO, não é júri):

| Critério | Peso | Nota | Por quê |
| --- | --- | --- | --- |
| Design | 40% | 5,5 | fotos fortes sob uma camada de enfeites de template |
| Usabilidade | 30% | 5,0 | sem botão na primeira tela, texto sobre o rosto, links mortos, contraste |
| Criatividade | 20% | 5,5 | a aparência serviria a qualquer cliente do template; teto 6 pela regra |
| Conteúdo | 10% | 6,5 | texto verdadeiro e do atleta, mas curto (316 palavras) e sem destino nos links |
| **Geral** | | **5,5** | qualquer FAIL do medidor já limitaria a 6,0 |

Os três problemas principais: a fantasia de painel (itens 2, 3 e 8 e a tabela de medição); a
primeira tela sem foto visível e sem botão; texto sobre o rosto do atleta.

## Inventário do assunto

O que é só do Arthur, tirado de `perfil-comunicacao.md`:

- "Cannibal" é gíria militar ("um cara aloprado e sanguíneo") e foi o codinome dele na Força
  Tática do QGEx;
- o protetor bucal com "CANNIBAL" escrito;
- cartel 8-1: 3 nocautes, 3 decisões, 2 finalizações;
- Samurai Fight 7, em Brasília, 06/09/2025; seletiva do Jungle Fight;
- Peso Galo, 61 kg; Muay Thai desde os 16 anos;
- Equipe Kairós (Railson Rodrigues) e Brasília Luta Livre (Washington Sena);
- "Agora somos três";
- o bordão "VAMOS VENCER";
- cupom CANNIBAL nos patrocinadores Move Nutrição e No Talk.

## Direção proposta

O script da skill sorteou três direções para o briefing:

| Direção | Ideia | Decisão |
| --- | --- | --- |
| Pôster fixo (`pinned-poster`) | algo fica parado enquanto o resto muda; o nome dividido em dois cantos | **escolhida**: o site já é uma camada fixa com fotos trocando embaixo |
| Só tipografia | primeira tela só de palavras, fotos depois | descartada: esconde na abertura o melhor que o site tem |
| Nome como monumento | o nome ocupa a largura inteira | descartada como direção; o tamanho do nome entra na escolhida |

Folha completa: `node ~/.claude/skills/design-taste-frontend/scripts/draw.mjs --show` (semente
253465069, guardada em `.taste-skill/direction.json`).

**Frase da ideia.** Nesta página, o codinome que o quartel deu a ele vira o título fixo: "Arthur"
preso num canto, "The Cannibal" no canto oposto, e as fotos passam entre os dois. O Hero (luz
vermelha, sangue) é o lado do codinome; o Cinematic (família, "Agora somos três") é o lado do
nome de batismo.

Teste do concorrente: passa em parte. Dividir o nome em dois cantos serviria a qualquer lutador
com apelido. O que prende a ideia ao Arthur é a origem do apelido dita em letras grandes logo no
começo e a passagem do codinome para o nome ao longo da página.

**A coisa viva.** Recomendação: o cartel que se toca. As 9 lutas viram 9 marcas; tocar em
"nocaute", "decisão" ou "finalização" acende as lutas daquele tipo, e o "8-1" grande é formado
por elas. Usa só o que já está em `site.ts`. Alternativas: tocar para copiar o cupom CANNIBAL;
contagem regressiva para a próxima luta, a melhor das três se houver data (PENDENTE: Arthur).

### O que muda por parte

| Parte | Hoje | Proposta |
| --- | --- | --- |
| Tipografia | Geist + Geist Mono, 12 tamanhos | uma família (Schibsted Grotesk, peso 800 no título), 5 tamanhos, nada abaixo de 13 px |
| Cor | vermelho em tudo | fundo e tinta como estão; vermelho só no botão principal e nas marcas do cartel |
| Menu | vidro, pílula, mono | nome, três links e um botão cheio "Seja patrocinador" |
| Hero | cantoneiras, contador, rótulos, ponto, vinheta | nome fixo em 10 a 14vw nos dois cantos, uma frase embaixo à esquerda, botão embaixo à direita; o centro fica livre para o rosto |
| Citações do Hero | cards de vidro sobre o rosto | frase solta em tipo grande na área calma do quadro, uma por vez; `show`/`hide` iguais |
| Cinematic | etiqueta de capítulo, 01/02/03, barra inferior | mesmo título fixo; três frases sem número; sem barra |
| Números | lista mono com linhas | "8-1" ocupando a tela, legenda embaixo, a coisa viva |
| Prova | não existe | faixa com os nomes passando: equipes, eventos, patrocinadores |
| Chamada final | pílula de vidro | última foto em tela cheia, texto ao lado, um botão cheio |
| Rodapé | grade de links pequenos | foto de um lado, menu grande do outro, nome na largura toda |

**Não muda:** `ScrollSequence.tsx`, `useFramePreload.ts`, os frames, a fórmula de progresso, a
altura de `.scroll-animation`, os `show`/`hide`, o corte em tela em pé, e a regra de que todo
texto vem de `src/content/site.ts`.

### Impactos e riscos

- **Contrato de texto.** `Headline { line1, highlight }` e os campos de etiqueta, contador e barra
  inferior mudam em `SiteContent`; `TEMPLATE.md` precisa acompanhar.
- **Template ou site do Arthur.** O repositório se descreve como template (`AGENTS.md`,
  `TEMPLATE.md`) e como site do Arthur (`docs/README.md`). Uma ideia tirada do Arthur não serve
  ao próximo cliente. Precisa de decisão antes do PLAN.
- **Fotos.** A direção pede mais fotos paradas (números, chamada final, rodapé). Dá para usar
  quadros que já estão em `public/frames*/`. As outras fotos da tabela do roteiro (IMG_0554,
  IMG_7798, IMG_0438, IMG_3709) exigem autorização de leitura.
- **Título sobre a foto.** Em 10 a 14vw o nome pode cobrir o atleta em algum quadro; cada ponto
  da sequência precisa ser conferido nas três larguras.
- **Fonte.** Schibsted Grotesk está no catálogo do `next/font/google` instalado (MEDIDO); não é
  dependência nova. Não foi vista renderizada com acentos nem sobre as fotos.
- **Tamanho.** É feature grande: pede PLAN, resumo e issue antes de implementar.

## Sem medição

- A direção não foi construída; as notas são do site atual e o ganho é estimado.
- Causa da primeira tela escura. **Medido depois (2026-11-11):** a luminância média dos frames
  do Hero vai de 0,05 no frame 1 a 0,22 no frame 56; a sequência nasce quase preta de propósito
  (`media/README.md`). A hipótese de que a vinheta de `Hero.tsx` fosse a causa principal caiu; a
  parcela dela não foi isolada.
- Legibilidade do nome grande sobre os 169 quadros de cada sequência. Testada em 6 quadros num
  mock; ver `plan-redesenho-poster-fixo.md`, "Posição do título".
- Celular real, Safari e Firefox.
- Opinião do Arthur sobre nome dividido, tom e exposição dos patrocinadores na faixa.
- Validade atual dos cupons e os destinos dos seis links do rodapé e do botão de patrocínio.
- Detalhe das 9 lutas (evento, data, método de cada uma); só o total por método é conhecido.
