# PLAN: Sequência A (Hero) por camadas locais

**Status:** aprovado em 2026-11-10, implementado e validado localmente, commit `f8f8c66`, PR #2 aberto · **Criado em:** 2026-11-10 · **Issue:** #1

Origem: decisão registrada em `HANDOFF.md` (recado de 10/11/2026). Substitui a Sequência A descrita
em `roteiro-grade-midias.md` (foto 4, 2.5D por profundidade), que foi reprovada.

## Resumo

**Objetivo.** Trocar os frames provisórios do Hero por uma tomada contínua de 7 s feita com uma
única foto (foto 1, close com sangue e fumaça vermelha), em que a câmera parece se aproximar do
atleta e o ambiente se move, sem alterar nenhuma pessoa da foto.

**Como.** A foto é separada em duas camadas: o atleta (com máscara) e o fundo. O atleta cresce um
pouco mais rápido que o fundo, o que dá a sensação de profundidade de uma câmera avançando. Por
cima só do fundo entram fumaça em movimento, partículas e uma variação lenta da luz vermelha.

**O que muda no repositório.**

- `public/frames/`: os 169 WebP são substituídos.
- `media/seq-a/`: script de render, máscaras, `seq-a.mp4` e `poster.jpg`.
- `media/video/seq-a-hero.mp4`: removido (versão reprovada; fica no histórico do git).
- `src/content/site.ts` e `src/components/sections/Hero.tsx`: só se os tempos dos cards e do
  texto precisarem ser reposicionados para o vídeo novo.
- `media/README.md`, `HANDOFF.md`, `roteiro-grade-midias.md`: atualizados.

**O que não muda.** Sequência B, textos do site, paleta, contagem de frames (169).

## Fatos medidos (2026-11-10)

- Foto 1 (`~/Downloads/IMG_4230.PNG`): 5056x3368, proporção 3:2, arquivo JPEG apesar da extensão.
- Recorte 16:9 na largura total: 5056x2844, ou seja, 2,63 vezes a saída de 1920x1080. Sobra
  resolução para o zoom sem ampliar pixel.
- O topo da cabeça e a assinatura "@luigimoraess" ficam no alto da foto; os 524 px que o 16:9
  descarta saem de baixo.
- Nesta máquina há ImageMagick e ffmpeg. Não há numpy, OpenCV, Pillow nem ferramenta de
  segmentação.
- `public/frames/` atual: 169 arquivos, 9,1 MB.

## Decisões

| Decisão | Motivo | Alternativa descartada |
|---|---|---|
| Movimento de aproximação: atleta de 1,00 a 1,38, fundo de 1,00 a 1,12, ambos a partir de um ponto na base do pescoço (substitui a primeira versão, 1,12 e 1,04, aprovada mas considerada fraca) | Como o atleta só cresce sobre o fundo, quase nenhuma área escondida é revelada, então não é preciso inventar fundo atrás dele | Deslocamento lateral entre camadas: revela uma faixa atrás do atleta, encostada no homem desfocado, que teria de ser redesenhada |
| Homem desfocado ao fundo ganha máscara própria e fica fora de todo efeito de ambiente | É pessoa; não pode ser alterado nem apagado | Tratá-lo como fundo comum: a fumaça e a luz mudariam os pixels dele |
| Fumaça, partículas e luz são procedurais (ruído gerado por código), só sobre o fundo | Não usa IA generativa e é reproduzível pelo script | Gerar o ambiente no Higgsfield (opção 3 do HANDOFF): custa créditos e não foi a opção escolhida |
| Máscara do atleta por segmentação local (`rembg`), revisada a olho e corrigida | Borda de cabelo raspado, orelha e mão é difícil de traçar à mão | Polígono manual no ImageMagick: fica como plano B se a segmentação falhar |
| Ambiente Python isolado fora do repositório (`uv`, Python 3.12, numpy, OpenCV, rembg) | O projeto é Node; a ferramenta de render não vira dependência do site | Fazer tudo com ImageMagick e ffmpeg: fumaça e partículas ficam inviáveis de afinar |
| Revelação pela luz no primeiro terço: o quadro começa quase na cor do site e a luz se espalha a partir do clarão vermelho (substitui "frame 1 é a foto sem efeito") | Dá o impacto pedido sem redesenhar nada: é só um escurecimento do quadro inteiro, que termina no quadro 55 | Movimento 3D por IA generativa de vídeo: redesenha o rosto. Viagem de câmera pela foto: não escolhida |
| A verificação por pixel roda no quadro antes da revelação; o pôster é o quadro 56 | Com a revelação o quadro 1 é quase preto e não serve de pôster nem de referência | |
| Frames do site em WebP 1600 px q70 pelo `extract-frames.sh` da skill (17 MB; em 1920 px q80 seriam 35 MB) | É o formato que `src/lib/hero.ts` lê e o caminho registrado em `media/README.md` | Guardar também `frames/0001.jpg` a `0169.jpg` em `media/seq-a/`, como o HANDOFF citava: duplicaria cerca de 30 MB no git sem leitor |

## Etapas

1. Criar o branch `feat/seq-a-camadas` a partir de `main`.
2. Montar o ambiente Python isolado no diretório temporário da sessão.
3. Gerar a máscara do atleta e a do homem ao fundo; conferir as duas sobrepostas à foto e
   corrigir bordas. **Ponto de parada: mostro as máscaras antes de renderizar.**
