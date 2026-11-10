# Mídias do site

> **Provisório na Sequência B.** `video/seq-b-trajetoria.mp4` foi reprovado: cada vídeo deve
> usar uma única foto. A Sequência A já foi refeita assim (`seq-a/`). Pendência em
> `docs/HANDOFF.md`.

Fonte dos frames em `public/frames/` (Hero) e `public/frames2/` (Trajetória). Regra do cliente:
**nenhum rosto ou pessoa das fotos pode ser alterado**. Toda imagem aqui foi verificada por
comparação de pixels contra a foto original.

## Arquivos

| Arquivo | Origem | O que foi feito |
|---|---|---|
| `stills/foto4-16x9-estendida.jpg` | Foto 4, © m2l.cs | Logos das luvas e do short desfocados; laterais estendidas (outpaint Higgsfield) e a foto original colada por cima |
| `stills/foto3-16x9-estendida.jpg` | Foto 3 | Logos e o texto "BROTHERS" do saco desfocados (máscara que não encosta no braço); laterais estendidas como na foto 4 |
| `stills/foto5-16x9-recorte.jpg` | Foto 5 | Logos desfocados; **só recorte** 16:9, sem IA |
| `stills/foto2-logos-desfocados.jpg` | Foto 2, vitória | Logos do short desfocados; **sem IA**; a sequência usa uma panorâmica vertical dela |
| `seq-a/seq-a.mp4` | Foto 1, © luigimoraess | 7 s (169 frames, 24 fps), gerado por `seq-a/render.py`: atleta e fundo em escalas diferentes, fumaça, partículas e luz só no fundo, revelação pela luz no começo; **sem IA**. Decisões em `docs/plan-sequencia-a.md` |
| `seq-a/mask-atleta.png` | Foto 1 | máscara do atleta (`seq-a/make_mask.py`, rembg `bria-rmbg`) |
| `seq-a/poster.jpg` | Foto 1 | quadro 56 da sequência, o primeiro com a cena toda acesa |
| `video/seq-b-trajetoria.mp4` | fotos 5 → 3 → 2 | zoom lento em cada foto e fusão entre elas; a troca para a foto 2 cai em 0,48–0,56, junto com a virada do título |

Os frames do site saem do MP4 pelo script da skill `scroll-video-hero`
(`scripts/extract-frames.sh <video> <pasta> [frames] [largura] [qualidade]`). Sequência B:
padrão do script (WebP q80, 1920×1080). Sequência A: `169 1600 70`, porque a foto 1 comprime
mal (MEDIDO: 35 MB em 1920 q80, 17 MB em 1600 q70).

## Por que o outpaint é colado por baixo da foto

MEDIDO em 2026-11-10: o outpaint do Higgsfield **redesenha a imagem inteira**, inclusive o rosto
(o protetor "CANNIBAL" virou uma arcada de dentes; olhos e pele mudaram). Por isso o resultado do
modelo é usado só nas laterais novas: a foto original é colada de volta na posição medida, com a
emenda suavizada em 40 px nas bordas. Depois disso a diferença no rosto e no corpo é 0 pixel.

Nas fotos 2 e 5 o outpaint **inventou pessoas** (cinegrafista, homem de camisa preta, plateia,
o resto do corpo do árbitro) e marcas falsas. Esses resultados foram descartados: as duas fotos
entram só recortadas. Na foto 3 o modelo desenhou uma sombra com forma humana na parede da
esquerda; o enquadramento da sequência começa depois dela (x ≥ 1124 na imagem estendida).

## Como verificar de novo

Compare uma caixa do rosto na foto original (reduzida à mesma altura) com a mesma caixa na imagem
final: `magick compare -metric AE <original> <final> null:` precisa dar `0`.

## Pendências

- Autorização de uso das fotos pelos fotógrafos (@m2l.cs, @luigimoraess, Foguinho Clicks).
