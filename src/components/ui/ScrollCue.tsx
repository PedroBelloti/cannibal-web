"use client";

import { useEffect, useState } from "react";

const IDLE_MS = 2500;
// "swipe-up" do Material Symbols (Apache 2.0): a mão que arrasta para cima.
const SWIPE_UP =
  "M6.125 14q-1.275-1.6-1.95-3.525T3.5 6.5q0-.675.075-1.35T3.8 3.8L2.05 5.55L1 4.5L4.5 1L8 4.5L6.95 5.55l-1.625-1.6q-.175.625-.25 1.262T5 6.5q0 1.75.563 3.388T7.2 12.924zm10.325 6.825q-.575.2-1.162.188t-1.138-.288l-6.55-3.05l.45-1q.25-.5.7-.812t1-.363l1.7-.125L8.65 7.7q-.15-.4.025-.763t.575-.512t.762.025t.513.575l3.7 10.175l-2.5.175L15 18.9q.175.075.375.088t.375-.038l3.925-1.425q.775-.275 1.125-1.038t.075-1.537L19.5 11.2q-.15-.4.025-.763t.575-.512t.762.025t.513.575l1.375 3.75q.575 1.575-.113 3.062T20.375 19.4zM14.2 14.2l-1.35-3.775q-.15-.4.025-.763t.575-.512t.763.025t.512.575L16.1 13.5zm2.825-1.025L16 10.35q-.15-.4.025-.763t.575-.512t.763.025t.512.575l1.025 2.8zm.2 1.95";
// Perto do fim não há mais o que rolar: o aviso mentiria.
const END_MARGIN_SCREENS = 0.5;

/**
 * Aviso de que a página rola, para a pilha em pé: a mão do gesto de arrastar, subindo e sumindo
 * em laço na borda direita, abaixo do meio:
 * o pé da tela do Hero é ocupado de ponta a ponta pelo botão.
 * Só aparece depois de `IDLE_MS` sem scroll e some no primeiro movimento, então quem rola sem
 * parar nunca a vê. É enfeite (`aria-hidden`, sem toque); com movimento reduzido aparece parada.
 */
export function ScrollCue() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = 0;
    const atEnd = () =>
      window.scrollY + window.innerHeight * (1 + END_MARGIN_SCREENS) >=
      document.documentElement.scrollHeight;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(!atEnd()), IDLE_MS);
    };
    const onScroll = () => {
      setVisible(false);
      arm();
    };

    arm();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed right-(--margin) top-[58svh] z-30 grid size-11 place-items-center rounded-full bg-ground/35 text-ink transition-opacity duration-300 wide:hidden ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`h-6 w-auto ${visible ? "scroll-cue" : ""}`}
      >
        <path d={SWIPE_UP} />
      </svg>
    </div>
  );
}
