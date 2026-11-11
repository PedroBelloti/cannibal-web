import Image from "next/image";
import { RecordMarks } from "@/components/ui/RecordMarks";
import { site } from "@/content/site";

const { record } = site;

/**
 * Cartel: a frase em cima, as nove lutas no meio e o placar gigante embaixo; a foto ocupa a outra
 * metade na composição larga e fecha a seção na pilha em pé.
 */
export function FightRecord() {
  return (
    <section
      id="cartel"
      className="scroll-mt-(--nav-h) bg-ground wide:grid wide:min-h-[calc(100svh-var(--nav-h))] wide:grid-cols-2"
    >
      <div className="flex flex-col gap-8 px-(--margin) pb-(--margin) pt-14 wide:pt-10">
        <h2 className="rise max-w-[14ch] text-balance text-head font-extrabold tracking-[-0.03em]">
          {record.title}
        </h2>
        <div className="rise rise-late">
          <RecordMarks
            label={record.filterLabel}
            legend={record.legend}
            methods={record.methods}
            loss={record.loss}
          />
        </div>
        <p className="rise mt-auto whitespace-nowrap text-[66vw] font-extrabold leading-[0.8] tracking-[-0.06em] wide:text-[min(23vw,36svh)]">
          {record.score}
        </p>
      </div>
      <div className="relative aspect-[9/10] overflow-hidden wide:aspect-auto">
        <Image
          src={record.photo.src}
          alt={record.photo.alt}
          fill
          sizes="(min-width: 64rem) 50vw, (orientation: landscape) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </section>
  );
}
