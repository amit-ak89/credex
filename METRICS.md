# Metrics

## North Star Metric

**Audits with savings found per week**

Not total audits — audits where the engine found at least $50/month in savings. This measures whether the product is delivering real value, not just traffic. A high audit count with low savings-found rate means either the wrong users are coming or the rules aren't catching real waste.

Target: 50 valuable audits/week by end of month 1.

---

## Supporting Metrics

### Acquisition
| Metric | Target (Month 1) | Why it matters |
|--------|-----------------|----------------|
| Weekly unique visitors | 500 | Baseline traffic health |
| Visitor → audit start rate | >20% | Landing page effectiveness |
| Traffic source breakdown | — | Which channels to double down on |

### Activation
| Metric | Target (Month 1) | Why it matters |
|--------|-----------------|----------------|
| Audit start → completion rate | >65% | Form friction indicator |
| Avg tools per audit | >2 | More tools = more savings found = more value |
| % audits finding >$100/mo savings | >40% | Rule engine quality |

### Retention / Engagement
| Metric | Target (Month 1) | Why it matters |
|--------|-----------------|----------------|
| Lead capture rate (of completions) | >15% | Monetization funnel health |
| Share URL click rate | >5% | Virality coefficient |
| Return visits (same user, 7 days) | >10% | Product stickiness |

### Revenue (when paid tier launches)
| Metric | Target | Why it matters |
|--------|--------|----------------|
| Lead → paid conversion | >15% | Sales funnel efficiency |
| MRR growth rate | >20% MoM | Business health |
| Churn rate | <5%/month | Product value retention |

---

## Instrumentation Priorities

**Implement first (before launch):**
1. Vercel Analytics — free, zero-config, gives page views and Web Vitals
2. Custom event: `audit_completed` with `{ toolCount, totalSpend, totalSavings, hasSavings }`
3. Custom event: `lead_submitted` with `{ auditId, savingsAmount }`

**Implement in week 2:**
4. Custom event: `share_url_copied` — tracks virality
5. Custom event: `ai_summary_loaded` vs `ai_summary_fallback` — tracks OpenAI reliability
6. Funnel: landing → audit start → audit complete → lead submit

**Implement when paid tier launches:**
7. Stripe webhook events for MRR tracking
8. Cohort analysis: lead submission date → paid conversion date

**How to instrument (current stack):**
```typescript
// Simple event tracking without a heavy analytics SDK
async function track(event: string, props: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  await fetch("/api/track", {
    method: "POST",
    body: JSON.stringify({ event, props, ts: Date.now() }),
  }).catch(() => {}); // never block the UI
}
```

Store events in a Supabase `events` table. Query with SQL. No need for Mixpanel or Amplitude at this scale.

---

## Pivot Trigger Thresholds

These are the numbers that would force a strategic rethink:

| Signal | Threshold | What it means | Response |
|--------|-----------|---------------|----------|
| Audit completion rate | <40% | Form is too long or confusing | Cut fields, simplify UX |
| Savings found rate | <25% | Rules aren't catching real waste | Interview users, add more rules |
| Lead capture rate | <8% | Value prop isn't landing | Change form copy, lower friction |
| Share URL usage | <2% | Results aren't shareable/impressive | Improve results page design |
| Return visit rate | <5% | One-and-done tool, no retention | Add email drip, build ongoing monitoring |

**The big pivot trigger:**
If after 500 completed audits, the average savings found is under $80/month, the core premise is wrong — either AI tools are already well-priced or users are already on optimal plans. In that case, pivot to a different value prop: tool comparison ("should we switch from X to Y?") or utilization tracking ("are your seats actually being used?").

---

## What We're Not Tracking (and Why)

**Time on page** — vanity metric for a tool. Users should complete the audit quickly. Long time on page might mean confusion, not engagement.

**Bounce rate** — misleading for a single-page tool flow. A user who lands, reads the hero, and clicks "Start Audit" will look like a bounce if they navigate to /audit.

**Social media followers** — not a business metric. Focus on audits and leads, not Twitter followers.
