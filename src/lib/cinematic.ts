export const CINE_FRAME_COUNT = 169;

export const cineFramePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.webp`;

/**
 * Ponto do vídeo (fração da largura do frame) que fica no centro da tela em pé. Acompanha o
 * atleta, que fica à direita do quadro: trocou os frames, reposicione.
 */
export const CINE_MOBILE_FOCUS_X = 0.68;

/** Frame fixo para `prefers-reduced-motion`: logo depois da virada da luz (media/README.md). */
export const CINE_POSTER_FRAME = 101;
