# Mídias do site

Fonte dos frames em `public/frames/` (Hero) e `public/frames2/` (Trajetória). Regra do cliente:
**nenhum rosto ou pessoa das fotos pode ser alterado**. Toda imagem aqui foi verificada por
comparação de pixels contra a foto original.

## Arquivos

| Arquivo | Origem | O que foi feito |
|---|---|---|
| `stills/foto3-16x9-estendida.jpg` | Foto 3 | Logos e o texto "BROTHERS" do saco desfocados (máscara que não encosta no braço); laterais estendidas por outpaint (Higgsfield) e a foto original colada por cima. Na Sequência B entra só como fundo |
| `seq-a/seq-a.mp4` | Foto 1, © luigimoraess | 7 s (169 frames, 24 fps), gerado por `seq-a/render.py`: atleta e fundo em escalas diferentes, fumaça, partículas e luz só no fundo, revelação pela luz no começo; **sem IA**. Decisões em `docs/plan-sequencia-a.md` |
| `seq-a/mask-atleta.png` | Foto 1 | máscara do atleta (`seq-a/make_mask.py`, rembg `bria-rmbg`) |
| `seq-a/poster.jpg` | Foto 1 | quadro 56 da sequência, o primeiro com a cena toda acesa |
| `seq-b/seq-b.mp4` | Foto 3 | 7 s (169 frames, 24 fps), gerado por `seq-b/render.py`: o atleta sai da foto original e só é escalado e deslocado; o fundo ganha arco de câmera em perspectiva, feixe de luz, névoa, poeira em três planos, sombra e foco; **sem IA** no render. Decisões em `docs/plan-sequencia-b.md` |
| `seq-b/mask-atleta.png` | Foto 3 | máscara do atleta (`seq-b/make_mask.py`, rembg `bria-rmbg`) |
| `seq-b/poster.jpg` | Foto 3 | quadro 101 da sequência, logo depois da virada da luz |
| `layered.py` | | motor comum das duas sequências (zoom, matrizes de câmera, preenchimento, ruído, partículas) |

Os frames do site saem do MP4 pelo script da skill `scroll-video-hero`
(`scripts/extract-frames.sh <video> <pasta> [frames] [largura] [qualidade]`): a Sequência A com
`169 1600 60` e a B com `169 1600 70`. MEDIDO: a foto 1 dá 35 MB em 1920 q80, 17,3 MB em 1600
q70 e 14,9 MB em 1600 q60; a Sequência B dá 6,8 MB em 1600 q70. A comparação de q70, q60, q50 e
q40 da Sequência A está em `docs/plan-componente-sequencia.md` (issue #5).

## Por que o outpaint é colado por baixo da foto

MEDIDO em 2026-11-10: o outpaint do Higgsfield **redesenha a imagem inteira**, inclusive o rosto
(o protetor "CANNIBAL" virou uma arcada de dentes; olhos e pele mudaram). Por isso o resultado do
modelo é usado só nas laterais novas: a foto original é colada de volta na posição medida, com a
emenda suavizada em 40 px nas bordas. Depois disso a diferença no rosto e no corpo é 0 pixel.

Nas fotos 2 e 5 o outpaint **inventou pessoas** (cinegrafista, homem de camisa preta, plateia,
o resto do corpo do árbitro) e marcas falsas. Esses resultados foram descartados e os stills
dessas fotos saíram do repositório. Na foto 3 o modelo desenhou uma sombra na parede da
esquerda; a Sequência B mostra essa área e a suaviza no fundo (ver `docs/plan-sequencia-b.md`).

## Como verificar de novo

Compare uma caixa do rosto na foto original (reduzida à mesma altura) com a mesma caixa na imagem
final: `magick compare -metric AE <original> <final> null:` precisa dar `0`.

Nas sequências por camadas, rode o render com `--verify`: ele compara o atleta de cada quadro
conferido com a foto original passada pela mesma transformação e precisa dar 0 pixel diferente.

## Pendências

- Autorização de uso das fotos pelos fotógrafos (@m2l.cs, @luigimoraess, Foguinho Clicks).
