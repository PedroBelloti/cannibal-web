import Image from "next/image";
import { site } from "@/content/site";

const { team } = site;

/** Equipe: a foto do ringue na largura toda e, embaixo, o título e uma coluna estreita de texto. */
export function Team() {
  return (
    <section id="equipe" className="scroll-mt-(--nav-h) bg-ground">
      <div className="relative aspect-[3/2] w-full overflow-hidden wide:aspect-auto wide:h-[calc(100svh-var(--nav-h))]">
        {/* O corte da tela larga tira o teto do ginásio e mantém as cabeças e o calção da equipe. */}
        <Image
          src={team.photo.src}
          alt={team.photo.alt}
          fill
          sizes="100vw"
          className="object-cover object-[50%_56%]"
        />
        {/* O mesmo véu do Hero: o alto desta foto é claro e o crédito some sem ele. */}
        <div className="pointer-events-none absolute inset-0 bg-scrim" />
        {team.photo.credit && (
          <p className="absolute right-(--margin) top-1 z-10 text-small text-ink">
            {team.photo.credit}
          </p>
        )}
      </div>
      <div className="grid gap-6 px-(--margin) py-12 wide:grid-cols-2 wide:py-20">
        <h2 className="rise max-w-[14ch] text-balance text-head font-extrabold tracking-[-0.03em]">
          {team.title}
        </h2>
        <p className="rise rise-late max-w-[44ch] text-body text-ink">{team.body}</p>
      </div>
    </section>
  );
}
