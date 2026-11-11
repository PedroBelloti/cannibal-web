"use client";

import { useRef } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { ScrollSequence } from "@/components/ui/ScrollSequence";
import { FRAME_COUNT, HERO_TEXT_FADE_END, MOBILE_FOCUS_X, framePath } from "@/lib/hero";
import { site } from "@/content/site";

const { hero } = site;

/** Abertura da página: sequência de frames do atleta com título, statement e cards. */
export function Hero() {
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const bigLeftTextRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  const handleProgress = (progress: number) => {
    if (heroTextRef.current) {
      const opacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
      heroTextRef.current.style.opacity = String(opacity);
      heroTextRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
    }

    if (bigLeftTextRef.current) {
      const op = Math.min(1, Math.max(0, (progress - 0.1) / 0.08));
      bigLeftTextRef.current.style.opacity = String(op);
      bigLeftTextRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${progress})`;
    }
  };

  return (
    <ScrollSequence
      frameCount={FRAME_COUNT}
      framePath={framePath}
      mobileFocusX={MOBILE_FOCUS_X}
      cards={hero.cards}
      loader={hero.loader}
      onProgress={handleProgress}
    >
      {(visibleCards) => (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
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

          <div
            ref={heroTextRef}
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-5 px-6 pb-24 md:px-12 md:pb-28"
            style={{ transition: "opacity 80ms linear" }}
          >
            <EyebrowBadge>{hero.eyebrow}</EyebrowBadge>
            <h1 className="max-w-[14ch] font-sans text-5xl font-semibold leading-[0.95] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
              {hero.title.line1}
              <br />
              <span className="text-accent">{hero.title.highlight}</span>
            </h1>
            <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
              {hero.lead}
            </p>
          </div>

          <div
            ref={bigLeftTextRef}
            className="pointer-events-none absolute bottom-24 left-6 z-10 hidden max-w-[30%] flex-col gap-4 md:flex md:bottom-28 md:left-12"
            style={{ opacity: 0, transition: "opacity 80ms linear" }}
          >
            <span className="inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]" />
              {hero.statement.kicker}
            </span>
            <h2 className="font-sans font-semibold leading-[0.88] tracking-tighter text-foreground text-[clamp(2.5rem,4.6vw,5.5rem)]">
              {hero.statement.line1}
              <br />
              {hero.statement.line2Prefix} <span className="text-accent">{hero.statement.highlight}</span>
            </h2>
            <p className="max-w-[36ch] font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              {hero.statement.caption}
            </p>
          </div>

          <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
            <div className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
              {hero.statusLabel}
            </span>
          </div>

          <p className="pointer-events-none absolute left-16 top-[6.25rem] z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400 md:left-auto md:right-10 md:top-24">
            {hero.photoCredit}
          </p>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
              <div
                ref={progressFillRef}
                className="h-full origin-left bg-accent"
                style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
              />
            </div>
            <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
              <span>SEQ 001 / {FRAME_COUNT}</span>
              <span>{hero.bottomBar.center}</span>
              <span>{hero.bottomBar.scrollHint} &darr;</span>
            </div>
          </div>

          {hero.cards.map((d, i) => {
            const visible = visibleCards.has(d.id);
            const position =
              i === 0
                ? "top-[22%] right-6 md:right-12"
                : i === 1
                ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
                : "bottom-24 right-6 md:bottom-28 md:right-12";
            return (
              <div
                key={d.id}
                className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}
              >
                <figure
                  className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  <blockquote className="font-sans text-xl font-medium leading-snug tracking-tight text-foreground">
                    &ldquo;{d.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between">
                    <span className="font-sans text-sm text-zinc-300">{d.speaker}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                      {d.source}
                    </span>
                  </figcaption>
                </figure>
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-x-0 top-[38%] z-20 flex flex-col gap-3 px-6 md:hidden">
            {hero.cards.map((d) => {
              const visible = visibleCards.has(d.id);
              return (
                <figure
                  key={d.id}
                  className={`card-surface pointer-events-auto p-5 transition-all duration-400 ease-out ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <blockquote className="font-sans text-base font-medium leading-snug text-foreground">
                    &ldquo;{d.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 flex items-center justify-between">
                    <span className="font-sans text-xs text-zinc-300">
                      {d.speaker}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                      {d.source}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </>
      )}
    </ScrollSequence>
  );
}
