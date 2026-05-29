# Economics

## Current State (Free Tool / Lead Gen)

Credex is currently a free tool with lead capture. The business model is: free audit → email capture → upsell to a paid "Credex Pro" product (ongoing spend monitoring, alerts, team dashboard).

---

## Unit Economics Assumptions

### Traffic → Audit conversion
- Landing page visitor → starts audit: **25%** (high intent traffic from SEO/HN)
- Starts audit → completes audit: **70%** (form is short, localStorage saves progress)
- Completes audit → submits lead form: **20%** (only users who see meaningful savings)

So: 100 visitors → 25 start → 17 complete → 3–4 leads

### Lead quality
- Average savings found per audit: **$180/month** (based on rule engine outputs across test cases)
- Users who see >$100/month savings are the most likely to convert to paid
- Estimated % of audits showing >$100 savings: **45%**

---

## Cost to Acquire a Lead (CAC)

**Organic / zero-cost channels (HN, Twitter, SEO):**
- CAC ≈ $0 direct cost
- Founder time cost: ~2 hours/week on content/outreach = ~$100/week opportunity cost
- At 20 leads/week: CAC ≈ $5 (time-adjusted)

**If running paid ads (future):**
- CPC for "AI tools cost" keywords: ~$3–8
- Landing page CVR: 25%
- Cost per audit completion: ~$15
- Cost per lead: ~$75
- Only viable if lead LTV > $300

---

## Conversion Funnel (Rough)

```
1,000 visitors/month
  → 250 start audit        (25%)
  → 175 complete audit     (70% of starters)
  → 35 submit lead form    (20% of completers)
  → 7 convert to paid      (20% of leads, 3-month lag)
  → $7 × $49/month = $343 MRR from 1k visitors
```

---

## Pricing Assumptions for Credex Pro

Hypothetical paid tier (not yet built):

| Plan | Price | Target |
|------|-------|--------|
| Solo | $19/month | Individual devs tracking personal AI spend |
| Team | $49/month | Teams of 5–20, monthly spend reports + alerts |
| Company | $149/month | 20+ person teams, Slack integration, CSV export |

Most likely initial conversion: **Team at $49/month**

---

## Rough P&L at Different Scales

### 100 leads/month scenario
```
Revenue (20% conversion × $49):    $980 MRR
Infrastructure:                    -$60/month
OpenAI API costs (100 summaries):  -$2/month
Resend (100 emails):               -$0 (free tier)
Net:                               ~$918/month
```

### 500 leads/month scenario
```
Revenue (20% conversion × $49):    $4,900 MRR
Infrastructure (Vercel Pro + Supabase Pro): -$60/month
OpenAI API (500 summaries):        -$10/month
Resend (500 emails):               -$20/month
Net:                               ~$4,810/month
```

### 2,000 leads/month scenario
```
Revenue (20% conversion × $49):    $19,600 MRR
Infrastructure:                    -$150/month
OpenAI API:                        -$40/month
Resend:                            -$40/month
1 part-time contractor (support):  -$1,500/month
Net:                               ~$17,870/month (~$214k ARR)
```

---

## Path to $1M ARR

$1M ARR = ~$83k MRR = ~1,700 paying Team plan customers at $49/month

**Required funnel inputs:**
- 1,700 paying customers ÷ 20% conversion = 8,500 leads
- 8,500 leads ÷ 20% lead capture rate = 42,500 audit completions
- 42,500 completions ÷ 70% completion rate = 60,700 audit starts
- 60,700 starts ÷ 25% start rate = **243,000 visitors/month**

**How to get 243k visitors/month:**
- SEO: 50 comparison articles ranking for "tool A vs tool B" keywords → ~100k organic/month (12–18 month timeline)
- Viral sharing: each audit has a share URL → if 5% of users share and each share drives 3 visits → 42,500 × 5% × 3 = 6,375 additional visits/month
- Paid: ~$50k/month ad spend at $0.20 CPC → 250k visits (only viable after organic is proven)

**Realistic timeline to $1M ARR: 18–24 months** if SEO compounds and the paid product converts at assumed rates.

---

## Key Risks to These Numbers

1. **Lead capture rate drops below 10%** — means the free tool isn't generating enough "wow" moments. Fix: improve the savings calculation rules or lower the threshold for showing the lead form.

2. **Paid conversion below 10%** — means the free tool is too complete and there's no clear reason to pay. Fix: gate the share URL or the AI summary behind email capture.

3. **Pricing too low** — $49/month for a team might be underpriced. If teams are saving $200–500/month, $99/month is defensible. Test with a higher price point early.

4. **Vendor pricing changes** — if OpenAI drops ChatGPT Team to $20/seat, several audit rules become invalid and savings numbers drop. Need a process for quarterly pricing verification.
