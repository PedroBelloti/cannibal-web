import Image from "next/image";
import { site } from "@/content/site";

const { team } = site;

/** Equipe: a foto do ringue na largura toda e, embaixo, o título e uma coluna estreita de texto. */
export function Team() {
  return (
    <section id="equipe" className="scroll-mt-(--nav-h) bg-ground">
      <div className="relative aspect-[3/2] max-h-[92svh] w-full overflow-hidden">
        {/* Ancorada embaixo: quando a altura é cortada, o calção com o nome da equipe fica. */}
        <Image
          src={team.photo.src}
          alt={team.photo.alt}
          fill
          sizes="100vw"
          className="drift object-cover object-[50%_85%]"
        />
        {team.photo.credit && (
          // Fundo cheio: o alto desta foto é claro e o texto solto some nele.
          <p className="absolute right-0 top-0 bg-ground px-(--margin) py-2 text-small text-ink">
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
