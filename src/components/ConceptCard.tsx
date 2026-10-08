import { ArrowLeft, Check } from "lucide-react";
import type { Concept } from "../data/concepts";

interface Props {
  concept: Concept;
  selected: boolean;
  onSelect: () => void;
}

export function ConceptCard({ concept, selected, onSelect }: Props) {
  const Icon = concept.icon;

  return (
    // The whole card is clickable for mouse/touch; the button inside is the
    // accessible control for keyboard and screen-reader users.
    <article
      onClick={onSelect}
      className={[
        "relative flex h-full cursor-pointer flex-col rounded-3xl border-2 bg-white p-5 transition duration-200 sm:p-6",
        selected
          ? "-translate-y-1 border-indigo-500 shadow-lift"
          : "border-slate-200 shadow-card hover:border-indigo-200 hover:shadow-md",
      ].join(" ")}
    >
      <header className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="flex-1 text-lg font-bold leading-snug">{concept.title}</h3>
        <span
          aria-hidden="true"
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition",
            selected
              ? "scale-100 border-indigo-600 bg-indigo-600 text-white"
              : "border-slate-300 bg-white text-transparent",
          ].join(" ")}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      </header>

      <p className="mt-4 text-[15px] leading-7 text-slate-600">{concept.description}</p>

      <section className="mt-5">
        <h4 className="text-sm font-bold text-slate-900">كيف تعمل؟</h4>
        <ol className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {concept.howItWorks.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {step}
              </span>
              {i < concept.howItWorks.length - 1 && (
                <ArrowLeft className="h-4 w-4 text-slate-400" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5">
        <h4 className="text-sm font-bold text-slate-900">أين يدخل الذكاء الاصطناعي؟</h4>
        <p className="mt-1.5 text-[15px] leading-7 text-slate-600">{concept.aiRole}</p>
      </section>

      <section className="mt-5">
        <h4 className="text-sm font-bold text-slate-900">لماذا قد تكون فكرة قوية؟</h4>
        <ul className="mt-2 space-y-2">
          {concept.strengths.map((s) => (
            <li key={s} className="flex gap-2.5 text-[15px] leading-6 text-slate-600">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500"
              />
              {s}
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        aria-pressed={selected}
        aria-label={`${selected ? "تم اختيار" : "اختيار"}: ${concept.title}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={[
          "btn mt-6 w-full",
          selected
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "border border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50",
        ].join(" ")}
      >
        {selected ? (
          <>
            <Check className="h-5 w-5" aria-hidden="true" />
            تم الاختيار
          </>
        ) : (
          "اختر هذه الفكرة"
        )}
      </button>
    </article>
  );
}
