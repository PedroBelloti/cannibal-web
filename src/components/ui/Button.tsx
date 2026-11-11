import type { ReactNode } from "react";

type Props = {
  href: string;
  /** `"sm"` é o tamanho da barra de navegação. */
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
};

const SIZE_CLASS = {
  md: "h-12 gap-3 pl-6 pr-8 text-body",
  sm: "h-10 gap-2 pl-4 pr-6 text-small",
} as const;

// O corte da ponta tem a inclinação das marcas do cartel (8 de largura para 26 de altura).
const PLATE =
  "absolute inset-0 -z-10 overflow-hidden bg-accent [clip-path:polygon(0_0,100%_0,calc(100%-0.875rem)_100%,0_100%)]";
const SWEEP =
  "absolute inset-y-0 -left-4 right-0 origin-left -translate-x-full -skew-x-[17deg] bg-accent-hover transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none";
const ARROW =
  "h-[0.8em] w-auto shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none";

/**
 * A única forma de botão da página, para a ação principal: placa na cor de destaque com a ponta
 * cortada em diagonal e uma seta. Com o ponteiro ou o foco, um tom mais escuro varre a placa e a
 * seta avança. Endereço `http` abre em outra aba.
 */
export function Button({ href, size = "md", className, children }: Props) {
  const external = href.startsWith("http");
  const classes = [
    "group relative isolate inline-flex items-center justify-center whitespace-nowrap font-semibold text-white",
    "transition-[translate] duration-150 active:translate-y-px",
    SIZE_CLASS[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {/* O corte fica na placa, não no link: `clip-path` no link cortaria o contorno de foco. */}
      <span aria-hidden className={PLATE}>
        <span className={SWEEP} />
      </span>
      {children}
      <svg aria-hidden viewBox="0 0 20 14" fill="none" className={ARROW}>
        <path d="M1 7h17M12 1l6 6-6 6" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    </a>
  );
}
