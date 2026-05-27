# Credex AI Spend Auditor

> Audit your company's AI tooling spend and get personalized cost optimization recommendations in 2 minutes.

![Hero Screenshot](docs/screenshots/hero.png)
![Results Screenshot](docs/screenshots/results.png)

## Features

- **Instant Audit** — Enter your AI tools and get recommendations immediately
- **8 Tools Supported** — Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf
- **Deterministic Rules** — No hallucinated math. Rule-based engine with real pricing data
- **AI Summary** — GPT-4o-mini personalized 100-word audit summary
- **Shareable URLs** — Each audit gets a unique public URL
- **Lead Capture** — Email confirmation via Resend
- **Fully Typed** — TypeScript throughout

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Testing | Vitest |
| Deployment | Vercel |

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-org/credex
cd credex
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

Run this SQL in your Supabase SQL editor:

```sql
-- Audits table
create table audits (
  id text primary key,
  audit_data jsonb not null,
  created_at timestamptz default now()
);

-- Leads table
create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text not null,
  role text not null,
  team_size integer not null,
  audit_id text references audits(id),
  created_at timestamptz default now()
);

-- Enable RLS
alter table audits enable row level security;
alter table leads enable row level security;

-- Public read for audits (for share page)
create policy "Public audits are viewable" on audits for select using (true);

-- Service role can insert
create policy "Service role can insert audits" on audits for insert with check (true);
create policy "Service role can insert leads" on leads for insert with check (true);
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running Tests

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
```

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy

The CI/CD pipeline runs lint + type check + tests on every push to `main`.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── audit/
│   │   ├── page.tsx          # Spend input form
│   │   └── results/page.tsx  # Audit results
│   ├── share/[id]/page.tsx   # Shareable audit URL
│   └── api/
│       ├── audit/route.ts    # Audit API
│       ├── leads/route.ts    # Lead capture API
│       └── summary/route.ts  # AI summary API
├── components/
│   ├── audit/                # Audit-specific components
│   ├── forms/                # Form components
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── audit-engine.ts       # Core audit logic
│   ├── pricing-data.ts       # Tool pricing data
│   ├── schemas.ts            # Zod validation schemas
│   ├── supabase.ts           # Supabase client
│   ├── rate-limit.ts         # Rate limiting
│   └── prompts.ts            # AI prompt templates
└── types/
    └── audit.ts              # TypeScript types
```

## Decisions & Tradeoffs

- **Deterministic audit engine** over AI-generated recommendations: Ensures consistent, auditable results. No hallucinated savings numbers.
- **localStorage for form state**: No auth required for the core flow. Reduces friction.
- **Client-side audit computation**: Results are instant. Server API is used for persistence only.
- **nanoid for audit IDs**: Short, URL-safe, collision-resistant without a database round-trip.
- **In-memory rate limiting**: Simple and sufficient for MVP. Replace with Redis/Upstash for production scale.
