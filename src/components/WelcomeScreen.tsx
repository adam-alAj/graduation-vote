import { Clock, ArrowLeft } from "lucide-react";

interface Props {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: Props) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
        <Clock className="h-4 w-4" aria-hidden="true" />
        التصويت يستغرق أقل من دقيقة
      </span>

      <h1 className="text-3xl font-extrabold leading-snug sm:text-4xl">
        ساعدونا نختار فكرة مشروع التخرج <span aria-hidden="true">👀</span>
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        نحن فريق نعمل على اختيار فكرة مشروع التخرج، ونحتاج رأيكم.
      </p>
      <p className="mt-2 text-base leading-relaxed text-slate-500">
        اقرأوا الفكرتين، اختاروا الفكرة التي ترونها أفضل، وأخبرونا لماذا.
      </p>

      <button type="button" onClick={onStart} className="btn-primary mt-9 w-full max-w-xs text-lg">
        ابدأ التصويت
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}
