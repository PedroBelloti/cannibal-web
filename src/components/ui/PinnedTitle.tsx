import type { Ref } from "react";

type Props = {
  as?: "h1" | "h2";
  top: string;
  bottom: string;
  /** Canto de baixo em que a segunda palavra encosta na composição larga. */
  bottomSide: "left" | "right";
  /** Para quem alterna dois títulos no mesmo lugar: opacidade inicial e transição. */
  className?: string;
  ref?: Ref<HTMLHeadingElement>;
};

/**
 * Título preso em dois cantos da sequência: `top` logo abaixo da navbar, à esquerda, e `bottom`
 * no canto de baixo (larga) ou acima do texto de apoio (pilha em pé, que usa `--slot-h`).
 * Precisa de um ancestral posicionado; dentro de `ScrollSequence` é o contêiner sticky.
 */
export function PinnedTitle({ as: Tag = "h1", top, bottom, bottomSide, className, ref }: Props) {
  const side = bottomSide === "right" ? "wide:left-auto wide:right-(--margin)" : "";
  const classes = ["pointer-events-none text-display text-ink", className].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={classes}>
      <span className="absolute left-(--margin) top-(--nav-h) z-10 whitespace-nowrap">{top}</span>{" "}
      <span
        className={`absolute bottom-[calc(var(--margin)+var(--slot-h)+0.75rem)] left-(--margin) z-10 whitespace-nowrap wide:bottom-(--margin) ${side}`}
      >
        {bottom}
      </span>
    </Tag>
  );
}
