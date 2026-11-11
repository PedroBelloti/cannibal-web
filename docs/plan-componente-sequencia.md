# PLAN: verificação da Sequência B, componente único de sequência e peso do Hero

**Status:** aprovado em 2026-11-11; fase 1 concluída; fase 3 parte A implementada e validada, sem commit · **Criado em:** 2026-11-11 ·
**Issues:** #3 (fases 1 e 2), #4 (fase 3), #5 (fase 4)

Origem: lista "Sem medição" e dívida registrada no recado de topo do `HANDOFF.md`, mais a
investigação do código feita em 2026-11-11.

## Resumo

**Objetivo.** Fechar o que a Sequência B deixou sem verificação no navegador, juntar num
componente só a lógica que `Hero.tsx` e `CinematicReveal.tsx` repetem e reduzir o que a página
baixa ao abrir.

**Por quê.** As duas seções repetem cerca de 150 linhas de canvas, pré-carga e scroll, então toda
correção é feita duas vezes e as cópias já divergem. As duas baixam os 169 frames ao abrir a
página (16,5 MB do Hero e 6,4 MB do Cinematic, medidos em 2026-11-11), e o Cinematic está abaixo
da dobra.

## Fases

| Fase | O que faz | Altera | Issue |
| --- | --- | --- | --- |
| 1 | Verificação: lint, tipos, build; console e rede na carga fria; rolagem de ida e volta; larguras 800 a 1280 px; redimensionamento cruzando 768 px | nada | #3 |
| 2 | Correções pontuais do que a fase 1 achar, uma por problema | `CinematicReveal.tsx`, `src/lib/cinematic.ts` | #3 |
| 3 | Componente único de sequência; migra o Cinematic, depois o Hero; em seguida carga adiada do Cinematic, aviso de frame com erro e `prefers-reduced-motion` | `src/components/`, `AGENTS.md` | #4 |
| 4 | Regera os frames do Hero com a qualidade da Sequência B | `public/frames/`, `media/` | #5 |

A fase 3 é feita em duas partes, cada uma em commits próprios: primeiro a migração sem mudança
de comportamento, depois as três mudanças de comportamento. Assim uma regressão na sincronia dos
cards aponta para a migração, e não para as melhorias.

## Decisões

- **Branch.** A fase 3 parte de `feat/seq-b-camadas`, que já contém a Sequência A, em branch
  novo. Não depende do merge do PR #2 para começar. Push, PR e merge seguem dependendo de pedido
  do Pedro.
- **Modelo da skill não é copiado como está.** `ScrollSequence.tsx` da skill `scroll-video-hero`
  não tem o foco horizontal do celular e usa alturas e breakpoints diferentes de
  `.scroll-animation` (`globals.css:49-63`); copiá-lo mudaria a sincronia dos cards.
- **Verificação por pixel nos 169 quadros fica fora.** Ela compara a foto com o render, não com
  os WebP servidos.
- **Fase 4.** Leitura de `~/Downloads/IMG_4230.PNG` autorizada pelo Pedro em 2026-11-11, só para
  regerar os frames do Hero.
- **Celular real.** O Pedro confere pelo dev server na rede local.

## Riscos

- Mudar o cálculo de progresso ou o índice do frame desloca os frames em relação aos cards. Os
  `show`/`hide` e as contagens de frames não mudam neste trabalho.
- Não há teste automatizado da animação; a validação é no navegador.
- Entre 769 e cerca de 1000 px o corte é centralizado e o atleta do Cinematic fica perto de 70%
  da largura do frame. INFERIDO pela regra de corte; a fase 1 mede. REFUTADO pela fase 1 para
  janela deitada (ver Resultado); o corte aparece com a tela em pé.

## Validação

- Todas as fases: `npm run lint && npx tsc --noEmit && npm run build`.
- Fase 3: frame desenhado e cards visíveis comparados antes e depois em 8 pontos de progresso
  (0; 0,1; 0,2; 0,35; 0,5; 0,6; 0,8; 1) e nas larguras 390, 1024 e 1920 px; aba de rede sem
  requisição a `/frames2/` antes de a seção se aproximar.
- Fase 4: comparação lado a lado de frames antigos e novos, aprovada pelo Pedro; peso total medido.

## Fora do escopo

