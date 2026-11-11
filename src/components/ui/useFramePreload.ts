import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  frameCount: number;
  /** Caminho do frame `n`, começando em 1; precisa ser estável entre renders. */
  framePath: (n: number) => string;
  /** Enquanto falso, nada é baixado. */
  enabled: boolean;
  /** Índice (base 0) do único frame a baixar; sem ele, baixa todos. */
  onlyIndex?: number;
};

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
 * Pré-carrega os frames de uma sequência e informa o progresso. Frame com erro conta como
 * carregado, gera um único console.error ao fim da carga e é substituído no desenho pelo
 * frame válido anterior (`frameAt`).
 */
export function useFramePreload({ frameCount, framePath, enabled, onlyIndex }: Options) {
  const cacheRef = useRef(new Map<number, HTMLImageElement>());
  const reportedRef = useRef(new Set<string>());
  const [settledState, setSettledState] = useState({ key: "", settled: 0 });

  // A chave muda quando muda o conjunto pedido; progresso de outra chave não vale.
  const key = `${framePath(1)}|${frameCount}|${onlyIndex ?? "all"}`;
  const total = onlyIndex === undefined ? frameCount : 1;

  useEffect(() => {
    if (!enabled) return;
    const indices =
      onlyIndex === undefined ? Array.from({ length: frameCount }, (_, i) => i) : [onlyIndex];
    const paths = indices.map((i) => framePath(i + 1));
    const images = indices.map((i, n) => ensureImage(cacheRef.current, i, paths[n]));
    const controller = new AbortController();
    let settled = 0;

    const onSettled = () => {
      settled += 1;
      setSettledState({ key, settled });
      if (settled === images.length) reportFailures(paths, images, reportedRef.current);
    };
    images.forEach((img) => whenSettled(img, controller.signal, onSettled));
    return () => controller.abort();
  }, [enabled, key, frameCount, framePath, onlyIndex]);

  const current = settledState.key === key ? settledState.settled : 0;
  const frameAt = useCallback(
    (index: number) => pickFrame(cacheRef.current, index, frameCount),
    [frameCount],
  );

  return { frameAt, loaded: enabled && current === total, loadProgress: current / total };
}
