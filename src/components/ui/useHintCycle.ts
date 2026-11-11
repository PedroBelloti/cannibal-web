import { useEffect, useRef, useState } from "react";

const HINT_FIRST_MS = 250;
const HINT_EVERY_MS = 2600;
const HINT_HOLD_MS = 1300;

/**
 * Sorteia, de tempos em tempos, um entre `count` itens para o componente destacar e avisar que
 * responde ao toque. Devolve a `ref` do elemento observado e o índice sorteado (`null` no
 * intervalo). Só roda com o elemento na tela, e o primeiro sorteio sai logo que ele aparece; com
 * `paused` ou com movimento reduzido não há sorteio.
 */
export function useHintCycle<T extends HTMLElement>(count: number, paused: boolean) {
  const [hinted, setHinted] = useState<number | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<T>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || paused || count < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let release = 0;
    let timer = 0;

    const hint = () => {
      if (reduced.matches) return;
      // Sorteia entre os outros: o mesmo item duas vezes seguidas parece defeito.
      const others = Array.from({ length: count }, (_, index) => index).filter(
        (index) => index !== lastRef.current,
      );
      const next = others[Math.floor(Math.random() * others.length)];
      lastRef.current = next;
      setHinted(next);
      release = window.setTimeout(() => setHinted(null), HINT_HOLD_MS);
    };

    const first = window.setTimeout(() => {
      hint();
      timer = window.setInterval(hint, HINT_EVERY_MS);
    }, HINT_FIRST_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      window.clearTimeout(release);
      setHinted(null);
    };
  }, [onScreen, paused, count]);

  return { ref, hinted };
}
