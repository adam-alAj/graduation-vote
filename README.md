# Graduation Project Vote

A small, static, Arabic (RTL) voting site. React + Vite + TypeScript + Tailwind, with Supabase as the database. Deploys to GitHub Pages.

## Project structure

```text
graduation-vote/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── supabase/schema.sql            # table + RLS + stats function (run once)
├── src/
│   ├── components/                # WelcomeScreen, ConceptCard, ConceptComparison,
│   │                              # ReasonSelector, VoteSummary, Results, ProgressBar
│   ├── data/concepts.ts           # concept text (edit content here)
│   ├── data/reasons.ts            # selectable reasons
│   ├── lib/supabase.ts            # Supabase client (anon key only)
│   ├── lib/voting.ts              # submit, stats, percentages, duplicate guard
│   ├── App.tsx                    # step flow
│   └── main.tsx
├── .env.example
└── vite.config.ts
```

## 1. Install and run locally

```bash
npm install
cp .env.example .env     # then fill in the two values (see step 2)
npm run dev              # http://localhost:5173
```

Production build: `npm run build` (output in `dist/`), preview it with `npm run preview`.

## 2. Supabase setup

1. Create a project at https://supabase.com.
2. Open **SQL Editor -> New query**, paste all of `supabase/schema.sql`, and click **Run**.
3. Open **Project Settings -> API** and copy:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon / publishable key** -> `VITE_SUPABASE_ANON_KEY`
4. Put both in `.env`. **Never use the `service_role` key.**

CORS: Supabase's REST API accepts requests from any origin, so the GitHub Pages domain works without extra configuration. You do not need to add it anywhere.

### SQL and RLS (as in `supabase/schema.sql`)

```sql
create table if not exists public.votes (
  id               uuid primary key default gen_random_uuid(),
  selected_concept text        not null check (selected_concept in ('concept_a','concept_b')),
  reasons          text[]      not null default '{}'
                   check (coalesce(array_length(reasons, 1), 0) <= 12),
  other_reason     text        check (other_reason is null or char_length(other_reason) <= 500),
  created_at       timestamptz not null default now()
);

alter table public.votes enable row level security;

create policy "Anyone can submit a vote" on public.votes
  for insert to anon, authenticated with check (true);

revoke all on public.votes from anon, authenticated;
grant insert on public.votes to anon, authenticated;

create or replace function public.get_vote_stats()
returns table (concept_a bigint, concept_b bigint)
language sql stable security definer set search_path = public as $$
  select count(*) filter (where selected_concept = 'concept_a'),
         count(*) filter (where selected_concept = 'concept_b')
  from public.votes;
$$;

revoke all on function public.get_vote_stats() from public;
grant execute on function public.get_vote_stats() to anon, authenticated;
```

To read the individual votes and reasons yourself, use **Table Editor** in the Supabase dashboard (the dashboard is not subject to the browser's restrictions).

## 3. Deploy to GitHub Pages

1. **Create a GitHub repository** (any name).
2. **Push the project:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
3. **Base path:** nothing to do. `vite.config.ts` uses a relative base (`./`), so it works under any repository name. If you ever need an absolute path, set `VITE_BASE_PATH=/<repo>/` as an environment variable in the workflow's build step.
4. **Add the variables as secrets:** repo **Settings -> Secrets and variables -> Actions -> New repository secret**. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. **Enable Pages:** repo **Settings -> Pages -> Source: GitHub Actions**.
6. **Deploy:** the push to `main` runs the workflow (or run it from the **Actions** tab -> *Deploy to GitHub Pages* -> *Run workflow*).
7. **Open the site:** `https://<user>.github.io/<repo>/` (also shown in the workflow run).

Note: the anon key ends up in the built JavaScript. That is expected and safe, because Row Level Security (above) limits what it can do.

## 4. How voting and statistics work

- **Submit:** the browser inserts one row into `votes` using the anon key. RLS allows `INSERT` only. There is no `SELECT`, `UPDATE`, or `DELETE` policy, so individual votes can never be read or altered from the browser.
- **Statistics:** the browser calls the `get_vote_stats()` function. It runs with elevated rights (`security definer`) but returns only two counts. No voter rows are downloaded.
- **Percentages:** `round(a / total * 100)` for the first concept and `100 - that` for the second, so the total is always exactly 100. With zero votes the page shows "لم يبدأ التصويت بعد."
- **Live results:** the results screen refreshes every 20 seconds. If a refresh fails, the last good numbers stay on screen.
- **Neutrality:** both cards share the same layout and styling, and the display order is randomised per visitor.

## 5. Duplicate-vote prevention

After a successful submission the browser stores a flag in `localStorage`. On the next visit it skips straight to the results, and `submitVote` refuses to send a second vote. A double-click is also blocked while a request is in flight.

This is only a lightweight guard against accidental repeats. It is **not** anti-fraud: clearing site data, using another browser, or private mode bypasses it. That is acceptable for an informal opinion poll, so treat the numbers as indicative.

## 6. Testing checklist

- [ ] Welcome -> start -> both concepts are readable on a phone (cards stack, no horizontal scroll).
- [ ] Tapping a card highlights it and shows the check; the other card stays visible; switching works.
- [ ] "هذا اختياري" is disabled until a concept is chosen.
- [ ] Reasons toggle on/off; the optional text box works and shows in the summary.
- [ ] Submit shows a spinner, and rapid double-clicks create only one row (check Table Editor).
- [ ] Results appear immediately; percentages add up to 100; the total matches the table.
- [ ] Fresh database shows "لم يبدأ التصويت بعد."
- [ ] Reloading after voting goes straight to results (clear site data to vote again).
- [ ] Airplane mode: a friendly Arabic error with a retry button, no raw errors.
- [ ] Share button opens the share sheet, or copies the link and shows "تم نسخ الرابط ✓".
- [ ] Keyboard only: Tab reaches every control with a visible focus ring.
- [ ] Deployed site: refresh works, voting works, and `.env` is not in the repository.
