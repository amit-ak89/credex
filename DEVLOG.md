# Dev Log

## Day 1 — 2025-01-13

**Hours worked:** 6
**What I did:** Set up the Next.js 15 project with Tailwind v4 and shadcn/ui. Spent longer than expected getting Tailwind v4 config right — the `@import "tailwindcss"` syntax is different from v3 and most tutorials are outdated. Got the basic folder structure in place, installed all dependencies, and built the Navbar and Footer components. Wrote the landing page hero section.

**What I learned:** Tailwind v4 uses CSS-first config instead of `tailwind.config.js`. The `@theme inline` block in globals.css replaces the old config file. Took about 45 minutes to figure this out from the docs.

**Blockers / what I'm stuck on:** shadcn/ui component installation is slightly different with Tailwind v4 — some components need manual CSS variable adjustments. Will deal with this tomorrow when I actually need the components.

**Plan for tomorrow:** Build the SpendForm with React Hook Form + Zod, get the basic tool entry cards working.

---

## Day 2 — 2025-01-14

**Hours worked:** 7
**What I did:** Built the SpendForm component. The field array with `useFieldArray` was straightforward but getting the Select components to work with React Hook Form required using `setValue` manually since Radix Select doesn't expose a native input. Also built the pricing data structure and all 8 tool configs. Wrote the Zod schemas.

**What I learned:** `z.coerce.number()` and `@hookform/resolvers` don't play well together — coerced fields get typed as `unknown` in the resolver, which breaks TypeScript. Ended up using `z.number()` with `valueAsNumber: true` on the input registration. Wasted about an hour on this.

**Blockers / what I'm stuck on:** The `setValue` calls for dynamic field array paths (`` `tools.${index}.plan` ``) cause TypeScript errors because the path can't be statically typed. Using `as any` cast for now — it's the standard RHF pattern for this case.

**Plan for tomorrow:** Build the audit engine and write the first tests.

---

## Day 3 — 2025-01-15

**Hours worked:** 8
**What I did:** Built the entire audit engine in `audit-engine.ts`. Wrote rules for all 8 tools — ChatGPT, Cursor, GitHub Copilot, Claude, Windsurf, Gemini, and both API tools. Wrote 13 Vitest tests. All passing. Also set up the CI/CD pipeline with GitHub Actions.

**What I learned:** Writing deterministic rules is actually harder than it sounds. The ChatGPT Enterprise rule (recommend Team for <150 seats) required looking up the actual minimum seat count from OpenAI's pricing page. A lot of "common knowledge" about AI tool pricing is wrong or outdated online.

**Blockers / what I'm stuck on:** Nothing major today. The Windsurf pricing was hard to verify — their website buries the Teams plan pricing. Used $35/seat based on what I could find.

**Plan for tomorrow:** Build the results page and charts.

---

## Day 4 — 2025-01-16

**Hours worked:** 5
**What I did:** Built the results page — hero savings section, RecommendationCard components, SavingsChart with Recharts. Got the high-savings CTA and "already optimized" states working. Wired up the localStorage read on page load.

**What I learned:** Recharts needs `"use client"` and doesn't SSR well. The `ResponsiveContainer` component requires a parent with explicit height — spent 20 minutes debugging why the chart wasn't rendering before realizing the container had `height: 0`.

**Blockers / what I'm stuck on:** The results page feels a bit plain. The chart works but the overall visual hierarchy could be stronger. Will revisit styling after the core features are done.

**Plan for tomorrow:** Build the AI summary component and the `/api/summary` route.

---

## Day 5 — 2025-01-17

**Hours worked:** 4
**What I did:** Honestly a slow day. Built the AISummary component and the OpenAI API route. The component itself was quick. Spent most of the time dealing with the OpenAI SDK throwing errors at build time because it validates the API key at module load. Tried a few approaches before landing on dynamic `await import("openai")` inside the handler.

**What I learned:** Next.js runs API route modules during `next build` to collect page data. Any SDK that validates credentials at import time will crash the build if the env var isn't set. Dynamic imports are the correct fix — not lazy singletons, not proxy objects.

**Blockers / what I'm stuck on:** The same issue will probably affect Resend. Need to check tomorrow.

**Plan for tomorrow:** Lead capture form, Supabase integration, Resend email.

---

## Day 6 — 2025-01-18

**Hours worked:** 7
**What I did:** Built the LeadCaptureForm with honeypot anti-spam. Set up Supabase client with lazy initialization. Built `/api/leads` route. Confirmed the Resend SDK has the same build-time initialization problem as OpenAI — fixed with dynamic import. Built the share page with server-side Supabase fetch and dynamic OG metadata.

**What I learned:** Supabase's `createClient()` also throws if the URL is an empty string — not just undefined. The `?? ""` fallback I was using was still causing issues. Fixed by making the client a lazy singleton that only initializes on first call.

**Blockers / what I'm stuck on:** Resend requires a verified domain to send from a custom address. For now using `hello@credex.ai` as the from address — will need to verify the domain before emails actually deliver in production.

**Plan for tomorrow:** Polish UI, write documentation, final testing.

---

## Day 7 — 2025-01-19

**Hours worked:** 6
**What I did:** UI polish pass — improved spacing on the results page, added the gradient hero on the landing page, fixed mobile layout on the SpendForm. Wrote README, ARCHITECTURE, and other docs. Fixed 3 ESLint errors that were blocking CI. Ran the full test suite and lint check — all green.

**What I learned:** The `react-hooks/set-state-in-effect` ESLint rule is stricter than I expected — it tracks setState calls through function references, not just direct calls in the effect body. Had to add an eslint-disable comment for the AISummary useEffect since the async fetch pattern is legitimate.

**Blockers / what I'm stuck on:** Nothing blocking. The app is deployable. Would like to add more audit rules (Notion AI, Perplexity) in a future iteration.

**Plan for tomorrow:** Deploy to Vercel, test the full flow end-to-end in production.
