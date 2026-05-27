# Architecture

## System Overview

Credex AI Spend Auditor is a Next.js 15 App Router application with a clear separation between client-side audit computation and server-side persistence.

## Data Flow

```mermaid
flowchart TD
    A[User visits /audit] --> B[SpendForm Component]
    B --> C{localStorage}
    C -->|persist state| C
    B --> D[runAudit - client-side]
    D --> E[audit-engine.ts]
    E --> F[pricing-data.ts]
    F --> E
    E --> G[AuditResult]
    G --> H[localStorage - save result]
    G --> I[/audit/results?id=...]
    I --> J[AISummary Component]
    J --> K[POST /api/summary]
    K --> L[OpenAI GPT-4o-mini]
    I --> M[LeadCaptureForm]
    M --> N[POST /api/leads]
    N --> O[Supabase - leads table]
    N --> P[Resend - confirmation email]
    I --> Q[Share Button]
    Q --> R[/share/:id]
    R --> S[Supabase - audits table]
```

## Component Architecture

```
App Router Pages
├── / (Landing)           → Static, SEO-optimized
├── /audit                → Client component (SpendForm)
├── /audit/results        → Client component (reads localStorage)
└── /share/[id]           → Server component (reads Supabase)

API Routes (Edge-compatible)
├── POST /api/audit       → Runs audit + saves to Supabase
├── POST /api/leads       → Saves lead + sends email
└── POST /api/summary     → Calls OpenAI, returns summary
```

## Key Design Decisions

### Client-Side Audit Computation
The audit engine runs entirely in the browser. This means:
- **Zero latency** for results (no API round-trip)
- **Works offline** after initial page load
- **Deterministic** — same inputs always produce same outputs
- The `/api/audit` route exists for server-side persistence (share URLs)

### Supabase Schema
```sql
audits (id text PK, audit_data jsonb, created_at timestamptz)
leads  (id uuid PK, email, company_name, role, team_size, audit_id FK, created_at)
```

JSONB for `audit_data` allows schema evolution without migrations.

### Rate Limiting
In-memory rate limiting per IP. For production scale, replace with:
- Upstash Redis + `@upstash/ratelimit`
- Or Vercel's built-in edge rate limiting

## Stack Justification

| Choice | Reason |
|--------|--------|
| Next.js 15 App Router | Server components for SEO, client components for interactivity |
| Supabase | Instant PostgreSQL + auth + RLS without infrastructure management |
| Resend | Best-in-class transactional email DX, React Email compatible |
| Recharts | Composable, TypeScript-native, works with React 19 |
| Zod v4 | Fastest Zod version, excellent TypeScript inference |
| nanoid | Smaller than uuid, URL-safe, cryptographically random |

## Scaling Discussion

**Current MVP limits:**
- Rate limiting is in-memory (resets on server restart)
- No caching layer for share pages

**Path to scale:**
1. Add Upstash Redis for distributed rate limiting
2. Add `revalidate` or ISR to share pages for CDN caching
3. Add Supabase indexes on `leads.email` and `audits.created_at`
4. Move AI summary to streaming response for better UX at scale
5. Add Vercel Analytics for conversion tracking
