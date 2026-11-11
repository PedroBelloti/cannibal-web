import type Lenis from "lenis";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MIN_DURATION_S = 0.9;
const MAX_DURATION_S = 1.8;
const DURATION_PER_SCREEN_S = 0.08;

// Sai e chega devagar: o trajeto acontece com a página visível, sem tranco no começo nem no fim.
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/** Mesmo destino, mesma página: só esses cliques viram scroll suave. */
function findSamePageAnchor(event: MouseEvent): { link: HTMLAnchorElement; target: HTMLElement } | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self")) return null;

  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return null;

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  return target ? { link, target } : null;
}

/**
 * Leva os links de âncora ao destino pelo Lenis, em vez do salto nativo. A duração cresce com a
 * distância (as sequências tornam a página muito alta) e fica entre 0,9 s e 1,8 s; com movimento
 * reduzido o salto é imediato. Atualiza o endereço e passa o foco ao destino, como o salto nativo.
 * Devolve a função que desliga o ouvinte.
 */
export function bindAnchorScroll(lenis: Lenis): () => void {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

  const onClick = (event: MouseEvent) => {
    const found = findSamePageAnchor(event);
    if (!found) return;
    event.preventDefault();

    const { link, target } = found;
    const hash = new URL(link.href).hash;
    if (location.hash !== hash) history.pushState(null, "", hash);

    // Sem foco no destino, o Tab seguinte voltaria ao menu em vez de seguir pela seção.
    const moveFocus = () => {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    if (reducedMotion.matches) {
      lenis.scrollTo(target, { immediate: true, force: true });
      moveFocus();
      return;
    }

    const screens = Math.abs(target.getBoundingClientRect().top) / window.innerHeight;
    const duration = Math.min(
      MAX_DURATION_S,
      Math.max(MIN_DURATION_S, MIN_DURATION_S + screens * DURATION_PER_SCREEN_S),
    );
    lenis.scrollTo(target, { duration, easing: easeInOutQuart, force: true, onComplete: moveFocus });
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
