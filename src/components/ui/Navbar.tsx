"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { scrollProgress } from "@/components/ui/ScrollSequence";
import { HERO_SECTION_ID, HERO_TEXT_FADE_END } from "@/lib/hero";
import { site } from "@/content/site";

type NavState = {
  /** Há uma sequência atrás da barra; ela fica transparente para a foto aparecer. */
  overSequence: boolean;
  /** O título gigante do Hero já é o nome; o nome pequeno some para não repetir. */
  heroOnScreen: boolean;
  /** O botão do Hero ainda está visível; o da barra espera, para haver um só na tela. */
  heroActionVisible: boolean;
};

const TOP_OF_PAGE: NavState = { overSequence: true, heroOnScreen: true, heroActionVisible: true };

const FADE = "transition-[opacity,visibility] duration-200";
const SHOWN = "visible opacity-100";
const HIDDEN = "invisible opacity-0";

function readNavState(header: HTMLElement): NavState {
  // Pela base da barra: na emenda de duas sequências sempre há uma delas ali, e quando a seção
  // seguinte encosta na barra (destino de um link do menu) não sobra uma tira da sequência atrás.
  const barBottom = header.getBoundingClientRect().height;
  const overSequence = [...document.querySelectorAll("section.scroll-animation")].some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top < barBottom && rect.bottom > barBottom + 1;
  });
  const hero = document.getElementById(HERO_SECTION_ID);
  return {
    overSequence,
    heroOnScreen: hero !== null && hero.getBoundingClientRect().bottom > 0,
    heroActionVisible: hero !== null && scrollProgress(hero) < HERO_TEXT_FADE_END,
  };
}

function sameState(a: NavState, b: NavState): boolean {
  return (
    a.overSequence === b.overSequence &&
    a.heroOnScreen === b.heroOnScreen &&
    a.heroActionVisible === b.heroActionVisible
  );
}

/** Barra fixa: nome, links das seções e o botão principal, mostrados conforme o que está na tela. */
export function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState(TOP_OF_PAGE);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const next = readNavState(header);
      setState((prev) => (sameState(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        state.overSequence ? "bg-transparent" : "bg-ground"
      }`}
    >
      <div className="flex h-(--nav-h) items-center gap-6 px-(--margin)">
        <Link
          href="/"
          className={`mr-auto text-small font-bold text-ink ${FADE} ${
            state.heroOnScreen ? HIDDEN : SHOWN
          }`}
        >
          {site.brand.name}
        </Link>

        <nav aria-label={site.nav.label} className="hidden items-center gap-6 md:flex">
          {site.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-small font-semibold text-ink decoration-2 underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <span className={`${FADE} ${state.heroActionVisible ? HIDDEN : SHOWN}`}>
          <Button href={site.nav.cta.href} size="sm">
            {site.nav.cta.label}
          </Button>
        </span>
      </div>
    </header>
  );
}
