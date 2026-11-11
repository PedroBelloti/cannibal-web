"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { PinnedTitle } from "@/components/ui/PinnedTitle";
import { ScrollSequence } from "@/components/ui/ScrollSequence";
import { SequenceQuote } from "@/components/ui/SequenceQuote";
import {
  FRAME_COUNT,
  HERO_SECTION_ID,
  HERO_TEXT_FADE_END,
  MOBILE_FOCUS_X,
  POSTER_FRAME,
  framePath,
} from "@/lib/hero";
import { site } from "@/content/site";

const { hero } = site;

/**
 * Abertura da página: o nome preso em dois cantos enquanto a sequência do atleta passa por
 * trás. O texto de apoio e o botão ocupam o mesmo lugar em que depois entram as frases.
 */
export function Hero() {
  const introRef = useRef<HTMLDivElement | null>(null);

  const handleProgress = (progress: number) => {
    const intro = introRef.current;
    if (!intro) return;
    const opacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
    intro.style.opacity = String(opacity);
    // Transparente, o botão não pode continuar recebendo foco nem clique.
    intro.inert = opacity === 0;
  };

  return (
    <ScrollSequence
      id={HERO_SECTION_ID}
      frameCount={FRAME_COUNT}
      framePath={framePath}
      portraitFocusX={MOBILE_FOCUS_X}
      posterFrame={POSTER_FRAME}
      cards={hero.cards}
      loader={hero.loader}
      onProgress={handleProgress}
    >
      {(visibleCards) => (
        <>
          <div className="pointer-events-none absolute inset-0 bg-scrim" />

          <PinnedTitle as="h1" top={hero.title.top} bottom={hero.title.bottom} bottomSide="right" />

          <p className="absolute right-(--margin) top-[calc(var(--nav-h)+0.25rem)] z-10 text-small text-ink">
            {hero.photoCredit}
          </p>

          <div className="absolute inset-x-(--margin) bottom-(--margin) z-20 h-(--slot-h) wide:right-auto wide:w-[min(46vw,34rem)]">
            <div
              ref={introRef}
              className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-5"
              style={{ transition: "opacity 80ms linear" }}
            >
              <p className="max-w-[44ch] text-body text-ink">{hero.lead}</p>
              <Button href={hero.cta.href} className="w-full sm:w-auto">
                {hero.cta.label}
              </Button>
            </div>

            {hero.cards.map((card) => (
              <SequenceQuote
                key={card.id}
                quote={card.quote}
                speaker={card.speaker}
                source={card.source}
                visible={visibleCards.has(card.id)}
                className="absolute inset-x-0 top-0 wide:bottom-0 wide:top-auto"
              />
            ))}
          </div>
        </>
      )}
    </ScrollSequence>
  );
}
