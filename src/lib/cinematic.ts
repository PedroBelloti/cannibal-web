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

/**
 * Marcos dos textos, em fração do scroll da seção. Convivem com os `show`/`hide` das frases em
 * `src/content/site.ts` (primeira em 0,1, última até 0,8): mexeu num, confira o outro.
 */
export const CINE_INTRO_FADE_END = 0.08;

/**
 * Troca do título: o primeiro some nos `span` antes de `at` e o segundo entra nos `span` depois.
 * Um de cada vez, porque os dois ocupam o mesmo lugar e sobrepostos viram borrão.
 */
export const CINE_TITLE_SWAP = { at: 0.5, span: 0.06 } as const;

/** Link final, depois da última frase. */
export const CINE_OUTRO = { start: 0.86, span: 0.06 } as const;
