# Credex AI Spend Auditor

Credex audits your company's AI tooling spend and tells you exactly where you're overpaying — in under 2 minutes. It checks your plans, seat counts, and usage patterns against real pricing data and gives you a prioritized savings roadmap. Built for engineering managers and CTOs who are tired of guessing whether their $3k/month AI bill is justified.

**Target users:** Engineering managers, CTOs, and finance leads at 10–200 person companies running 3+ AI tools simultaneously.

**Live app:** `https://your-app.vercel.app` ← replace after deploy

---

## Screenshots

| Landing | Audit Form | Results |
|---------|-----------|---------|
| ![Landing](public/screenshots/landing.png) | ![Form](public/screenshots/form.png) | ![Results](public/screenshots/results.png) |

> **How to add screenshots:** Run `npm run dev`, open each page in browser, press `Win + Shift + S` (Windows) to screenshot, save to `public/screenshots/` as `landing.png`, `form.png`, `results.png`.

---

## Features

- Audits 8 tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf
- Deterministic rule-based engine — no hallucinated math
- GPT-4o-mini personalized 100-word summary
- Shareable audit URLs with OpenGraph previews
- Lead capture → Supabase + Resend confirmation email
- 13 Vitest tests, CI/CD on every push to main

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Testing | Vitest |
| Deployment | Vercel |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-org/credex
cd credex
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase schema

Run in your Supabase SQL editor:

```sql
create table audits (
  id text primary key,
  audit_data jsonb not null,
  created_at timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text not null,
  role text not null,
  team_size integer not null,
  audit_id text references audits(id),
  created_at timestamptz default now()
);

alter table audits enable row level security;
alter table leads enable row level security;

create policy "Public audits are viewable" on audits for select using (true);
create policy "Service role can insert audits" on audits for insert with check (true);
create policy "Service role can insert leads" on leads for insert with check (true);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The core audit flow works without any API keys. Supabase keys enable share URLs and lead capture. OpenAI key enables AI summary. Resend key enables confirmation emails.

---

## Running Tests

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

---

## Deployment

### Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add all env vars from `.env.example`
4. Deploy

CI runs lint + typecheck + tests on every push to `main` via `.github/workflows/ci.yml`.

---

## Architecture Overview

```
Browser → SpendForm (client) → runAudit() → localStorage
                                          → /audit/results
                                          → /api/summary (OpenAI)
                                          → /api/leads (Supabase + Resend)
                                          → /share/:id (Supabase read)
```

Full diagram in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── audit/page.tsx            # Spend input form
│   ├── audit/results/page.tsx    # Audit results
│   ├── share/[id]/page.tsx       # Shareable URL
│   └── api/
│       ├── audit/route.ts        # Persist audit to Supabase
│       ├── leads/route.ts        # Lead capture + email
│       └── summary/route.ts      # OpenAI summary
├── components/
│   ├── audit/                    # RecommendationCard, SavingsChart, AISummary
│   ├── forms/                    # SpendForm, LeadCaptureForm
│   ├── layout/                   # Navbar, Footer
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── audit-engine.ts           # Core deterministic audit logic
│   ├── pricing-data.ts           # Real pricing data for all 8 tools
│   ├── schemas.ts                # Zod validation schemas
│   ├── supabase.ts               # Lazy Supabase client
│   ├── rate-limit.ts             # In-memory rate limiting
│   └── prompts.ts                # OpenAI prompt templates
└── types/audit.ts                # Shared TypeScript types
```

---

## Decisions / Tradeoffs

**1. Client-side audit computation**
The audit engine runs entirely in the browser. Results are instant with zero API latency. Tradeoff: audit logic is visible in the bundle. Acceptable for an MVP — the rules aren't a competitive moat, the UX is.

**2. localStorage for audit state**
No auth required. Users get results immediately without creating an account. Tradeoff: audits are lost if localStorage is cleared. Mitigated by the share URL flow which persists to Supabase.

**3. Deterministic rules over AI-generated recommendations**
Every savings number is calculated from real pricing data, not LLM output. This means no hallucinated math and fully auditable results. Tradeoff: rules need manual updates when vendors change pricing.

**4. In-memory rate limiting**
Simple `Map`-based rate limiter — zero dependencies, zero latency. Tradeoff: resets on every cold start and doesn't work across multiple Vercel instances. Fine for MVP; swap for Upstash Redis at scale.

**5. Dynamic imports for Resend and OpenAI**
Both SDKs validate API keys at module load time, which crashes Next.js builds when keys aren't present. Dynamic `await import()` inside handlers defers initialization to request time. Tradeoff: slight cold-start overhead on first invocation per instance.
