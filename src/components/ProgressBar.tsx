interface Props {
  step: number; // 1-based
  total?: number;
}

export function ProgressBar({ step, total = 3 }: Props) {
  return (
    <div
      role="progressbar"
      aria-label={`الخطوة ${step} من ${total}`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      className="flex items-center gap-3"
    >
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <span
              className="block h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: i < step ? "100%" : "0%" }}
            />
          </span>
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-500" aria-hidden="true">
        {step} / {total}
      </span>
    </div>
  );
}
