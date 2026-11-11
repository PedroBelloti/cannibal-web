"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

type Props = { children: React.ReactNode };

/** Distância entre o scroll real e o animado a partir da qual o scroll veio de fora do Lenis. */
const NATIVE_JUMP_MIN_PX = 8;

/** Liga o scroll suave (Lenis) na página inteira, sem tirar a vez dos saltos nativos. */
export function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    // Enquanto anima, o Lenis ignora o scroll nativo e desfaz saltos que não partiram dele (link de
    // âncora, End, PageDown, barra de rolagem). Um scroll longe do ponto animado é um salto desses:
    // a animação para ali e o salto vale.
    const yieldToNativeJump = () => {
      if (lenis.isScrolling !== "smooth") return;
      if (Math.abs(window.scrollY - lenis.animatedScroll) < NATIVE_JUMP_MIN_PX) return;
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };
    window.addEventListener("scroll", yieldToNativeJump, { passive: true });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", yieldToNativeJump);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
