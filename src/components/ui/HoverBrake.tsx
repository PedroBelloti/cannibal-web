"use client";

import { useEffect, useRef, type ReactNode } from "react";

const BRAKE_MS = 380;

/**
 * Freia, em vez de travar, as animações CSS dos filhos enquanto o mouse está em cima, e as solta
 * do mesmo jeito quando ele sai. Toque não freia: no celular não existe "sair de cima".
 */
export function HoverBrake({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let rate = 1;
    let frame = 0;

    const glideTo = (target: number) => {
      cancelAnimationFrame(frame);
      const from = rate;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / BRAKE_MS);
        rate = from + (target - from) * (1 - (1 - t) ** 3);
        for (const animation of element.getAnimations({ subtree: true })) {
          animation.playbackRate = rate;
        }
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") glideTo(0);
    };
    const onLeave = () => glideTo(1);

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