Autorizações de uso das fotos, links do rodapé, emblema "D" da luva, crédito da foto 3, roteiro
v1 e vídeo vertical próprio para celular.

## Resultado

### Fase 1 (2026-11-11, sem alteração de código)

MEDIDO sobre `next start`: lint, tipos e build com código 0; os 338 frames carregam; rolagem de
ida e volta em 42 pontos por seção com frame = `floor(progresso * 169)` e nenhum card fora de
`show`/`hide`.

| # | Onde | O que acontece | Estado |
| --- | --- | --- | --- |
| F1 | Hero, 768 a 1280 px e celular | Cards sobre parte do rosto; no celular, sobre nariz e boca | visto nas capturas; decisão de layout em aberto |
| F2 | As duas seções | Redimensionar no meio da sequência deixa frame, cards e título no ponto antigo até a próxima rolagem (900 para 700 px: progresso 0,40 para 0,75) | medido; causa inferida: o resize não recalcula o progresso |
| F3 | Cinematic, tela em pé acima de 768 px | Corte centralizado mostra a faixa 0,295 a 0,705 do frame; metade do corpo sai pela direita (800×1100, 1000×1323) | medido |
| F3b | Exatamente 768 px | Layout de desktop (`md:`) com corte de celular (`<= 768`) | medido |

Hipótese refutada: com a janela deitada (altura 850), de 800 a 1280 px a cabeça do atleta do
Cinematic fica inteira e o card não a alcança.

F2, F3 e F3b passam a ser tratados na parte B da fase 3, dentro do componente novo, em vez de
correções duplicadas nas duas seções (substitui a fase 2 como descrita na tabela).

### Fase 3, parte A (2026-11-11, branch `feat/componente-sequencia`, sem commit)

`src/components/ui/ScrollSequence.tsx` (232 linhas) concentra section, sticky, canvas, loader,
pré-carga, corte e scroll. `Hero.tsx` foi de 350 para 192 linhas e `CinematicReveal.tsx` de 378
para 220.

MEDIDO antes e depois, em iframe de mesma origem nas larguras 499, 1024 e 2093 px, 8 progressos
por seção: os 48 pontos iguais em progresso, hash dos pixels do canvas, cards visíveis, opacidade
dos textos e readout. Lint, tipos e build com código 0.

Sem medição: largura abaixo de 499 px e celular real; redimensionamento cruzando 768 px (o
gerenciador de janelas não deixou redimensionar); rolagem com roda do mouse; console e rede; os
169 frames um a um.

Achado do site atual, igual antes e depois: o scroll posicionado por script cai em 0,0999,
0,3498 e 0,5998, logo abaixo de `show`, e o card não aparece nesses pontos. Causa provável,
não medida: arredondamento do scroll para pixel físico com zoom 0,906.

### Fase 4 (2026-11-11, candidatos prontos, `public/frames` sem alteração)

A premissa "regerar com a qualidade da Sequência B" caiu. MEDIDO: as duas sequências usam os
mesmos parâmetros WebP (1600 px, q70, `extract-frames.sh`), e a extração do
`media/seq-a/seq-a.mp4` em q70 reproduz os 169 frames atuais byte a byte. O Hero tem cerca de 3
vezes mais detalhe fino que o Cinematic (medido em 4 quadros); o peso vem do conteúdo. A foto de
origem não foi aberta.

| Conjunto | Total | Média | SSIM-Y médio | SSIM-Y pior |
| --- | --- | --- | --- | --- |
| atual q70 | 17,31 MB | 102,4 KB | 0,9426 | 0,9324 |
| q60 | 14,86 MB | 87,9 KB | 0,9354 | 0,9232 |
| q50 | 12,74 MB | 75,4 KB | 0,9277 | 0,9133 |
| q40 | 10,57 MB | 62,6 KB | 0,9176 | 0,9005 |

SSIM contra o MP4 decodificado em PNG, nos 169 frames. Candidatos e comparações em
`/tmp/hero-frames-PWiP/` (some num reboot; regerar com
`extract-frames.sh media/seq-a/seq-a.mp4 <saida> 169 1600 <qualidade>`).

PENDENTE (Pedro): escolher o candidato. Sem medição: página rolando com os candidatos, tela de
alta densidade, celular (onde o corte amplia o rosto), AVIF e frames menores para celular.

### Fase 3, parte B

PENDENTE: aguarda o commit da parte A.
