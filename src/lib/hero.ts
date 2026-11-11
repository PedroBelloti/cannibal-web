/** Id da section do Hero; a navbar lê o progresso dela para saber o que mostrar. */
export const HERO_SECTION_ID = "inicio";

export const FRAME_COUNT = 169;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.webp`;

export const HERO_TEXT_FADE_END = 0.08;

/**
 * Ponto do vídeo (fração da largura do frame) que fica no centro da tela em pé, onde só uma
 * faixa vertical do frame 16:9 aparece. Acompanha o assunto do vídeo: trocou os frames,
 * reposicione.
 */
export const MOBILE_FOCUS_X = 0.42;

/** Frame fixo para `prefers-reduced-motion`: o primeiro com a cena toda acesa (media/README.md). */
export const POSTER_FRAME = 56;
