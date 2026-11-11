import Image from "next/image";
import { RecordMarks } from "@/components/ui/RecordMarks";
import { site } from "@/content/site";

const { record } = site;

const wins = record.methods.reduce((sum, method) => sum + method.count, 0);
const winRate = Math.round((wins / (wins + record.loss.count)) * 100);

/**
 * Cartel: o percentual de vitórias gigante em cima, como título, e os métodos de vitória embaixo;
 * a foto ocupa a outra metade na composição larga e fecha a seção na pilha em pé.
 */
export function FightRecord() {
  return (
    <section id="cartel" className="pin-screen scroll-mt-(--nav-h) bg-ground">
      <div className="pin-screen-body wide:grid wide:grid-cols-2">
        <div className="flex flex-col gap-8 px-(--margin) pb-(--margin) pt-14 wide:pt-10">
          <h2 className="rise flex flex-wrap items-baseline-last gap-x-5 gap-y-3">
            <span className="-ml-[0.03em] whitespace-nowrap text-[44vw] font-extrabold leading-[0.8] tracking-[-0.06em] wide:text-[min(15.5vw,36svh)]">
              {winRate}%
            </span>
            <span className="flex flex-col">
              <span className="text-lead font-semibold">{record.rate.label}</span>
              <span className="text-lead font-semibold text-muted">{record.rate.note}</span>
            </span>
          </h2>
          {/* Preso ao pé da tela fixa, este bloco não completaria a faixa de `.rise`. */}
          <div className="rise-entry wide:mt-auto">
            <RecordMarks
              label={record.filterLabel}
              legend={record.legend}
              methods={record.methods}
              loss={record.loss}
            />
          </div>
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
      </div>
    </section>
  );
}