4. Escrever `media/seq-a/render.py` (parâmetros de zoom, fumaça, partículas e luz no topo do
   arquivo) e renderizar 169 quadros em 1920x1080.
5. Rodar a verificação por pixel (abaixo) e montar `seq-a.mp4` (24 fps) e `poster.jpg`.
6. **Ponto de parada: mostro a folha de contato e o MP4 para aprovação do movimento.**
7. Extrair os WebP para `public/frames/` e remover `media/video/seq-a-hero.mp4`.
8. Rolar o Hero no navegador (desktop e 390 px de largura) e reposicionar, se preciso, os
   `show`/`hide` dos cards em `site.ts` e os tempos fixos em `Hero.tsx:149-155`.
9. Atualizar `media/README.md`, `HANDOFF.md` e o trecho da Sequência A no roteiro.

## Validação

| Verificação | Risco que cobre | Critério |
|---|---|---|
| Quadros 56, 85 e 169 com revelação comparados (`magick compare -metric AE`) com os mesmos sem revelação | Revelação vazando além do primeiro terço | 0 |
| Em 5 quadros (1, 43, 85, 127, 169): região interna da máscara do atleta comparada com a foto original passada pela mesma escala | Fumaça, luz ou partícula sobre o atleta | 0 |
| Mesma comparação na máscara do homem ao fundo | Alteração de outra pessoa | 0 |
| Assinatura "@luigimoraess" legível no quadro 1 e presente no enquadramento | Crédito do fotógrafo cortado | visual, no quadro 1 |
| Detecção de corte de cena do `extract-frames.sh` | Salto no scroll | 0 cortes |
| `npm run lint && npx tsc --noEmit && npm run build` | Quebra do site | sem erro |
| Rolagem no navegador, ida e volta, desktop e mobile | Animação, leitura do título e dos cards sobre o vídeo | visual |

A escala reamostra a imagem: os pixels do atleta mudam de posição e tamanho, não de conteúdo. É
isso que a comparação contra a foto escalada mede.

## Resultado (2026-11-10)

MEDIDO:

- Atleta e regiões protegidas: 0 pixel diferente da foto escalada nos quadros 1, 43, 85, 127 e
  169, antes da revelação. Quadros 56, 85 e 169 idênticos com e sem revelação.
- Fundo preenchido visível no último quadro: 14.662 px (7.364 dentro de região protegida, contando a borda suave); nenhum junto ao homem ao fundo.
- `public/frames/`: 169 WebP, 1600x900, 17 MB (antes 9,1 MB). 0 cortes de cena.
- `npm run lint`, `npx tsc --noEmit` e `npm run build`: sem erro.
- Navegador: os 169 frames carregam; Hero rolado em tela larga
  (proporção perto de 2:1) e em 390x844.

Ajustes no site depois do primeiro teste no navegador (mesmo dia):

- O título grande do Hero cobria a boca e o queixo do atleta. Ficou com metade do tamanho
  (`clamp(2.5rem,4.6vw,5.5rem)`, largura máxima de 30%) e agora cabe na fumaça, à esquerda.
- O crédito do fotógrafo dentro do frame ficava atrás da barra de navegação ou fora do corte.
  Virou texto do site (`hero.photoCredit` em `site.ts`), sempre visível; o crédito dos frames
  continua lá.
- Em 390 px aparecia só um close da faixa central. O zoom extra de 1,3 saiu e o corte passou a
  ser centrado em `MOBILE_FOCUS_X` (`src/lib/hero.ts`), o que mostra testa, olho, nariz e boca.
- O começo escuro (primeiros 11% do scroll) foi mantido: é a revelação aprovada, e o título
  principal é lido sobre ela.

Visto no navegador depois dos ajustes: tela larga (2093x1018) em 50% e 95% do scroll, e 390x844
em 3%, 20%, 50%, 70% e 95%.

Sem medição: tela exatamente 16:9, larguras entre 768 e 1280 px, celular real, tempo de
carregamento dos 17 MB em rede móvel.

## Riscos e lacunas

- **Canto inferior esquerdo da foto**: há formas desfocadas (cordas, um objeto branco e uma
  mancha vermelha). Se alguma for parte de uma pessoa, entra na máscara de pessoas. Decido na
  etapa 3, olhando a foto em resolução cheia, e registro o que foi visto.
- **Mão do atleta** (polegar, embaixo à esquerda): é o ponto onde o crescimento do atleta pode
  revelar um pouco de fundo. Se acontecer, a área revelada é preenchida com o fundo desfocado
  vizinho, que é fumaça.
- **Cards do Hero** ficam à direita, sobre o homem desfocado e o ombro. Legibilidade só se
  confirma no navegador.
- **Peso**: a foto tem mais detalhe que a atual; os 169 WebP podem passar de 9,1 MB. Informo o
  tamanho final.
- **Autorizações** do Arthur e do fotógrafo (@luigimoraess) para animar a foto continuam sem
  registro (`perfil-comunicacao.md` §8). Não bloqueia o trabalho local; bloqueia publicar.
- **Não coberto**: vídeo vertical próprio para mobile (o celular usa um corte do 16:9), `prefers-reduced-motion`, Sequência B e a v2 do
  roteiro.
