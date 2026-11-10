# Mídias do site

> **Provisório.** As sequências abaixo foram reprovadas: cada vídeo deve usar uma única foto,
> animada no estilo do template. Pendência e opções em `docs/HANDOFF.md`.

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
| `video/seq-a-hero.mp4` | foto 4 | push-in de 7 s (169 frames, 24 fps); o atleta desliza para o centro-direita |
| `video/seq-b-trajetoria.mp4` | fotos 5 → 3 → 2 | zoom lento em cada foto e fusão entre elas; a troca para a foto 2 cai em 0,48–0,56, junto com a virada do título |

Os frames do site saem do MP4 pelo script da skill `scroll-video-hero`
(`scripts/extract-frames.sh <video> <pasta>`: 169 frames WebP q80, 1920×1080).

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
- A foto 1 (sangue, fumaça vermelha, @luigimoraess) ficou de reserva para uma seção futura.
