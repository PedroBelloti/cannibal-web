"use client";

import { useRef } from "react";
import { PinnedTitle } from "@/components/ui/PinnedTitle";
import { ScrollSequence } from "@/components/ui/ScrollSequence";
import { SequenceQuote } from "@/components/ui/SequenceQuote";
import {
  CINE_FRAME_COUNT,
  CINE_INTRO_FADE_END,
  CINE_MOBILE_FOCUS_X,
  CINE_OUTRO,
  CINE_POSTER_FRAME,
  CINE_TITLE_SWAP,
  cineFramePath,
} from "@/lib/cinematic";
import { site } from "@/content/site";

const { cinematic } = site;

const TITLE_FADE = "transition-opacity duration-200 ease-out motion-reduce:transition-none";
// Texto de apoio, frases e link final dividem a mesma célula: um por vez, no mesmo lugar.
const SLOT_ITEM = "col-start-1 row-start-1 self-start wide:self-center";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function setOpacity(element: HTMLElement | null, opacity: number): number {
  const clamped = clamp01(opacity);
  if (element) element.style.opacity = String(clamped);
  return clamped;
}

// Dois títulos ocupam o mesmo lugar: o transparente sai também da leitura de tela.
function setTitleOpacity(title: HTMLElement | null, opacity: number) {
  const shown = setOpacity(title, opacity) > 0;
  if (title) title.style.visibility = shown ? "visible" : "hidden";
}

/**
 * Trajetória: mesma peça do Hero, em coluna à esquerda, com o atleta livre à direita. O título
 * troca no meio da sequência e o link para o cartel entra depois da última frase.
 */
export function CinematicReveal() {
  const titleBeforeRef = useRef<HTMLHeadingElement | null>(null);
  const titleAfterRef = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const outroRef = useRef<HTMLAnchorElement | null>(null);

  const handleProgress = (progress: number) => {
    const { at, span } = CINE_TITLE_SWAP;
    setOpacity(introRef.current, 1 - progress / CINE_INTRO_FADE_END);
    setTitleOpacity(titleBeforeRef.current, (at - progress) / span);
    setTitleOpacity(titleAfterRef.current, (progress - at) / span);

    const outro = outroRef.current;
    if (!outro) return;
    // Transparente, o link não pode continuar recebendo foco nem clique, nem contar como texto
    // grande na tela.
    const hidden = setOpacity(outro, (progress - CINE_OUTRO.start) / CINE_OUTRO.span) === 0;
    outro.inert = hidden;
    outro.style.visibility = hidden ? "hidden" : "visible";
  };

  return (
    <ScrollSequence
      id="trajetoria"
      frameCount={CINE_FRAME_COUNT}
      framePath={cineFramePath}
      portraitFocusX={CINE_MOBILE_FOCUS_X}
      posterFrame={CINE_POSTER_FRAME}
      loading="lazy"
      cards={cinematic.cards}
      loader={cinematic.loader}
      onProgress={handleProgress}
    >
      {(visibleCards) => (
        <>
          <div className="pointer-events-none absolute inset-0 bg-scrim" />

          <PinnedTitle
            as="h2"
            ref={titleBeforeRef}
            top={cinematic.titleBefore.top}
            bottom={cinematic.titleBefore.bottom}
            bottomSide="left"
            className={TITLE_FADE}
          />
          <PinnedTitle
            as="h2"
            ref={titleAfterRef}
            top={cinematic.titleAfter.top}
            bottom={cinematic.titleAfter.bottom}
            bottomSide="left"
            className={`${TITLE_FADE} invisible opacity-0`}
          />

          <div className="absolute inset-x-(--margin) bottom-(--margin) z-20 grid h-(--slot-h) wide:bottom-auto wide:right-auto wide:top-1/2 wide:h-auto wide:w-[min(46vw,34rem)] wide:-translate-y-1/2">
            <p
              ref={introRef}
              className={`${SLOT_ITEM} pointer-events-none max-w-[44ch] text-body text-ink`}
              style={{ transition: "opacity 80ms linear" }}
            >
              {cinematic.lead}
            </p>

            {cinematic.cards.map((card) => (
              <SequenceQuote
                key={card.id}
                quote={card.quote}
                speaker={card.speaker}
                source={card.source}
                visible={visibleCards.has(card.id)}
                className={SLOT_ITEM}
              />
            ))}

            {/* `inert`, a opacidade e a visibilidade iniciais valem até a primeira notificação de
                progresso. O z-index põe o link acima dos vizinhos transparentes da célula, que
                cobririam o clique. */}
            <a
              ref={outroRef}
              href={cinematic.outro.href}
              inert
              className={`${SLOT_ITEM} relative z-10 justify-self-start whitespace-nowrap text-head font-extrabold tracking-[-0.03em] text-ink underline decoration-[0.06em] underline-offset-[0.18em] invisible opacity-0`}
              style={{ transition: "opacity 80ms linear" }}
            >
              {cinematic.outro.lead} <span className="text-accent">{cinematic.outro.highlight}</span>
            </a>
          </div>
        </>
      )}
    </ScrollSequence>
  );
}
