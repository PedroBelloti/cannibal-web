# PLAN: Sequência B (Cinematic) por camadas locais

**Status:** aprovado em 2026-11-10; primeira versão reprovada no mesmo dia; segunda versão (arco de câmera e mais detalhe) implementada, **aprovada pelo Pedro e validada no navegador em 2026-11-10** (ver "Resultado") · **Criado em:** 2026-11-10 · **Issue:** #3

Origem: decisão registrada em `HANDOFF.md` (recado de 10/11/2026). Substitui a Sequência B atual
(`media/video/seq-b-trajetoria.mp4`, três fotos com fusão, reprovada) e o trecho "Sequência B
(Cinematic), gerada no Higgsfield" de `roteiro-grade-midias.md`. Mesmo método da Sequência A
(`plan-sequencia-a.md`).

## Resumo

**Objetivo.** Trocar os frames provisórios da seção "A trajetória" por uma tomada contínua de 7 s
feita com uma única foto (foto 3, o atleta de cabeça baixa no treino), sem alterar o atleta.

**Como.** A câmera começa aberta, com a academia inteira e o atleta à direita, e se aproxima até
o plano da cintura para cima fazendo um arco: anda para a esquerda e desce, e a parede gira em
perspectiva atrás do atleta. O atleta cresce mais rápido que o fundo, o que dá profundidade. No
meio do scroll a luz do fundo passa de fria para quente, no mesmo ponto em que o título troca de
"Forjado no ringue" para "Movido pela família". Feixe de luz, névoa, poeira em três planos, sombra
e foco são gerados por código, só no fundo.

**O que muda no repositório.**

- `public/frames2/`: os 169 WebP são substituídos.
- `media/seq-b/`: script de render, máscara, `seq-b.mp4` e `poster.jpg`.
- `media/`: a parte do `seq-a/render.py` que serve às duas sequências vira um módulo comum.
- `media/video/seq-b-trajetoria.mp4` e os stills que ficam sem uso (fotos 2, 4 e 5): removidos.
- `src/lib/cinematic.ts` e `src/components/sections/CinematicReveal.tsx`: corte do celular
  seguindo o atleta, como no Hero. Tempos dos cards e posição do título, só se o navegador pedir.
- `src/content/site.ts` e `TEMPLATE.md`: crédito do fotógrafo da foto 3, se houver.
- `media/README.md`, `HANDOFF.md`, `roteiro-grade-midias.md`, `AGENTS.md`: atualizados.

**O que não muda.** Sequência A, textos do site, paleta, contagem de frames (169).

## Fatos medidos (2026-11-10)

- Foto 3 (`~/Downloads/IMG_4843.PNG`): 1023x1537, em pé, arquivo JPEG apesar da extensão.
- `media/stills/foto3-16x9-estendida.jpg`: 2752x1536. A foto original ocupa de x 1324 a x 2345
  (escala 0,99926); o que está à esquerda e à direita disso foi desenhado por IA (outpaint).
- Diferença entre o still e a foto original alinhada: concentrada nas duas emendas (faixas de
  66 px em x 1317 e x 2287), no texto do saco, nos logos das duas luvas e em dois logos do short.
- No rosto e no tronco o still **não é cópia exata** da foto: diferença média de 3 níveis (de
  255), máxima de 32 no rosto e 40 no tronco. INFERIDO: é ruído de redimensionar e regravar em
  JPEG, não redesenho; o mapa de diferenças não mostra nenhuma forma, só pontos soltos.
- Hipótese descartada: uma primeira comparação, sem alinhar a escala, acusou um bloco alterado
  sobre o tronco inteiro. Com o alinhamento (2933 pontos de encaixe) o bloco sumiu; era
  desalinhamento de 6 px.
- Na ponta esquerda do still (x 350 a 580) há dois retângulos de borda reta na parede, artefato
  do outpaint. Aparecem no quadro aberto.
- Resolução: com o quadro aberto mostrando o still inteiro, o atleta pode crescer até 1,70 vez
  em frames de 1600 px sem ampliar pixel.
- `public/frames2/` atual: 169 arquivos, 14 MB.

## Decisões

