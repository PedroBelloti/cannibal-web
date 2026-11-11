"use client";

import { useState } from "react";
import type { RecordMethod } from "@/content/site";
import { useHintCycle } from "./useHintCycle";

type Props = {
  label: string;
  /** Texto com nenhum método escolhido; já vem no HTML, então vale sem script. */
  legend: string;
  methods: RecordMethod[];
  loss: { label: string; count: number };
};

/** `hint` é o aviso sorteado: a marca acende como em `lit`, mas devagar e sem apagar as outras. */
type Tone = "idle" | "lit" | "dim" | "hint";
type Scale = "featured" | "compact";

const MARK_SIZE: Record<Scale, string> = {
  featured: "h-11 wide:h-[min(3.25rem,6.4svh)]",
  compact: "h-5 wide:h-7",
};
const MARK_MOTION = "w-auto transition-[color,opacity] ease-out motion-reduce:transition-none";
const TEXT_MOTION =
  "transition-[color,translate] duration-200 ease-out motion-reduce:transition-none";

const TONE_CLASS: Record<Tone, string> = {
  idle: "text-ink duration-200",
  lit: "text-accent duration-200",
  dim: "text-ink opacity-25 duration-200",
  hint: "text-accent duration-700",
};

/**
 * A marca de cada luta: um risco inclinado, a mesma barra do "%" do título, contado como em
 * placar riscado à mão. Vazado (`hollow`) é a derrota.
 */
function Stroke({ hollow = false, ...rest }: { hollow?: boolean } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 28" fill={hollow ? "none" : "currentColor"} {...rest}>
      <path
        d="M9 1h7L8 27H1Z"
        stroke={hollow ? "currentColor" : undefined}
        strokeWidth={hollow ? 1.5 : undefined}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Marks({ count, tone, scale }: { count: number; tone: Tone; scale: Scale }) {
  return (
    <span aria-hidden className={`flex ${scale === "featured" ? "gap-1" : "gap-0.5"}`}>
      {Array.from({ length: count }, (_, index) => (
        <Stroke
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
 * a legenda pela frase do método; tocar de novo volta ao estado inicial. Sem nada escolhido nem
 * apontado, as marcas de um método sorteado acendem de tempos em tempos (`useHintCycle`).
 */
export function RecordMarks({ label, legend, methods, loss }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [engaged, setEngaged] = useState(false);
  const selected = methods.find((method) => method.id === selectedId) ?? null;
  const { ref, hinted } = useHintCycle<HTMLDivElement>(
    methods.length,
    engaged || selectedId !== null,
  );
  const hintedId = hinted === null ? null : methods[hinted].id;

  const toneOf = (id: string): Tone => {
    if (selectedId === null) return id === hintedId ? "hint" : "idle";
    return id === selectedId ? "lit" : "dim";
  };
  const textOf = (id: string) => (toneOf(id) === "dim" ? "text-muted" : "text-ink");
  const toggle = (id: string) => setSelectedId(id === selectedId ? null : id);

  const featured = methods.filter((method) => method.featured);
  const others = methods.filter((method) => !method.featured);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
    >
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
          <span aria-hidden className="flex gap-0.5">
            {Array.from({ length: loss.count }, (_, index) => (
              <Stroke key={index} hollow className={`${MARK_SIZE.compact} w-auto text-muted`} />
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
