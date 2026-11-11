import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";

// Sem "use client": as funções nas props não são serializáveis, então este componente só pode
// ser usado dentro de um client component (Hero, CinematicReveal), nunca direto numa página.

/** Janela de progresso (0–1 do scroll da seção) em que um card fica visível. */
export type SequenceCard = { id: string; show: number; hide: number };

type Props = {
  frameCount: number;
  /** Caminho do frame `n`, começando em 1. */
  framePath: (n: number) => string;
  /** Fração da largura do frame que fica no centro da tela até 768 px. */
  mobileFocusX: number;
  cards: readonly SequenceCard[];
  loader: { eyebrow: string; text: string };
  id?: string;
  /** Classes extras da section; a altura vem de `.scroll-animation` em globals.css. */
  className?: string;
  /** Chamado dentro do requestAnimationFrame; escreva no DOM por ref, sem estado do React. */
  onProgress?: (progress: number, frameIndex: number) => void;
  /** Overlays da seção; recebem os ids dos cards visíveis. */
  children: (visibleIds: ReadonlySet<string>) => ReactNode;
};

const MOBILE_MAX_WIDTH = 768;

function scrollProgress(section: HTMLElement): number {
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

/**
 * Corte tipo "cover": cobre o canvas inteiro e, no celular, centraliza `focusX` do frame
 * sem deixar faixa vazia nas bordas.
 */
function coverRect(cw: number, ch: number, img: HTMLImageElement, focusX: number) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const byWidth = cw / ch > imgRatio;
  const drawW = byWidth ? cw : ch * imgRatio;
  const drawH = byWidth ? cw / imgRatio : ch;
  const drawX = Math.min(0, Math.max(cw - drawW, cw / 2 - drawW * focusX));
  return { drawX, drawY: (ch - drawH) / 2, drawW, drawH };
}

/**
 * Seção com vídeo controlado por scroll: pré-carrega os frames, desenha o frame do progresso
 * atual num canvas sticky e informa os cards visíveis. Nada é desenhado nem notificado antes
 * de todos os frames terminarem (frame com erro conta como terminado).
 */
export function ScrollSequence({
  frameCount,
  framePath,
  mobileFocusX,
  cards,
  loader,
  id,
  className,
  onProgress,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const visibleKeyRef = useRef("");

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleIds, setVisibleIds] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    let settled = 0;
    const settle = () => {
      if (cancelled) return;
      settled++;
      setLoadProgress(settled / frameCount);
      if (settled === frameCount) {
        loadedRef.current = true;
        setLoaded(true);
      }
    };
    framesRef.current = Array.from({ length: frameCount }, (_, i) => {
      const img = new Image();
      img.src = framePath(i + 1);
      img.onload = settle;
      img.onerror = settle;
      return img;
    });
    return () => {
      cancelled = true;
    };
  }, [frameCount, framePath]);

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = framesRef.current[index];
      if (!canvas || !img || !img.complete || !img.naturalWidth) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const focusX = window.innerWidth <= MOBILE_MAX_WIDTH ? mobileFocusX : 0.5;
      const { drawX, drawY, drawW, drawH } = coverRect(canvas.width, canvas.height, img, focusX);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    [mobileFocusX],
  );

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawFrame]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  // Effect event: lê sempre os cards e o onProgress mais recentes sem reinscrever o scroll.
  const notify = useEffectEvent((progress: number, frameIndex: number) => {
    onProgress?.(progress, frameIndex);
    const ids = visibleCardIds(cards, progress);
    const key = ids.join(",");
    if (key !== visibleKeyRef.current) {
      visibleKeyRef.current = key;
      setVisibleIds(new Set(ids));
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const progress = scrollProgress(section);
        const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
        notify(progress, frameIndex);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [frameCount, drawFrame]);

  const sectionClass = ["scroll-animation relative", className].filter(Boolean).join(" ");

  return (
    <section ref={sectionRef} id={id} className={sectionClass}>
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />
        {children(visibleIds)}
        {!loaded && <SequenceLoader {...loader} progress={loadProgress} />}
      </div>
    </section>
  );
}

function SequenceLoader({
  eyebrow,
  text,
  progress,
}: {
  eyebrow: string;
  text: string;
  progress: number;
}) {
  const percent = Math.round(progress * 100);
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-background px-6">
      <EyebrowBadge>{eyebrow}</EyebrowBadge>
      <div className="h-px w-60 bg-white/10 md:w-80">
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
        {text} &nbsp;&middot;&nbsp; {percent}%
      </p>
    </div>
  );
}
