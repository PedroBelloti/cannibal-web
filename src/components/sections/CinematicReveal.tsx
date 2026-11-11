"use client";

import { useRef } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { ScrollSequence } from "@/components/ui/ScrollSequence";
import { CINE_FRAME_COUNT, CINE_MOBILE_FOCUS_X, cineFramePath } from "@/lib/cinematic";
import { site } from "@/content/site";

const { cinematic } = site;

/** Segunda sequência: troca de título no meio, cards e chamada final no fim do scroll. */
export function CinematicReveal() {
  const titleBeforeRef = useRef<HTMLHeadingElement | null>(null);
  const titleAfterRef = useRef<HTMLHeadingElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const seqReadoutRef = useRef<HTMLSpanElement | null>(null);

  const handleProgress = (progress: number, frameIndex: number) => {
    if (titleBeforeRef.current) {
      const op = Math.min(1, Math.max(0, (0.52 - progress) / 0.1));
      titleBeforeRef.current.style.opacity = String(op);
    }

    if (titleAfterRef.current) {
      const op = Math.min(1, Math.max(0, (progress - 0.48) / 0.1));
      titleAfterRef.current.style.opacity = String(op);
    }

    if (outroRef.current) {
      const op = Math.min(1, Math.max(0, (progress - 0.86) / 0.06));
      outroRef.current.style.opacity = String(op);
      outroRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${progress})`;
    }

    if (seqReadoutRef.current) {
      const n = Math.min(CINE_FRAME_COUNT, frameIndex + 1);
      seqReadoutRef.current.textContent =
        `SEQ ${String(n).padStart(3, "0")} / ${CINE_FRAME_COUNT}`;
    }
  };

  return (
    <ScrollSequence
      id="cinematic"
      className="border-t border-white/5 bg-background"
      frameCount={CINE_FRAME_COUNT}
      framePath={cineFramePath}
      mobileFocusX={CINE_MOBILE_FOCUS_X}
      cards={cinematic.cards}
      loader={cinematic.loader}
      onProgress={handleProgress}
    >
      {(visibleBeats) => (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 90%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
            }}
          />

          <div className="pointer-events-none absolute left-6 top-24 text-accent md:left-10 md:top-28">
            <HudFrame corner="tl" size={26} />
          </div>
          <div className="pointer-events-none absolute right-6 top-24 text-accent md:right-10 md:top-28">
            <HudFrame corner="tr" size={26} />
          </div>
          <div className="pointer-events-none absolute bottom-14 left-6 text-accent md:bottom-16 md:left-10">
            <HudFrame corner="bl" size={26} />
          </div>
          <div className="pointer-events-none absolute bottom-14 right-6 text-accent md:bottom-16 md:right-10">
            <HudFrame corner="br" size={26} />
          </div>

          <div className="pointer-events-none absolute left-6 top-28 z-10 flex max-w-[46ch] flex-col items-start gap-3 text-left md:left-12 md:top-32 md:gap-5">
            <EyebrowBadge>{cinematic.eyebrow}</EyebrowBadge>
            <div className="relative self-stretch">
              <h2
                ref={titleBeforeRef}
                className="font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
                style={{ transition: "opacity 240ms ease-out" }}
              >
                {cinematic.titleBefore.line1}
                <br />
                <span className="text-accent">{cinematic.titleBefore.highlight}</span>
              </h2>
              <h2
                ref={titleAfterRef}
                className="absolute inset-0 font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
                style={{ opacity: 0, transition: "opacity 240ms ease-out" }}
              >
                {cinematic.titleAfter.line1}
                <br />
                <span className="text-accent">{cinematic.titleAfter.highlight}</span>
              </h2>
            </div>
            <p className="hidden max-w-[42ch] font-sans text-base leading-relaxed text-zinc-400 md:block">
              {cinematic.lead}
            </p>
          </div>

          <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
            <div className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
              {cinematic.statusLabel}
            </span>
          </div>

          <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
            <span
              ref={seqReadoutRef}
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent"
            >
              SEQ 001 / {CINE_FRAME_COUNT}
            </span>
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
              <div
                ref={progressFillRef}
                className="h-full origin-left bg-accent"
                style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
              />
            </div>
            <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
              <span>{cinematic.bottomBar.left}</span>
              <span>{cinematic.bottomBar.center}</span>
              <span>{cinematic.bottomBar.scrollHint} &darr;</span>
            </div>
          </div>

          {cinematic.cards.map((b) => {
            const visible = visibleBeats.has(b.id);
            return (
              <div
                key={b.id}
                className="pointer-events-none absolute bottom-28 left-12 z-20 hidden w-[420px] max-w-[90vw] md:block"
              >
                <figure
                  className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    {b.label}
                  </span>
                  <blockquote className="mt-3 font-sans text-xl font-medium leading-snug tracking-tight text-foreground">
                    &ldquo;{b.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between">
                    <span className="font-sans text-sm text-zinc-300">{b.speaker}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">
                      {b.source}
                    </span>
                  </figcaption>
                </figure>
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-x-6 bottom-20 z-20 md:hidden">
            {cinematic.cards.map((b) => {
              const visible = visibleBeats.has(b.id);
              return (
                <figure
                  key={b.id}
                  className={`card-surface pointer-events-auto absolute inset-x-0 bottom-0 p-5 transition-all duration-400 ease-out ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent">
                    {b.label}
                  </span>
                  <blockquote className="mt-2 font-sans text-base font-medium leading-snug text-foreground">
                    &ldquo;{b.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 flex items-center justify-between">
                    <span className="font-sans text-xs text-zinc-300">{b.speaker}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                      {b.source}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div
            ref={outroRef}
            className="pointer-events-none absolute bottom-24 right-6 z-10 flex flex-col items-end gap-4 md:bottom-32 md:right-12"
            style={{ opacity: 0, transition: "opacity 80ms linear" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {cinematic.outro.kicker}
            </span>
            <a
              href={cinematic.outro.cta.href}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] active:translate-y-[1px]"
            >
              {cinematic.outro.cta.label}
              <span aria-hidden>&darr;</span>
            </a>
          </div>
        </>
      )}
    </ScrollSequence>
  );
}
