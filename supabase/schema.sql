-- =====================================================================
-- Graduation-project poll: database setup
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query
-- It is safe to re-run.
-- =====================================================================

-- 1) Table ------------------------------------------------------------
create table if not exists public.votes (
  id               uuid primary key default gen_random_uuid(),
  selected_concept text        not null
                   check (selected_concept in ('concept_a', 'concept_b')),
  reasons          text[]      not null default '{}'
                   check (coalesce(array_length(reasons, 1), 0) <= 12),
  other_reason     text
                   check (other_reason is null or char_length(other_reason) <= 500),
  created_at       timestamptz not null default now()
);

-- 2) Row Level Security -----------------------------------------------
alter table public.votes enable row level security;

-- Remove any old versions of the policies so this file can be re-run.
drop policy if exists "Anyone can submit a vote" on public.votes;

-- The public (anon) role may INSERT votes, and nothing else.
-- There is deliberately NO select / update / delete policy:
-- individual votes can never be read or changed from the browser.
create policy "Anyone can submit a vote"
  on public.votes
  for insert
  to anon, authenticated
  with check (true);

-- 3) Table privileges (defence in depth on top of RLS) ----------------
revoke all on public.votes from anon, authenticated;
grant insert on public.votes to anon, authenticated;

-- 4) Aggregate statistics (the ONLY thing the browser can read) -------
-- SECURITY DEFINER lets the function count rows even though the caller
-- has no SELECT access. It returns two numbers and nothing else.
create or replace function public.get_vote_stats()
returns table (concept_a bigint, concept_b bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*) filter (where selected_concept = 'concept_a') as concept_a,
    count(*) filter (where selected_concept = 'concept_b') as concept_b
  from public.votes;
$$;

revoke all on function public.get_vote_stats() from public;
grant execute on function public.get_vote_stats() to anon, authenticated;
