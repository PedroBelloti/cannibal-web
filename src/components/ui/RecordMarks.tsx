"use client";

import { useState } from "react";
import type { RecordMethod } from "@/content/site";

type Props = {
  label: string;
  /** Texto com nenhum método escolhido; já vem no HTML, então vale sem script. */
  legend: string;
  methods: RecordMethod[];
  loss: { label: string; count: number };
};

type Tone = "idle" | "lit" | "dim";
type Scale = "featured" | "compact";

const MARK_SIZE: Record<Scale, string> = {
  featured: "size-9 wide:size-[min(2.75rem,5.6svh)]",
  compact: "size-4 wide:size-6",
};
const MARK_MOTION =
  "transition-[background-color,opacity] duration-200 ease-out motion-reduce:transition-none";
const TEXT_MOTION =
  "transition-[color,translate] duration-200 ease-out motion-reduce:transition-none";

const TONE_CLASS: Record<Tone, string> = {
  idle: "bg-ink",
  lit: "bg-accent",
  dim: "bg-ink opacity-25",
};

function Marks({ count, tone, scale }: { count: number; tone: Tone; scale: Scale }) {
  return (
    <span aria-hidden className={`flex ${scale === "featured" ? "gap-2" : "gap-1.5"}`}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-lit={tone === "lit"}
          className={`${MARK_SIZE[scale]} ${MARK_MOTION} ${TONE_CLASS[tone]}`}
          style={{ transitionDelay: `${index * 45}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * As nove lutas do cartel, uma marca por luta. Os métodos em destaque vêm em cima, com o número
 * grande; os outros e a derrota, embaixo, menores. Tocar num método acende as marcas dele e troca
 * a legenda pela frase do método; tocar de novo volta ao estado inicial.
 */
export function RecordMarks({ label, legend, methods, loss }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = methods.find((method) => method.id === selectedId) ?? null;

  const toneOf = (id: string): Tone => {
    if (selectedId === null) return "idle";
    return id === selectedId ? "lit" : "dim";
  };
  const textOf = (id: string) => (toneOf(id) === "dim" ? "text-muted" : "text-ink");
  const toggle = (id: string) => setSelectedId(id === selectedId ? null : id);

  const featured = methods.filter((method) => method.featured);
  const others = methods.filter((method) => !method.featured);

  return (
    <div role="group" aria-label={label}>
      <ul className="grid grid-cols-2 gap-x-4">
        {featured.map((method) => (
          <li key={method.id}>
            <button
              type="button"
              aria-pressed={method.id === selectedId}
              onClick={() => toggle(method.id)}
              className="group flex cursor-pointer flex-col gap-3 text-left"
            >
              <span
                className={`flex flex-col gap-1 ${TEXT_MOTION} group-hover:translate-x-1 ${textOf(method.id)}`}
              >
                <span className="text-[4.5rem] font-extrabold leading-[0.8] tracking-[-0.05em] wide:text-[min(10rem,17svh)]">
                  {method.count}
                </span>
                <span className="text-lead font-semibold">{method.label}</span>
              </span>
              <Marks count={method.count} tone={toneOf(method.id)} scale="featured" />
            </button>
          </li>
        ))}
      </ul>
      <ul className="mt-6 grid grid-cols-2 gap-x-4">
        {others.map((method) => (
          <li key={method.id}>
            <button
              type="button"
              aria-pressed={method.id === selectedId}
              onClick={() => toggle(method.id)}
              className="group flex min-h-12 cursor-pointer items-center gap-2 text-left wide:gap-3"
            >
              <span
                className={`text-body font-semibold ${TEXT_MOTION} group-hover:translate-x-1 ${textOf(method.id)}`}
              >
                {method.count} {method.label}
              </span>
              <Marks count={method.count} tone={toneOf(method.id)} scale="compact" />
            </button>
          </li>
        ))}
        <li className="flex min-h-12 items-center gap-2 wide:gap-3">
          <span
            className={`text-body font-semibold ${TEXT_MOTION} ${selectedId === null ? "text-ink" : "text-muted"}`}
          >
            {loss.count} {loss.label}
          </span>
          <span aria-hidden className="flex gap-1.5">
            {Array.from({ length: loss.count }, (_, index) => (
              <span key={index} className={`${MARK_SIZE.compact} border-2 border-muted`} />
            ))}
          </span>
        </li>
      </ul>
      <p
        aria-live="polite"
        className="mt-3 min-h-[2lh] max-w-[34ch] text-body text-ink wide:min-h-[1lh] wide:max-w-none"
      >
        {selected ? selected.result : legend}
      </p>
    </div>
  );
}
