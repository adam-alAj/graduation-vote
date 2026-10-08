import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { reasons } from "../data/reasons";

const MAX_OTHER = 500;

interface Props {
  selectedReasons: string[];
  onToggle: (id: string) => void;
  otherReason: string;
  onOtherChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ReasonSelector({
  selectedReasons,
  onToggle,
  otherReason,
  onOtherChange,
  onBack,
  onNext,
}: Props) {
  return (
    <section aria-labelledby="reasons-title" className="mx-auto max-w-2xl">
      <div className="text-center">
        <h2 id="reasons-title" className="text-2xl font-extrabold sm:text-3xl">
          لماذا اخترت هذا الخيار؟
        </h2>
        <p className="mt-2 text-slate-600">اختر سببًا أو أكثر يعبّر عن رأيك، ويمكنك إضافة تعليقك الخاص.</p>
      </div>

      <p className="surface mt-5 rounded-2xl border-indigo-100 bg-indigo-50/60 p-3.5 text-sm leading-6 text-indigo-900">
        <strong>ملاحظة:</strong> إجابتك على هذا السؤال ستظهر للزوار الآخرين ضمن آراء المشاركين،
        بدون اسمك أو أي معلومات شخصية.
      </p>

      <div
        role="group"
        aria-labelledby="reasons-title"
        className="mt-7 flex flex-wrap justify-center gap-2.5"
      >
        {reasons.map((r) => {
          const on = selectedReasons.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(r.id)}
              className={[
                "inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 px-4 py-2 text-[15px] font-semibold transition duration-150 active:scale-[0.97]",
                on
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200",
              ].join(" ")}
            >
              {on && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
              {r.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <label htmlFor="other-reason" className="text-lg font-bold text-slate-900">
          هل تريد إضافة تعليق؟
        </label>
        <textarea
          id="other-reason"
          value={otherReason}
          maxLength={MAX_OTHER}
          rows={4}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="اكتب رأيك أو وضّح سبب اختيارك..."
          className="mt-2 w-full resize-none rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 placeholder:text-slate-400 focus:border-indigo-500"
        />
        <p className="mt-2 text-sm text-slate-500">💬 سيظهر تعليقك للزوار الآخرين بشكل مجهول.</p>
        <p className="mt-1 text-end text-xs text-slate-400" aria-hidden="true">
          {otherReason.length} / {MAX_OTHER}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={onBack} className="btn-ghost" aria-label="رجوع">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">رجوع</span>
        </button>
        <button type="button" onClick={onNext} className="btn-primary flex-1">
          متابعة
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
