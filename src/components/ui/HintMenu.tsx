"use client";

import { useEffect, useRef, useState } from "react";
import type { Link } from "@/content/site";

type Props = { label: string; links: Link[] };

const HINT_FIRST_MS = 250;
const HINT_EVERY_MS = 2600;
const HINT_HOLD_MS = 1300;

/**
 * Menu em letra grande que avisa que é clicável: de tempos em tempos um link sorteado passa pela
 * cor de destaque. O sorteio só roda com o menu na tela e o primeiro link acende logo que ele
 * aparece. Com o ponteiro ou o foco no menu o sorteio para e só o link apontado fica colorido.
 * Com movimento reduzido não há sorteio.
 */
export function HintMenu({ label, links }: Props) {
  const [hinted, setHinted] = useState<number | null>(null);
  const [engaged, setEngaged] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || engaged || links.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let release = 0;
    let timer = 0;

    const hint = () => {
      if (reduced.matches) return;
      // Sorteia entre os outros: o mesmo link duas vezes seguidas parece defeito.
      const others = links.map((_, index) => index).filter((index) => index !== lastRef.current);
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
  }, [onScreen, engaged, links]);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
    >
      <ul>
        {links.map((link, index) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`inline-block py-1 text-head font-extrabold tracking-[-0.03em] transition-[color,translate] duration-700 ease-out hover:translate-x-2 hover:text-accent focus-visible:text-accent motion-reduce:transition-none ${
                hinted === index ? "text-accent" : "text-ink"
              }`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
