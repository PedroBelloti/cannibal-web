import { HoverBrake } from "@/components/ui/HoverBrake";
import { site } from "@/content/site";

const { names } = site;

const LIST = "flex shrink-0 motion-reduce:shrink motion-reduce:flex-wrap";
const TRACK =
  "names-track flex w-max text-[11vw] font-extrabold leading-[1.1] tracking-[-0.045em] wide:text-[4.4vw]";

// A segunda fileira começa na metade da lista para um nome não passar embaixo dele mesmo.
const half = Math.ceil(names.items.length / 2);
const shifted = [...names.items.slice(half), ...names.items.slice(0, half)];

function NameList({ items, clone = false }: { items: string[]; clone?: boolean }) {
  return (
    <ul aria-hidden={clone || undefined} className={clone ? `${LIST} motion-reduce:hidden` : LIST}>
      {items.map((name) => (
        <li key={name} className="flex items-center whitespace-nowrap motion-reduce:whitespace-normal">
          {name}
          <span aria-hidden className="mx-[0.42em] size-[0.14em] bg-muted" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Faixa de nomes em duas fileiras que andam em sentidos opostos, a de baixo só em contorno. Cada
 * lista é repetida uma vez para a volta não ter emenda; com movimento reduzido fica só a primeira
 * fileira, parada e quebrando linha. O mouse sobre a faixa freia as duas (`HoverBrake`).
 */
export function NamesBand() {
  return (
    <section aria-label={names.label} className="overflow-hidden bg-ground py-14 wide:py-20">
      <HoverBrake className="names-fade flex flex-col gap-[2.4vw] wide:gap-[1.2vw]">
        <div className={`${TRACK} text-ink motion-reduce:w-auto motion-reduce:px-(--margin) motion-reduce:text-[9.5vw] motion-reduce:wide:text-[4.4vw]`}>
          <NameList items={names.items} />
          <NameList items={names.items} clone />
        </div>
        <div aria-hidden className={`${TRACK} names-track-back names-outline motion-reduce:hidden`}>
          <NameList items={shifted} />
          <NameList items={shifted} clone />
        </div>
      </HoverBrake>
      <p className="rise mt-10 max-w-[34ch] px-(--margin) text-body text-ink">{names.caption}</p>
    </section>
  );
}
