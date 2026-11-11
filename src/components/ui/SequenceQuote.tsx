type Props = {
  quote: string;
  /** Sem autor e origem a frase é do site: sai sem aspas e sem assinatura. */
  speaker?: string;
  source?: string;
  /** Vem dos ids que `ScrollSequence` entrega; fora da janela a frase fica no DOM, transparente. */
  visible: boolean;
  className?: string;
};

const EASE = "duration-300 ease-out motion-reduce:transition-none";

/** Frase de uma sequência, solta sobre a foto: uma por vez, no lugar que a seção definir. */
export function SequenceQuote({ quote, speaker, source, visible, className }: Props) {
  const classes = [
    `transition-[translate] ${EASE}`,
    visible ? "translate-y-0" : "pointer-events-none translate-y-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  // A opacidade vai em cada texto, não na figure: as frases ficam empilhadas no mesmo lugar e
  // quem mede sobreposição (inspect.mjs da skill de design) lê a opacidade do próprio elemento.
  const fade = `transition-opacity ${EASE} ${visible ? "opacity-100" : "opacity-0"}`;

  const line = `max-w-[26ch] text-lead font-semibold tracking-[-0.02em] text-ink ${fade}`;

  if (!speaker || !source) {
    return (
      <div className={classes}>
        <p className={line}>{quote}</p>
      </div>
    );
  }

  return (
    <figure className={classes}>
      <blockquote className={line}>&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className={`mt-3 text-small text-ink wide:text-muted ${fade}`}>
        {speaker}, {source}
      </figcaption>
    </figure>
  );
}
