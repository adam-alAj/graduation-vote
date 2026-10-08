import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, RefreshCw, Share2 } from "lucide-react";
import { concepts } from "../data/concepts";
import {
  fetchStats,
  friendlyError,
  percentages,
  voteLabel,
  type VoteStats,
} from "../lib/voting";

const POLL_MS = 20000;

interface Props {
  justVoted: boolean;
}

export function Results({ justVoted }: Props) {
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const hasData = useRef(false);

  const load = useCallback(async (silent: boolean) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const s = await fetchStats();
      setStats(s);
      setError(null);
      hasData.current = true;
    } catch (e) {
      // A failed background refresh keeps showing the last good numbers.
      if (!silent || !hasData.current) setError(friendlyError(e, "load"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
    const id = setInterval(() => void load(true), POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  // Let the bars grow from 0 the first time data arrives.
  useEffect(() => {
    if (stats && !animate) {
      const t = setTimeout(() => setAnimate(true), 80);
      return () => clearTimeout(t);
    }
  }, [stats, animate]);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}`;
    const data = {
      title: "ساعدونا نختار فكرة مشروع التخرج",
      text: "نحتاج رأيك! صوّت في أقل من دقيقة:",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await copy(url);
      setShareNote("تم نسخ الرابط ✓");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // user closed the sheet
      try {
        await copy(url);
        setShareNote("تم نسخ الرابط ✓");
      } catch {
        setShareNote("تعذّر النسخ. انسخ الرابط من شريط العنوان.");
      }
    }
    setTimeout(() => setShareNote(null), 3500);
  }

  const pct = stats ? percentages(stats) : null;

  return (
    <section aria-labelledby="results-title" className="mx-auto max-w-2xl">
      <div className="text-center">
        {justVoted && (
          <p className="mb-2 text-2xl font-extrabold text-slate-900">
            شكرًا لمشاركتك <span aria-hidden="true">❤️</span>
          </p>
        )}
        <h2
          id="results-title"
          className={justVoted ? "text-lg font-semibold text-slate-600" : "text-2xl font-extrabold"}
        >
          {justVoted ? "وهذه هي النتيجة الحالية" : "شكرًا لمشاركتك، هذه هي النتيجة الحالية"}
        </h2>
      </div>

      <div className="surface mt-7 p-5 sm:p-6" aria-live="polite">
        {loading && !stats && (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            جارٍ تحميل النتائج…
          </div>
        )}

        {error && !stats && (
          <div role="alert" className="py-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-500" aria-hidden="true" />
            <p className="mt-3 leading-7 text-slate-700">{error}</p>
            <button type="button" onClick={() => void load(false)} className="btn-outline mt-4">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {stats && pct && stats.total === 0 && (
          <p className="py-10 text-center text-lg text-slate-500">لم يبدأ التصويت بعد.</p>
        )}

        {stats && pct && stats.total > 0 && (
          <>
            <ul className="space-y-7">
              {concepts.map((c) => {
                const p = pct[c.id];
                const count = stats[c.id];
                return (
                  <li key={c.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-base font-bold leading-snug">{c.title}</h3>
                      <span className="text-2xl font-extrabold tabular-nums text-indigo-700">
                        {p}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={c.title}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={p}
                      className="mt-2 h-3.5 overflow-hidden rounded-full bg-slate-100"
                    >
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-[width] duration-1000 ease-out"
                        style={{ width: animate ? `${p}%` : "0%" }}
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-slate-500">{voteLabel(count)}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 border-t border-slate-100 pt-4 text-center font-bold text-slate-700">
              إجمالي الأصوات: {stats.total}
            </p>
          </>
        )}

        {error && stats && (
          <p className="mt-4 text-center text-sm text-amber-700">
            تعذّر تحديث الأرقام الآن، وهذه آخر نتيجة وصلتنا.
          </p>
        )}
      </div>

      <div className="surface mt-5 p-5 text-center sm:p-6">
        <h3 className="text-lg font-bold">ساعدنا نسمع آراء أكثر</h3>
        <p className="mt-1 text-sm text-slate-500">أرسل الرابط لأصدقائك وزملائك.</p>
        <button type="button" onClick={() => void share()} className="btn-primary mt-4 w-full sm:w-auto">
          <Share2 className="h-5 w-5" aria-hidden="true" />
          شارك رابط التصويت
        </button>
        <p
          role="status"
          className="mt-3 flex min-h-[1.5rem] items-center justify-center gap-1 text-sm font-semibold text-teal-700"
        >
          {shareNote && (
            <>
              {shareNote.includes("✓") && <Check className="h-4 w-4" aria-hidden="true" />}
              {shareNote}
            </>
          )}
        </p>
      </div>
    </section>
  );
}

async function copy(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("copy failed");
}
