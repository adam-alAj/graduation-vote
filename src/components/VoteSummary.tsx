import { AlertCircle, ArrowRight, Loader2, Lock, Send } from "lucide-react";
import type { Concept } from "../data/concepts";
import { reasonLabel } from "../data/reasons";

interface Props {
  concept: Concept;
  selectedReasons: string[];
  otherReason: string;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

export function VoteSummary({
  concept,
  selectedReasons,
  otherReason,
  submitting,
  error,
  onBack,
  onSubmit,
}: Props) {
  const Icon = concept.icon;
  const other = otherReason.trim();

  return (
    <section aria-labelledby="summary-title" className="mx-auto max-w-2xl">
      <div className="text-center">
        <h2 id="summary-title" className="text-2xl font-extrabold sm:text-3xl">
          راجع اختيارك قبل الإرسال
        </h2>
      </div>

      <div className="surface mt-7 space-y-6 p-5 sm:p-6">
        <div>
          <h3 className="text-sm font-bold text-slate-500">اختيارك</h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-lg font-bold leading-snug text-slate-900">{concept.title}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500">أسباب اختيارك</h3>
          {selectedReasons.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {selectedReasons.map((id) => (
                <li
                  key={id}
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-800"
                >
                  {reasonLabel(id)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-slate-500">لم تحدد أسبابًا، وهذا لا بأس به.</p>
          )}
        </div>

        {other && (
          <div>
            <h3 className="text-sm font-bold text-slate-500">ملاحظتك</h3>
            <p className="mt-2 whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-4 leading-7 text-slate-700">
              {other}
            </p>
          </div>
        )}
      </div>

      <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-slate-500">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          تصويتك مجهول، ونستخدمه فقط لمعرفة الرأي حول فكرة مشروع التخرج. لا نطلب منك اسمًا أو بريدًا
          أو حسابًا.
        </span>
      </p>

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6">{error}</p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-ghost"
          aria-label="تعديل"
        >
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">تعديل</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          aria-busy={submitting}
          className="btn-primary flex-1"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              جارٍ الإرسال…
            </>
          ) : error ? (
            "إعادة المحاولة"
          ) : (
            <>
              إرسال التصويت
              <Send className="h-5 w-5 -scale-x-100" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
