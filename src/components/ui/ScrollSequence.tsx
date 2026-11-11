import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { useFramePreload } from "@/components/ui/useFramePreload";

// Sem "use client": as funções nas props não são serializáveis, então este componente só pode
// ser usado dentro de um client component (Hero, CinematicReveal), nunca direto numa página.

/** Janela de progresso (0–1 do scroll da seção) em que um card fica visível. */
export type SequenceCard = { id: string; show: number; hide: number };

type Props = {
  frameCount: number;
  /** Caminho do frame `n`, começando em 1. */
  framePath: (n: number) => string;
  /**
   * Fração da largura do frame que fica no centro da tela em pé (largura/altura até 1). Entre
   * 1 e 1,25 o foco caminha até o centro (0,5); a partir de 1,25 o corte é centralizado.
   */
  portraitFocusX: number;
  /** Frame (começando em 1) mostrado fixo para quem pede menos movimento. */
  posterFrame: number;
  /**
   * `"eager"` (padrão) baixa os frames ao montar; `"lazy"` espera a seção chegar a cerca de
   * duas alturas de tela. Use `"lazy"` só abaixo da dobra.
   */
  loading?: "eager" | "lazy";
  cards: readonly SequenceCard[];
  loader: { text: string };
  id?: string;
  /** Classes extras da section; a altura vem de `.scroll-animation` em globals.css. */
  className?: string;
  /**
   * Chamado dentro do requestAnimationFrame; escreva no DOM por ref, sem estado do React.
   * `frameIndex` é o frame desenhado (o pôster, com movimento reduzido).
   */
  onProgress?: (progress: number, frameIndex: number) => void;
  /** Overlays da seção; recebem os ids dos cards visíveis. */
  children: (visibleIds: ReadonlySet<string>) => ReactNode;
};

const LAZY_ROOT_MARGIN = "200% 0px";
const PORTRAIT_MAX_RATIO = 1;
const LANDSCAPE_MIN_RATIO = 1.25;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Fração 0–1 do scroll de uma section de sequência: a conta que posiciona frames e cards. */
export function scrollProgress(section: HTMLElement): number {
  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollable));
}

function visibleCardIds(cards: readonly SequenceCard[], progress: number): string[] {
  return cards
    .filter((card) => progress >= card.show && progress <= card.hide)
    .map((card) => card.id)
    .sort();
}

/** Foco horizontal pela proporção do canvas, com transição linear para não saltar no resize. */
function focusForRatio(ratio: number, portraitFocusX: number): number {
  const t = (ratio - PORTRAIT_MAX_RATIO) / (LANDSCAPE_MIN_RATIO - PORTRAIT_MAX_RATIO);
  const clamped = Math.min(1, Math.max(0, t));
  return portraitFocusX + (0.5 - portraitFocusX) * clamped;
}

/**
 * Corte tipo "cover": cobre o canvas inteiro e centraliza `focusX` do frame sem deixar faixa
 * vazia nas bordas.
 */
function coverRect(cw: number, ch: number, img: HTMLImageElement, focusX: number) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const byWidth = cw / ch > imgRatio;
  const drawW = byWidth ? cw : ch * imgRatio;
  const drawH = byWidth ? cw / imgRatio : ch;
  const drawX = Math.min(0, Math.max(cw - drawW, cw / 2 - drawW * focusX));
  return { drawX, drawY: (ch - drawH) / 2, drawW, drawH };
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** `null` até a hidratação: sem saber a preferência, nada é baixado. */
function useReducedMotion(): boolean | null {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => null,
  );
}

/** Fica verdadeiro, e assim permanece, quando o elemento chega perto da tela. */
function useNearViewport(ref: RefObject<HTMLElement | null>, active: boolean): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!active || near || !el) return;
    // Root explícito no próprio documento: com o root implícito, dentro de um iframe a margem
    // seria cortada pela janela do iframe.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { root: el.ownerDocument, rootMargin: LAZY_ROOT_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, active, near]);
  return near;
}

/**
 * Seção com vídeo controlado por scroll: pré-carrega os frames, desenha o frame do progresso
 * atual num canvas sticky e informa os cards visíveis. Nada é desenhado nem notificado antes
 * de a carga terminar (frame com erro conta como terminado). Com `prefers-reduced-motion`,
 * baixa e mostra só o pôster, e cards e textos seguem o progresso.
 */
export function ScrollSequence({
  frameCount,
  framePath,
  portraitFocusX,
  posterFrame,
  loading = "eager",
  cards,
  loader,
  id,
  className,
  onProgress,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastFrameRef = useRef(-1);
  const visibleKeyRef = useRef("");
  const [visibleIds, setVisibleIds] = useState<ReadonlySet<string>>(() => new Set());

  const reducedMotion = useReducedMotion();
  const near = useNearViewport(sectionRef, loading === "lazy");
  const posterIndex = Math.min(frameCount - 1, Math.max(0, posterFrame - 1));
  const { frameAt, loaded, loadProgress } = useFramePreload({
    frameCount,
    framePath,
    enabled: reducedMotion !== null && (loading === "eager" || near),
    onlyIndex: reducedMotion ? posterIndex : undefined,
  });

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = frameAt(index);
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const focusX = focusForRatio(canvas.width / canvas.height, portraitFocusX);
      const { drawX, drawY, drawW, drawH } = coverRect(canvas.width, canvas.height, img, focusX);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    [frameAt, portraitFocusX],
  );

  // Effect event: lê sempre props e estado mais recentes sem reinscrever scroll e resize.
  const update = useEffectEvent((redraw: boolean) => {
    const section = sectionRef.current;
    if (!section || !loaded) return;

    const progress = scrollProgress(section);
    const frameIndex = reducedMotion
      ? posterIndex
      : Math.min(frameCount - 1, Math.floor(progress * frameCount));
    if (redraw || frameIndex !== lastFrameRef.current) {
      lastFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
    onProgress?.(progress, frameIndex);

    const ids = visibleCardIds(cards, progress);
    const key = ids.join(",");
    if (key !== visibleKeyRef.current) {
      visibleKeyRef.current = key;
      setVisibleIds(new Set(ids));
    }
  });

  // Scroll e resize passam pelo mesmo rAF; o resize muda a altura da seção e, com ela, o
  // progresso. Reexecuta ao fim da carga e quando mudam movimento reduzido ou foco.
  useEffect(() => {
    let frame = 0;
    let needsResize = true;
    const tick = () => {
      frame = 0;
      const canvas = canvasRef.current;
      // Mudar o tamanho do canvas apaga o desenho, então o resize força redesenhar.
      const resized = needsResize && canvas !== null;
      if (resized) resizeCanvas(canvas);
      needsResize = false;
      update(resized);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      needsResize = true;
      schedule();
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [loaded, reducedMotion, drawFrame]);

  const sectionClass = ["scroll-animation relative", className].filter(Boolean).join(" ");

  return (
    <section ref={sectionRef} id={id} className={sectionClass}>
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-ground"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />
        {children(visibleIds)}
        {!loaded && <SequenceLoader text={loader.text} progress={loadProgress} />}
      </div>
    </section>
  );
}

function SequenceLoader({ text, progress }: { text: string; progress: number }) {
  const percent = Math.round(progress * 100);
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-ground px-(--margin)">
      <p className="text-small font-semibold tabular-nums text-ink">
        {text} &middot; {percent}%
      </p>
      <div className="h-1 w-60 bg-surface md:w-80">
        <div
          className="h-full bg-ink transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
