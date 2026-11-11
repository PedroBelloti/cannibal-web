import Image from "next/image";
import { BrandGlyph } from "@/components/ui/BrandGlyph";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

const { sponsorCall } = site;

const GLYPH = "h-[1.15em] w-auto shrink-0";

/** Chamada para patrocínio: a foto da vitória numa metade, a frase e os dois botões de contato na outra. */
export function SponsorCall() {
  return (
    <section
      id="patrocinio"
      className="pin-screen scroll-mt-(--nav-h) bg-ground"
    >
      <div className="pin-screen-body wide:grid wide:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden wide:aspect-auto">
          <Image
            src={sponsorCall.photo.src}
            alt={sponsorCall.photo.alt}
            fill
            sizes="(min-width: 64rem) 50vw, (orientation: landscape) 50vw, 100vw"
            className="drift object-cover object-[50%_30%]"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 px-(--margin) py-14">
          <h2 className="rise text-display">{sponsorCall.title}</h2>
          <p className="rise rise-late max-w-[30ch] text-lead font-semibold text-ink">
            {sponsorCall.body}
          </p>
          {/* A entrada fica no invólucro: no botão ela disputaria o `translate` do toque. */}
          <div className="rise rise-late flex flex-wrap gap-3">
            <Button
              href={sponsorCall.cta.href}
              icon={<BrandGlyph name="whatsapp" className={GLYPH} />}
              className="w-full sm:w-auto"
            >
              {sponsorCall.cta.label}
            </Button>
            <Button
              href={sponsorCall.instagram.href}
              tone="quiet"
              icon={<BrandGlyph name="instagram" className={GLYPH} />}
              className="w-full sm:w-auto"
            >
              {sponsorCall.instagram.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
