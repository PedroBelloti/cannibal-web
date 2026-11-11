import Image from "next/image";
import type { FooterGroup } from "@/content/site";
import { site } from "@/content/site";

const { brand, footer } = site;

const TEXT_LINK = "underline decoration-2 underline-offset-[0.2em] transition-colors duration-150 hover:text-muted";

function GroupBlock({ id, group, note }: { id?: string; group: FooterGroup; note?: string }) {
  return (
    <div id={id} className="scroll-mt-[calc(var(--nav-h)+1rem)]">
      <h3 className="text-lead font-semibold text-ink">{group.title}</h3>
      <ul className="mt-4 flex flex-col gap-2 text-body">
        {group.items.map((item) => (
          <li key={item.name}>
            {item.href ? (
              <a href={item.href} className={TEXT_LINK}>
                {item.name}
              </a>
            ) : (
              item.name
            )}
            {item.note && <span className="text-muted"> · {item.note}</span>}
          </li>
        ))}
      </ul>
      {note && <p className="mt-4 text-small text-muted">{note}</p>}
    </div>
  );
}

/**
 * Rodapé: o menu das seções em letra grande ao lado do recorte do protetor, os blocos de contato
 * e parceiros, e o nome na largura toda fechando a página. Nada aqui tem entrada animada: é a
 * última tela e não há scroll adiante para completá-la.
 */
export function Footer() {
  return (
    <footer className="overflow-hidden bg-ground px-(--margin) pb-(--margin) pt-20 wide:pt-28">
      <div className="grid gap-12 wide:grid-cols-2">
        <nav aria-label={footer.menu.label}>
          <ul>
            {footer.menu.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-block py-1 text-head font-extrabold tracking-[-0.03em] text-ink transition-[translate] duration-200 ease-out hover:translate-x-2 motion-reduce:transition-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <figure>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={footer.photo.src}
              alt={footer.photo.alt}
              fill
              sizes="(min-width: 64rem) 50vw, (orientation: landscape) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {footer.photo.credit && (
            <figcaption className="mt-3 text-small text-muted">{footer.photo.credit}</figcaption>
          )}
        </figure>
      </div>

      <div className="mt-16 grid gap-10 wide:grid-cols-[1fr_1fr_2fr]">
        <GroupBlock id="contato" group={footer.contact} />
        <GroupBlock group={footer.partners} note={footer.disclaimer} />
        <p className="max-w-[44ch] text-small text-muted wide:justify-self-end">{footer.legal}</p>
      </div>

      {/* 9.35 é a largura do nome medida em em, com folga; mudou o nome ou a fonte, meça de novo. */}
      <p className="mt-16 whitespace-nowrap text-[calc((100vw-2*var(--margin))/9.35)] font-extrabold leading-[0.8] tracking-[-0.05em] text-ink">
        {brand.name}
      </p>
    </footer>
  );
}
