import { site } from "@/content/site";

const { names } = site;

const LIST = "flex shrink-0 motion-reduce:shrink motion-reduce:flex-wrap";

function NameList({ clone = false }: { clone?: boolean }) {
  return (
    <ul aria-hidden={clone || undefined} className={clone ? `${LIST} motion-reduce:hidden` : LIST}>
      {names.items.map((name) => (
        <li key={name} className="flex items-center whitespace-nowrap motion-reduce:whitespace-normal">
          {name}
          <span aria-hidden className="mx-[0.3em] size-[0.16em] bg-muted" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Faixa de nomes andando para a esquerda, cortada pelas bordas. A lista é repetida uma vez para a
 * volta não ter emenda; com movimento reduzido a cópia some e os nomes, menores, quebram linha.
 */
export function NamesBand() {
  return (
    <section aria-label={names.label} className="overflow-hidden bg-ground py-16 wide:py-24">
      <div className="names-track flex w-max text-display text-ink motion-reduce:w-auto motion-reduce:px-(--margin) motion-reduce:text-head">
        <NameList />
        <NameList clone />
      </div>
      <p className="rise mt-8 max-w-[34ch] px-(--margin) text-body text-ink">{names.caption}</p>
    </section>
  );
}
