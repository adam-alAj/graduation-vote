import { useEffect, useMemo, useRef, useState } from "react";
import { concepts, conceptById, type ConceptId } from "./data/concepts";
import { friendlyError, hasVoted, submitVote } from "./lib/voting";
import { ProgressBar } from "./components/ProgressBar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ConceptComparison } from "./components/ConceptComparison";
import { ReasonSelector } from "./components/ReasonSelector";
import { VoteSummary } from "./components/VoteSummary";
import { Results } from "./components/Results";

type Step = "welcome" | "concepts" | "reasons" | "summary" | "results";

const STEP_NUMBER: Partial<Record<Step, number>> = {
  concepts: 1,
  reasons: 2,
  summary: 3,
};
// The number of steps in the progress bar is one less than the total number of steps
export default function App() {
  // A browser that already voted goes straight to the results.
  const [step, setStep] = useState<Step>(() => (hasVoted() ? "results" : "welcome"));
  const [justVoted, setJustVoted] = useState(false);
  const [selected, setSelected] = useState<ConceptId | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submittingRef = useRef(false); // blocks rapid double-clicks
  const mainRef = useRef<HTMLElement>(null);

  // Show the two concepts in a random order per visitor so position can't bias the poll.
  const ordered = useMemo(
    () => (Math.random() < 0.5 ? concepts : [...concepts].reverse()),
    [],
  );

  // Move focus/scroll to the top of the new screen.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [step]);

  function toggleReason(id: string) {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (!selected || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      await submitVote({ concept: selected, reasons: selectedReasons, otherReason });
      setJustVoted(true);
      setStep("results");
    } catch (e) {
      setError(friendlyError(e, "submit"));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const progress = STEP_NUMBER[step];

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-4xl px-4 pt-5 sm:pt-8">
        {progress ? <ProgressBar step={progress} /> : <div className="h-[22px]" aria-hidden="true" />}
      </header>

      <main
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto max-w-4xl px-4 pb-10 pt-6 outline-none sm:pt-8"
      >
        <div key={step} className="animate-fade-up">
          {step === "welcome" && <WelcomeScreen onStart={() => setStep("concepts")} />}

          {step === "concepts" && (
            <ConceptComparison
              concepts={ordered}
              selected={selected}
              onSelect={setSelected}
              onBack={() => setStep("welcome")}
              onNext={() => selected && setStep("reasons")}
            />
          )}

          {step === "reasons" && (
            <ReasonSelector
              selectedReasons={selectedReasons}
              onToggle={toggleReason}
              otherReason={otherReason}
              onOtherChange={setOtherReason}
              onBack={() => setStep("concepts")}
              onNext={() => setStep("summary")}
            />
          )}

          {step === "summary" && selected && (
            <VoteSummary
              concept={conceptById(selected)}
              selectedReasons={selectedReasons}
              otherReason={otherReason}
              submitting={submitting}
              error={error}
              onBack={() => {
                setError(null);
                setStep("reasons");
              }}
              onSubmit={() => void handleSubmit()}
            />
          )}

          {step === "results" && <Results justVoted={justVoted} />}
        </div>
      </main>
    </div>
  );
}
