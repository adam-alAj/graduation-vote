import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Concept, ConceptId } from "../data/concepts";
import { ConceptCard } from "./ConceptCard";

interface Props {
  concepts: Concept[]; // already in display order
  selected: ConceptId | null;
  onSelect: (id: ConceptId) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ConceptComparison({ concepts, selected, onSelect, onBack, onNext }: Props) {
  return (
    <section aria-labelledby="compare-title">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="compare-title" className="text-2xl font-extrabold sm:text-3xl">
          اقرأوا الفكرتين ثم اختاروا
        </h2>
        <p className="mt-2 text-slate-600">
          اضغطوا على الفكرة التي ترونها أفضل. يمكنكم تغيير اختياركم في أي وقت.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 md:items-stretch">
        {concepts.map((c) => (
          <ConceptCard
            key={c.id}
            concept={c}
            selected={selected === c.id}
            onSelect={() => onSelect(c.id)}
          />
        ))}
      </div>

      {/* Sticky action bar: always reachable on phones */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-slate-200 bg-paper/95 px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button type="button" onClick={onBack} className="btn-ghost" aria-label="رجوع">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">رجوع</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!selected}
            className="btn-primary flex-1"
          >
            {selected ? "هذا اختياري" : "اختر فكرة للمتابعة"}
            {selected && <ArrowLeft className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
