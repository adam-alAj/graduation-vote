import { supabase } from "./supabase";
import type { ConceptId } from "../data/concepts";

const STORAGE_KEY = "graduation-vote:submitted:v1";
const REQUEST_TIMEOUT_MS = 15000;

export type VoteErrorKind = "offline" | "config" | "timeout" | "network";

export class VoteError extends Error {
  kind: VoteErrorKind;
  constructor(kind: VoteErrorKind) {
    super(kind);
    this.kind = kind;
  }
}

/** Friendly Arabic message for any error. Never exposes technical details. */
export function friendlyError(err: unknown, action: "submit" | "load"): string {
  const kind = err instanceof VoteError ? err.kind : "network";
  if (kind === "offline") return "لا يوجد اتصال بالإنترنت. تأكد من اتصالك ثم حاول مرة أخرى.";
  if (kind === "timeout") return "الاتصال بطيء حاليًا. حاول مرة أخرى بعد قليل.";
  if (kind === "config") return "الموقع غير جاهز بعد لاستقبال الأصوات. حاول لاحقًا.";
  return action === "submit"
    ? "يبدو أن هناك مشكلة مؤقتة في الاتصال، ولم يصل صوتك بعد. حاول مرة أخرى."
    : "يبدو أن هناك مشكلة مؤقتة في الاتصال. حاول مرة أخرى.";
}

function withTimeout<T>(p: PromiseLike<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new VoteError("timeout")), REQUEST_TIMEOUT_MS);
    Promise.resolve(p).then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

// ---------------------------------------------------------------------------
// Duplicate protection (lightweight, NOT anti-fraud): remembers in this browser
// that a vote was already submitted. Anyone can bypass it by clearing site data.
// ---------------------------------------------------------------------------
export function hasVoted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function markVoted(concept: ConceptId): void {
  try {
    localStorage.setItem(STORAGE_KEY, concept);
  } catch {
    /* storage unavailable (e.g. private mode) – ignore */
  }
}

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------
export interface VotePayload {
  concept: ConceptId;
  reasons: string[];
  otherReason: string;
}

export async function submitVote(payload: VotePayload): Promise<void> {
  if (hasVoted()) return; // second submission from the same browser is ignored
  if (!navigator.onLine) throw new VoteError("offline");
  if (!supabase) throw new VoteError("config");

  const other = payload.otherReason.trim();
  const { error } = await withTimeout(
    supabase.from("votes").insert({
      selected_concept: payload.concept,
      reasons: payload.reasons,
      other_reason: other.length > 0 ? other.slice(0, 500) : null,
    }),
  );
  if (error) throw new VoteError("network");

  markVoted(payload.concept);
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------
export interface VoteStats {
  concept_a: number;
  concept_b: number;
  total: number;
}

export interface PublicVoteResponse {
  selected_concept: ConceptId;
  reasons: string[];
  other_reason: string | null;
}

export async function fetchStats(): Promise<VoteStats> {
  if (!navigator.onLine) throw new VoteError("offline");
  if (!supabase) throw new VoteError("config");

  const { data, error } = await withTimeout(supabase.rpc("get_vote_stats"));
  if (error || data == null) throw new VoteError("network");

  const row = Array.isArray(data) ? data[0] : data;
  const a = Number(row?.concept_a ?? 0);
  const b = Number(row?.concept_b ?? 0);
  return { concept_a: a, concept_b: b, total: a + b };
}

export async function fetchPublicResponses(): Promise<PublicVoteResponse[]> {
  if (!navigator.onLine) throw new VoteError("offline");
  if (!supabase) throw new VoteError("config");

  const { data, error } = await withTimeout(supabase.rpc("get_public_vote_responses"));
  if (error || !Array.isArray(data)) throw new VoteError("network");

  return data
    .filter((row) => row?.selected_concept === "concept_a" || row?.selected_concept === "concept_b")
    .map((row) => ({
      selected_concept: row.selected_concept as ConceptId,
      reasons: Array.isArray(row.reasons) ? row.reasons.filter((v: unknown) => typeof v === "string") : [],
      other_reason: typeof row.other_reason === "string" ? row.other_reason : null,
    }));
}

/**
 * Integer percentages that always add up to exactly 100 (when total > 0).
 * With two options: round the first, and give the second the remainder.
 */
export function percentages(stats: VoteStats): { concept_a: number; concept_b: number } {
  if (stats.total === 0) return { concept_a: 0, concept_b: 0 };
  const a = Math.round((stats.concept_a / stats.total) * 100);
  return { concept_a: a, concept_b: 100 - a };
}

/** Arabic count wording: صوت واحد، صوتان، 5 أصوات، 34 صوتًا */
export function voteLabel(n: number): string {
  if (n === 0) return "0 صوت";
  if (n === 1) return "صوت واحد";
  if (n === 2) return "صوتان";
  if (n <= 10) return `${n} أصوات`;
  return `${n} صوتًا`;
}
