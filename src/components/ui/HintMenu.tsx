"use client";

import { useState } from "react";
import type { Link } from "@/content/site";
import { useHintCycle } from "./useHintCycle";

type Props = { label: string; links: Link[] };

/**
 * Menu em letra grande que avisa que é clicável: de tempos em tempos um link sorteado passa pela
 * cor de destaque (`useHintCycle`). Com o ponteiro ou o foco no menu o sorteio para e só o link
 * apontado fica colorido.
 */
export function HintMenu({ label, links }: Props) {
  const [engaged, setEngaged] = useState(false);
  const { ref, hinted } = useHintCycle<HTMLElement>(links.length, engaged);

  return (
    <nav
      ref={ref}
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
