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

const ROW = "grid min-h-12 w-fit grid-cols-[minmax(7.5rem,11rem)_auto] items-center gap-x-4 pr-2 text-left wide:min-h-13";
const LABEL = "text-lead font-semibold transition-[color,translate] duration-200 ease-out motion-reduce:transition-none";
const MARK_SIZE = "size-9 wide:size-11";
const MARK = `${MARK_SIZE} transition-[background-color,opacity,scale] duration-200 ease-out motion-reduce:transition-none`;

const TONE_CLASS: Record<Tone, string> = {
  idle: "bg-ink",
  lit: "scale-110 bg-accent",
  dim: "bg-ink opacity-25",
};

function Marks({ count, tone }: { count: number; tone: Tone }) {
  return (
    <span aria-hidden className="flex gap-2">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-lit={tone === "lit"}
          className={`${MARK} ${TONE_CLASS[tone]}`}
          style={{ transitionDelay: `${index * 45}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * As nove lutas do cartel, uma marca por luta, em linhas por método. Tocar num método acende as
 * marcas dele e troca a legenda pela frase do método; tocar de novo volta ao estado inicial.
 */
export function RecordMarks({ label, legend, methods, loss }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = methods.find((method) => method.id === selectedId) ?? null;

  const toneOf = (id: string): Tone => {
    if (selectedId === null) return "idle";
    return id === selectedId ? "lit" : "dim";
  };

  return (
    <div role="group" aria-label={label}>
      <ul>
        {methods.map((method) => (
          <li key={method.id}>
            <button
              type="button"
              aria-pressed={method.id === selectedId}
              onClick={() => setSelectedId(method.id === selectedId ? null : method.id)}
              className={`${ROW} group cursor-pointer`}
            >
              <span
                className={`${LABEL} group-hover:translate-x-1 ${toneOf(method.id) === "dim" ? "text-muted" : "text-ink"}`}
              >
                {method.label}
                <span className="sr-only">, {method.count}</span>
              </span>
              <Marks count={method.count} tone={toneOf(method.id)} />
            </button>
          </li>
        ))}
        <li className={ROW}>
          <span className={`${LABEL} ${selectedId === null ? "text-ink" : "text-muted"}`}>
            {loss.label}
            <span className="sr-only">, {loss.count}</span>
          </span>
          <span aria-hidden className="flex gap-2">
            {Array.from({ length: loss.count }, (_, index) => (
              <span key={index} className={`${MARK_SIZE} border-2 border-muted`} />
            ))}
          </span>
        </li>
      </ul>
      <p aria-live="polite" className="mt-4 min-h-[2lh] max-w-[34ch] text-body text-ink">
        {selected ? selected.result : legend}
      </p>
    </div>
  );
}