| Decisão | Motivo | Alternativa descartada |
|---|---|---|
| Quadro inicial quase aberto (zoom 1,06 nas duas camadas); o atleta vai até 1,62 e o fundo até 1,25, a partir da base do pescoço. Substitui 1,00 a 1,50 e 1,00 a 1,16 da primeira versão | O 1,06 inicial é a folga que a perspectiva e o deslocamento do fundo consomem sem descobrir a borda (MEDIDO: 0 px descoberto); 1,62 fica abaixo do limite de 1,70 | Manter 1,00 no início: o giro do fundo mostraria a borda do still |
| Arco de câmera só no fundo: perspectiva (giro de -0,07 a 0,17 e inclinação até -0,07) e deslocamento de 60 px para a esquerda em relação ao atleta, concentrados entre 0,22 e 0,80 do scroll | É o pedido de mudança de ângulo; o atleta continua só escalado e deslocado, então a verificação por pixel segue em 0 | Girar também o atleta em perspectiva: deforma a pessoa, depende de pedido expresso |
| O fundo desliza para a esquerda, e não para a direita | Desse lado o que aparece atrás do atleta é parede lisa, onde o preenchimento não se nota; para a direita apareceria o lado escondido do saco | Deslizar para a direita |
| Detalhes só no fundo: feixe de luz com raios, névoa em dois ruídos, três planos de poeira com profundidade, sombra suave do atleta, foco que diminui com a aproximação e pulsa na virada, vinheta | É o pedido de mais detalhe, sem aplicar nada sobre o atleta | Luz, névoa ou poeira na frente do atleta: muda os pixels dele |
| A camada do atleta sai da **foto original**, não do still; do still entram só o fundo e as laterais | O still tem ruído de regravação no rosto; com a foto original a verificação por pixel volta a dar 0 exato, como na A | Usar o still inteiro: a verificação teria de aceitar uma tolerância |
| Logos das luvas e do short desfocados de novo sobre a foto original, nas mesmas caixas do still | Regra do roteiro (nenhum logo legível no vídeo) e orientação do HANDOFF | Deixar os logos: contraria a regra |
| Retângulos da parede esquerda suavizados no fundo | São artefato de IA na parede, sem pessoa; ficam atrás dos cards | Cortar o quadro a partir de x 600: o atleta perde percurso e o quadro deixa de ser aberto |
| Luz fria para quente entre 0,48 e 0,58 do scroll, só no fundo | Acompanha a troca do título sem tocar no atleta | Esquentar o quadro inteiro: muda a cor da pele. Foi prévia na primeira versão, não foi escolhida, e a opção saiu do script |
| Sem o começo escuro da Sequência A | A seção entra por rolagem logo depois do Hero; duas revelações seguidas repetem o efeito | Repetir a revelação pela luz |
| O saco de pancadas fica parado | Ele passa atrás do braço do atleta; balançar o saco exigiria redesenhar o que o braço esconde | Animar o saco |
| Motor comum em `media/` com uma configuração por sequência | `seq-b/render.py` seria a segunda cópia de cerca de 300 linhas; cerca de 80% é igual (zoom, máscaras, ruído, verificação) | Copiar o arquivo: mais rápido agora, e toda correção teria de ser feita duas vezes |
| Corte do celular por `CINE_MOBILE_FOCUS_X` em `src/lib/cinematic.ts`, sem o zoom de 1,3 | Mesmo ajuste do Hero; o atleta fica a 65% da largura, fora do corte central | Juntar agora `Hero.tsx` e `CinematicReveal.tsx` num componente só: é a dívida conhecida, mas mexe no Hero recém-validado. Fica como recomendação separada |
| Frames em WebP 1600 px q70 | Mesmo padrão da Sequência A | 1920 px q80 |

## Etapas

