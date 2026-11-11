import type { ReactNode } from "react";

type Props = {
  href: string;
  /** `"sm"` é o tamanho da barra de navegação. */
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
};

const SIZE_CLASS = {
  md: "h-12 px-6 text-body",
  sm: "h-10 px-4 text-small",
} as const;

/** A única forma de botão da página: retângulo sólido na cor de destaque, para a ação principal. */
export function Button({ href, size = "md", className, children }: Props) {
  const classes = [
    "inline-flex items-center justify-center whitespace-nowrap bg-accent font-semibold text-white",
    "transition-[background-color,translate] duration-150 hover:bg-accent-hover active:translate-y-px",
    SIZE_CLASS[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
