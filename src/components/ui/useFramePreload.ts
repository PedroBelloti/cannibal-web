import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Options = {
  frameCount: number;
  /** Caminho do frame `n`, começando em 1; precisa ser estável entre renders. */
  framePath: (n: number) => string;
  /** Enquanto falso, nada é baixado. */
  enabled: boolean;
  /** Índice (base 0) do único frame a baixar; sem ele, baixa todos. */
  onlyIndex?: number;
  /** Chamado a cada frame resolvido depois da primeira passada, para trocar um substituto. */
  onLateFrame?: () => void;
};

// Um frame a cada 16 forma a primeira passada (11 de 169): é o que segura o loader. Os passos
// seguintes preenchem os buracos ao meio até ter todos.
const FIRST_PASS_STRIDE = 16;
const STRIDES = [FIRST_PASS_STRIDE, 8, 4, 2, 1];

/** Ordem de download: primeira passada (com o último frame), depois cada vez mais fina. */
function priorityOrder(frameCount: number): { order: number[]; firstPass: number } {
  const seen = new Set<number>();
  const order: number[] = [];
  const add = (i: number) => {
    if (!seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  let firstPass = 0;
  STRIDES.forEach((stride, n) => {
    for (let i = 0; i < frameCount; i += stride) add(i);
    if (n === 0) {
      add(frameCount - 1);
      firstPass = order.length;
    }
  });
  return { order, firstPass };
}

const isDrawable = (img: HTMLImageElement | undefined): img is HTMLImageElement =>
  !!img && img.complete && img.naturalWidth > 0;

function ensureImage(cache: Map<number, HTMLImageElement>, index: number, path: string) {
  const cached = cache.get(index);
  if (cached) return cached;
  const img = new Image();
  img.src = path;
  cache.set(index, img);
  return img;
}

function whenSettled(img: HTMLImageElement, signal: AbortSignal, onSettled: () => void) {
  // Imagem já resolvida (inclusive com erro) não dispara evento de novo.
  if (img.complete) {
    queueMicrotask(() => {
      if (!signal.aborted) onSettled();
    });
    return;
  }
  img.addEventListener("load", onSettled, { once: true, signal });
  img.addEventListener("error", onSettled, { once: true, signal });
}

function reportFailures(paths: string[], images: HTMLImageElement[], reported: Set<string>) {
  const failed = paths.filter((path, i) => !images[i].naturalWidth && !reported.has(path));
  if (failed.length === 0) return;
  failed.forEach((path) => reported.add(path));
  console.error(
    `[ScrollSequence] ${failed.length} de ${paths.length} frames não carregaram; ` +
      "o desenho usa o frame válido anterior.",
    failed,
  );
}

/** Frame desenhável mais próximo antes de `index`; se não houver, o primeiro depois. */
function pickFrame(cache: Map<number, HTMLImageElement>, index: number, frameCount: number) {
  for (let i = index; i >= 0; i--) {
    const img = cache.get(i);
    if (isDrawable(img)) return img;
  }
  for (let i = index + 1; i < frameCount; i++) {
    const img = cache.get(i);
    if (isDrawable(img)) return img;
  }
  return undefined;
}

/**
 * Pré-carrega os frames de uma sequência em ordem de prioridade. `ready` vale quando a primeira
 * passada chegou; o resto continua baixando e `frameAt` devolve o frame carregado mais próximo
 * antes do pedido. Frame com erro conta como carregado, gera um único console.error ao fim da
 * carga e é substituído no desenho pelo frame válido anterior.
 */
export function useFramePreload({
  frameCount,
  framePath,
  enabled,
  onlyIndex,
  onLateFrame,
}: Options) {
  const cacheRef = useRef(new Map<number, HTMLImageElement>());
  const reportedRef = useRef(new Set<string>());
  const lateRef = useRef(onLateFrame);
  const [settledState, setSettledState] = useState({ key: "", settled: 0 });

  useEffect(() => {
    lateRef.current = onLateFrame;
  });

  // A chave muda quando muda o conjunto pedido; progresso de outra chave não vale.
  const key = `${framePath(1)}|${frameCount}|${onlyIndex ?? "all"}`;
  const plan = useMemo(
    () =>
      onlyIndex === undefined
        ? priorityOrder(frameCount)
        : { order: [onlyIndex], firstPass: 1 },
    [frameCount, onlyIndex],
  );

  useEffect(() => {
    if (!enabled) return;
    const paths = plan.order.map((i) => framePath(i + 1));
    // Criadas na ordem de prioridade: o navegador enfileira os pedidos nessa ordem.
    const images = plan.order.map((i, n) => ensureImage(cacheRef.current, i, paths[n]));
    const controller = new AbortController();
    let settled = 0;
    let firstPassSettled = 0;

    images.forEach((img, n) => {
      const inFirstPass = n < plan.firstPass;
      whenSettled(img, controller.signal, () => {
        settled += 1;
        if (inFirstPass) {
          firstPassSettled += 1;
          setSettledState({ key, settled: firstPassSettled });
        } else {
          lateRef.current?.();
        }
        if (settled === images.length) reportFailures(paths, images, reportedRef.current);
      });
    });
    return () => controller.abort();
  }, [enabled, key, plan, framePath]);

  const current = settledState.key === key ? settledState.settled : 0;
  const ready = enabled && current === plan.firstPass;
  const frameAt = useCallback(
    (index: number) => pickFrame(cacheRef.current, index, frameCount),
    [frameCount],
  );
  return { frameAt, ready, loadProgress: current / plan.firstPass };
}