1. Criar a issue no GitHub e o branch `feat/seq-b-camadas` a partir de `feat/seq-a-camadas` (ou de
   `main`, se o PR #2 já tiver sido aceito).
2. Extrair o motor comum de `media/seq-a/render.py` e conferir que a Sequência A não mudou.
3. Montar a base da B (fundo do still, atleta da foto original, logos desfocados, parede
   suavizada) e gerar a máscara do atleta. **Ponto de parada: mando a máscara e a base.**
4. Renderizar os 169 quadros em duas versões: luz só no fundo e luz no quadro inteiro.
5. Rodar a verificação por pixel e montar os MP4 e o pôster.
6. **Ponto de parada: mando as duas prévias para você escolher.**
7. Extrair os WebP para `public/frames2/` e remover o vídeo antigo e os stills sem uso.
8. Ajustar o corte do celular, rolar a seção no navegador (tela larga e 390 px) e reposicionar
   cards e título se cobrirem o atleta.
9. Atualizar os documentos e pedir autorização de commit.

## Validação

| Verificação | Risco que cobre | Critério |
|---|---|---|
| 5 quadros da Sequência A renderizados antes e depois da extração do motor, comparados (`magick compare -metric AE`) | A extração mudar a Sequência A | 0 |
| Em 5 quadros (1, 43, 85, 127, 169): região interna da máscara do atleta, fora das caixas dos logos, comparada com a foto original na mesma escala | Luz ou poeira sobre o atleta | 0 |
| Pixels de fundo revelados pelo crescimento do atleta, contados e vistos no último quadro | Remendo visível entre o braço e o saco | visual |
| Detecção de corte de cena do `extract-frames.sh` | Salto no scroll | 0 cortes |
| `npm run lint && npx tsc --noEmit && npm run build` | Quebra do site | sem erro |
| Rolagem no navegador, ida e volta, tela larga e 390 px | Título, texto e cards sobre o atleta; rosto no corte do celular | visual |

Na versão com a luz no quadro inteiro a comparação por pixel roda antes da mudança de cor, como
foi feito com a revelação da Sequência A.

## Riscos e lacunas

- **Título sobre o ombro.** No fim do scroll o bloco de título e texto, no alto à direita, encosta
  no ombro do atleta (INFERIDO pelo esboço de enquadramento; as zonas são estimadas a partir do
  CSS). Se confirmar no navegador, o bloco é reduzido ou reposicionado, como no Hero.
- **Sombra na parede esquerda.** `media/README.md` registra que o outpaint desenhou ali uma
  sombra com forma humana e que o enquadramento antigo começava depois dela (x ≥ 1124). O quadro
  aberto deste PLAN volta a mostrar essa área. INFERIDO: são os dois retângulos citados nos fatos
  medidos; no esboço não se lê uma pessoa. Decisão sua no primeiro ponto de parada: suavizar (o
  proposto) ou começar o quadro em x 1124, com o atleta mais ao centro e menos percurso.
- **Fresta entre o braço e o saco.** O fundo ali tem estrutura (saco, parede); o preenchimento
  pode aparecer mais do que na A, onde era fumaça.
- **Máscara.** O saco é escuro e encosta no braço; a segmentação pode pegar parte dele.
- **Fotógrafo da foto 3.** Resolvido: RELATO (Pedro, 2026-11-10): a foto é de autoria do Arthur e
  não precisa de crédito. A seção fica sem crédito.
- **Peso.** Tamanho final dos 169 WebP só depois da extração.
- **Autorizações** do Arthur e dos fotógrafos continuam sem registro. Não bloqueia o trabalho
  local; bloqueia publicar.
- **Não coberto:** vídeo vertical próprio para celular, `prefers-reduced-motion`, junção de
  `Hero.tsx` e `CinematicReveal.tsx`, as partes do roteiro v1 que ainda falam da pausa.

## Resultado (2026-11-10, segunda versão)

Todas as etapas feitas. RELATO (Pedro, 2026-11-10): o movimento "atende perfeitamente"; o
emblema dourado "D" da luva direita fica sem desfoque.

MEDIDO:

- Verificação por pixel nos quadros 1, 43, 85, 127 e 169: 0 pixel do atleta diferente da foto
  original passada pela mesma transformação, fora das caixas dos logos (238.269 a 388.092
  pixels conferidos por quadro).
- Fundo preenchido visível: máximo de 44.776 px no quadro 168 (2,2% do quadro). Visto em recorte
  no último quadro: fica na parede lisa à esquerda do atleta e atrás do braço, sem remendo
  aparente.
- Borda do fundo descoberta pela perspectiva: 0 px nos 169 quadros.
- `media/seq-b/seq-b.mp4`: 7,04 s, 4,7 MB. `public/frames2/`: 169 WebP, 6,8 MB (antes 14 MB),
  0 cortes de cena. Diferença média entre quadros vizinhos de 0,96 a 2,94 níveis, pico no
  quadro 92 (a virada).
- Posição do atleta: centro do corpo de 69% a 73% da largura; cabeça entre 58% e 71%.
  `CINE_MOBILE_FOCUS_X` fica em 0,68.
- Sequência A renderizada de novo depois da mudança em `particle_layer`: 0 pixel diferente nos
  quadros 1, 43, 85, 127 e 169.
- `npm run lint`, `npx tsc --noEmit` e `npm run build`: sem erro.

Removidos: `media/video/seq-b-trajetoria.mp4`, `media/stills/foto2-logos-desfocados.jpg`,
`media/stills/foto4-16x9-estendida.jpg`, `media/stills/foto5-16x9-recorte.jpg`.

### Navegador (2026-11-10, localhost, progresso 0,05 a 0,95)

VISTO em 2093x962, 1280x720 e 390x844: com o atleta à direita do quadro, o título e o texto no
alto à direita cobriam ombro e cabeça. Mudanças em `CinematicReveal.tsx`:

- título, selo e texto foram para o alto à esquerda, sobre a parede vazia;
- os três cards do desktop ficam no mesmo lugar, embaixo à esquerda (só um aparece por vez);
- no celular o texto de apoio (`cinematic.lead`) não aparece e os cards ficam na base da tela,
  para o rosto ficar livre.

O botão do fim continua embaixo à direita, sobre o antebraço do atleta, longe do rosto.

## Sem medição

- Verificação por pixel só nos quadros 1, 43, 85, 127 e 169.
- Larguras entre 768 e 1280 px, celular real e rede móvel (o teste de 390 px foi num iframe).
- Console do navegador: a leitura começou depois da carga da página; nenhum erro apareceu na
  rolagem, mas a carga em si não foi lida.
- Se a luz só no fundo parece natural ao lado do atleta sem mudança de cor.
