# Reflection

## 1. Hardest bug

The Supabase build error took the longest to fully fix. The symptom was `supabaseUrl is required` crashing the Vercel build, but the root cause kept shifting.

First attempt: made `supabaseAdmin` a lazy proxy object using JavaScript `Proxy`. This worked locally but still failed on Vercel because Next.js's build process evaluates module-level code differently than Node.js does.

Second attempt: moved `createClient()` inside a `getSupabaseAdmin()` function. Still failed — turns out the Supabase SDK itself does URL validation inside `createClient()`, so even calling it with `""` throws.

Third attempt: used `?? ""` as a fallback. Still threw because empty string fails Supabase's URL validation.

Final fix: lazy singleton with a cached `SupabaseClient | null` variable, combined with `export const dynamic = "force-dynamic"` on all API routes to prevent Next.js from evaluating them at build time. The key insight was that `force-dynamic` tells Next.js "don't touch this route during build" — which is what actually stopped the build-time evaluation.

The Resend and OpenAI SDKs had the same problem but required a different fix — dynamic `await import()` inside the handler — because those SDKs throw at the `import` statement itself, not at instantiation.

---

## 2. Decision I reversed

Originally used `z.coerce.number()` in the Zod schemas for numeric fields like `monthlySpend` and `seats`. This seemed like the right call — HTML number inputs return strings, and coerce handles the conversion automatically.

The problem: `@hookform/resolvers` infers the TypeScript type of coerced fields as `unknown` (because the input type is unknown before coercion). This broke the `useForm<SpendFormInput>` generic, causing TypeScript errors throughout the form component.

Tried `z.preprocess()` as an alternative — same problem, same `unknown` inference.

Final solution: switched to plain `z.number()` in the schema and added `valueAsNumber: true` to each `register()` call in the form. This tells React Hook Form to call `parseFloat()` on the input value before passing it to Zod, so the schema receives an actual number and TypeScript is happy.

The lesson: Zod's coerce/preprocess features are great for server-side validation but create friction with hookform's type inference. Keep schemas simple when they're used with hookform.

---

## 3. Week 2 plans

- Add 3–4 more tools: Notion AI, Perplexity Pro, GitHub Models, Amazon CodeWhisperer
- Add a "compare two tools" feature — e.g. "should we switch from Cursor to Windsurf?"
- Improve the share page with a proper OG image generated via `@vercel/og`
- Add Vercel Analytics to track conversion from landing → audit → lead capture
- Set up a Supabase cron job to email weekly audit summaries to leads who opted in
- Write a proper onboarding email sequence in Resend (3 emails over 7 days)
- Add Upstash Redis for rate limiting so it works correctly across Vercel instances

---

## 4. AI usage

Used Claude and ChatGPT throughout the project, mostly for:

- Boilerplate: generating the initial shadcn/ui component wrappers, Recharts setup
- Debugging: explaining TypeScript error messages (the hookform resolver errors were dense)
- Pricing research: cross-checking AI tool pricing data

One case where AI generated incorrect code that needed manual fixing: asked Claude to write the Supabase lazy initialization. It generated a `Proxy`-based solution that looked clever but failed in production because Next.js's module evaluation during build doesn't behave like a normal Node.js runtime. The proxy intercepted property access correctly in development but the underlying `createClient()` call still ran at module evaluation time in the build environment.

Had to understand the actual Next.js build pipeline to fix it properly — the AI didn't know about the `force-dynamic` export or how Turbopack handles module evaluation differently from webpack.

Also: AI-generated pricing data for some tools was outdated. Claude confidently stated Cursor Business was $40/seat/month when it had changed. Always verified against official pricing pages before committing to `pricing-data.ts`.

---

## 5. Self-rating

**7/10**

What went well:
- The audit engine is genuinely useful and the rules are accurate
- The UI is clean and doesn't look like a template
- Build pipeline is solid — lint, typecheck, tests all green
- The dynamic import fix for SDK initialization is a real solution, not a workaround

What I'd do differently:
- Should have tested the Vercel build earlier — the SDK initialization issues only surfaced at deploy time and cost several hours
- The `z.coerce` → `z.number()` + `valueAsNumber` issue was avoidable with better upfront knowledge of hookform's type inference
- The share page could use a proper OG image instead of just text metadata
- No analytics instrumentation yet — flying blind on actual user behavior

The core product works end-to-end and is deployable. The audit logic is deterministic and testable. That's the foundation that matters.
