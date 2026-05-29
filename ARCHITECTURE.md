# Architecture

## System Diagram

```mermaid
flowchart TD
    A[User: /audit] --> B[SpendForm\nclient component]
    B -->|persist state| C[(localStorage)]
    B -->|submit| D[runAudit\naudit-engine.ts]
    D --> E[pricing-data.ts\nrule evaluation]
    E --> D
    D -->|AuditResult| C
    D -->|redirect| F[/audit/results]

    F -->|read| C
    F --> G[AISummary component]
    F --> H[LeadCaptureForm]
    F --> I[SavingsChart\nRecharts]

    G -->|POST| J[/api/summary]
    J --> K[OpenAI\ngpt-4o-mini]
    K --> J

    H -->|POST| L[/api/leads]
    L --> M[(Supabase\nleads table)]
    L --> N[Resend\nemail]

    F -->|share button| O[/share/:id]
    O -->|read| P[(Supabase\naudits table)]

    subgraph Persistence
        M
        P
    end

    subgraph External APIs
        K
        N
    end
```

---

## Data Flow

### Happy path

1. User fills SpendForm — each keystroke persists to `localStorage`
2. On submit, `runAudit()` runs synchronously in the browser — no network call
3. `AuditResult` is written to `localStorage` keyed by `audit.id`
4. User is redirected to `/audit/results?id=<id>`
5. Results page reads from `localStorage`, renders immediately
6. `AISummary` fires a background `POST /api/summary` — shows fallback if it fails
7. User submits lead form → `POST /api/leads` → Supabase insert + Resend email
8. Share button copies `/share/<id>` to clipboard — that page reads from Supabase

### Share page flow

The `/share/[id]` page is a Next.js server component. It fetches `audit_data` from Supabase at request time, strips `monthlySpend` from `toolEntries` before rendering (privacy), and generates dynamic OpenGraph metadata for rich link previews.

---

## Why Next.js 15

- App Router gives server components for SEO-critical pages (landing, share) and client components for interactive ones (form, results) — right tool for each job
- API routes co-located with the app — no separate Express server to deploy
- Vercel deployment is zero-config
- React 19 + Turbopack makes local dev fast enough that it doesn't slow you down

Considered: Remix, plain Vite SPA. Remix would've worked but the ecosystem around shadcn/ui and Tailwind v4 is more Next.js-native. Vite SPA would've required a separate API layer.

---

## Why Supabase

- Instant PostgreSQL with a REST API — no ORM setup, no migrations for an MVP
- Row Level Security means the anon key is safe to expose in the browser
- JSONB column for `audit_data` means the audit schema can evolve without migrations
- Free tier handles ~500MB storage and 2GB bandwidth — more than enough for launch

Considered: PlanetScale, Neon, Firebase. Supabase wins on DX for small teams. Firebase would've required restructuring the data model.

---

## API Design

All API routes are `POST`-only, `force-dynamic`, and rate-limited per IP.

| Route | Purpose | Rate limit |
|-------|---------|-----------|
| `POST /api/audit` | Persist audit to Supabase | 10 req/min |
| `POST /api/leads` | Save lead + send email | 3 req/min |
| `POST /api/summary` | Generate AI summary | 5 req/min |

Rate limiting is in-memory (`Map`-based). Keys are `action:ip`. Limits are intentionally conservative — the audit engine runs client-side so `/api/audit` is only called for persistence, not for the core UX.

Error responses always return `{ error: string }` with appropriate HTTP status codes. No stack traces in production responses.

---

## Caching Strategy

**Current (MVP):**
- Landing page: statically rendered at build time, cached at CDN edge indefinitely
- Share pages: server-rendered per request, no cache (audit data is user-specific)
- API routes: `force-dynamic`, no caching

**At scale:**
- Share pages: add `export const revalidate = 3600` — cache for 1 hour, revalidate on demand
- Landing page: already optimal
- Add `Cache-Control: s-maxage=60` to `/api/summary` responses for identical audit inputs

---

## Scaling to 10k Audits/Day

At 10k audits/day (~7 req/min average, ~50 req/min peak):

**Bottlenecks in order of likelihood:**

1. **In-memory rate limiter** — resets on cold start, doesn't work across instances
   Fix: Replace with Upstash Redis + `@upstash/ratelimit` (~$10/month)

2. **Supabase connection pool** — default pool is 15 connections
   Fix: Enable Supabase connection pooling (PgBouncer) in project settings — free

3. **OpenAI latency** — `/api/summary` takes 1–3s, blocks the results page feel
   Fix: Switch to streaming response with `ReadableStream` — shows text as it generates

4. **Cold starts on API routes** — Vercel serverless functions cold-start in ~300ms
   Fix: Add `export const runtime = "edge"` to rate-limit-free routes for sub-50ms cold starts

5. **Supabase storage** — at 10k audits/day, `audit_data` JSONB averages ~2KB each = ~20MB/day
   Fix: Add a 90-day TTL cleanup job via Supabase cron or a weekly Edge Function

**Infrastructure cost at 10k audits/day:**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- OpenAI (gpt-4o-mini, ~150 tokens/summary, 30% conversion): ~$15/month
- Resend (3k emails/month free, then $20/month): $0–20/month
- Total: ~$60–80/month
