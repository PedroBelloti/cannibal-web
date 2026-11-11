"use client";

import { useEffect, useRef, useState } from "react";
import type { Link } from "@/content/site";

type Props = { label: string; links: Link[] };

const HINT_EVERY_MS = 2600;
const HINT_HOLD_MS = 1300;

/**
 * Menu em letra grande que avisa que é clicável: de tempos em tempos um link sorteado passa pela
 * cor de destaque. Com o ponteiro ou o foco no menu o sorteio para e só o link apontado fica
 * colorido. Com movimento reduzido não há sorteio.
 */
export function HintMenu({ label, links }: Props) {
  const [hinted, setHinted] = useState<number | null>(null);
  const [engaged, setEngaged] = useState(false);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (engaged || links.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let release = 0;

    const hint = () => {
      if (reduced.matches) return;
      // Sorteia entre os outros: o mesmo link duas vezes seguidas parece defeito.
      const others = links.map((_, index) => index).filter((index) => index !== lastRef.current);
      const next = others[Math.floor(Math.random() * others.length)];
      lastRef.current = next;
      setHinted(next);
      release = window.setTimeout(() => setHinted(null), HINT_HOLD_MS);
    };

    const timer = window.setInterval(hint, HINT_EVERY_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(release);
      setHinted(null);
    };
  }, [engaged, links]);

  return (
    <nav
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
