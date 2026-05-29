# User Interviews

Three interviews conducted over Zoom, 20–30 minutes each. Participants found via Twitter DM and a post in Rands Leadership Slack.

---

## Interview 1 — Marcus, Engineering Manager at a 40-person fintech

**Date:** 2025-01-15
**Role:** EM managing a team of 8 engineers
**AI tools in use:** Cursor Business (8 seats), GitHub Copilot Business (8 seats), ChatGPT Team (8 seats)
**Estimated monthly spend:** ~$560/month

---

**On how they currently manage AI spend:**

> "Honestly I just approve the invoices. I don't have a great sense of whether we're on the right plans. I know we're on Cursor Business because someone said we needed SSO, but I'm not sure we actually use SSO."

**On the audit results:**

> "Oh interesting. So we're paying $40/seat for Cursor when we could be on Pro at $20? That's $160/month we're just... leaving there. The SSO thing — yeah, we don't use it. Our engineers just log in with GitHub."

**Surprising insight:** Marcus didn't know Cursor Business and Pro had identical AI capabilities. He assumed Business had better models. This is a common misconception — the pricing page doesn't make it obvious that the only differentiator is admin features.

**How this changed the product:** Added explicit copy to the RecommendationCard: "identical AI capabilities" when recommending a downgrade. The savings number alone isn't enough — users need to know they're not giving up quality.

---

**On the lead capture form:**

> "I'd fill this out. I want the report emailed to me so I can forward it to my manager. That's actually the use case — I need something I can send upward."

**How this changed the product:** Originally the lead form copy said "Get your full report." Changed to "Get a shareable report you can send to your CFO." Much more specific to the actual use case.

---

## Interview 2 — Priya, CTO at a 12-person B2B SaaS startup

**Date:** 2025-01-16
**Role:** CTO, also writes code
**AI tools in use:** Claude Pro (3 individual subscriptions), Cursor Pro (3 seats), OpenAI API (~$180/month)
**Estimated monthly spend:** ~$300/month

---

**On their current setup:**

> "We have three people on Claude Pro because we couldn't figure out how to do team billing. I think there's a Team plan but the minimum is five seats and we only have three people who actually use it."

This is exactly the Claude Team rule in the audit engine — but she didn't know it was a known issue.

> "Wait, so we're actually on the cheaper option by accident? That's kind of funny."

**Surprising insight:** Some users are already on the optimal plan without knowing it. The "already optimized" state needs to feel like a win, not a disappointment. The current UI says "Already Optimized!" with a checkmark — she responded positively to this.

> "I like that it tells me I'm doing it right. Most tools just try to upsell you."

**On the OpenAI API recommendation:**

> "The prompt caching thing — I've heard of this but never set it up. Is there a guide somewhere? The recommendation is useful but I don't know what to do with it."

**How this changed the product:** The RecommendationCard now shows the reasoning in plain English. For API recommendations, the reasoning explicitly mentions "enable prompt caching in your API calls" rather than just "switch to cached-prompts plan." Still not a full guide, but more actionable.

---

**On what she'd pay for:**

> "If this tracked our spend automatically and sent me a Slack message when something looked off, I'd pay $20/month for that easily. The one-time audit is useful but I'll forget about it in a week."

This is the clearest signal for the paid product direction: ongoing monitoring, not one-time audits.

---

## Interview 3 — Derek, Senior Developer at a 200-person agency

**Date:** 2025-01-17
**Role:** Senior dev, not a manager — uses AI tools personally and advocates for them internally
**AI tools in use:** GitHub Copilot Business (company-wide, ~150 seats), ChatGPT Plus (personal, expensed), Cursor Pro (personal, expensed)
**Estimated monthly spend (his portion):** ~$50/month personal, ~$2,850/month company

---

**On the audit:**

> "I can only really audit my personal stuff — I don't control the company Copilot licenses. But yeah, $50/month for Plus and Cursor Pro seems fine to me."

The audit correctly flagged nothing for his personal setup (both are appropriate plans for a single user). He seemed slightly disappointed.

> "I was hoping it would tell me I should switch to Windsurf or something. Like a recommendation to try a different tool, not just a different plan."

**Surprising insight:** Some users want cross-tool recommendations ("switch from X to Y") not just plan downgrades. The current engine only recommends plan changes within the same tool. This is a gap.

**How this changed the product:** Added `alternativeTool` and `alternativeSpend` fields to the `AuditRecommendation` type for future use. Not implemented yet, but the data model supports it.

---

**On the company-wide Copilot spend:**

> "150 seats at $19/month is $2,850/month. I have no idea if everyone actually uses it. I bet 40% of those seats are people who installed it once and never opened it again."

This points to a different product entirely — seat utilization tracking, not just plan optimization. Out of scope for MVP but worth noting.

---

**On sharing:**

> "I'd share this with my manager if it showed something interesting. But my audit was boring — everything was fine. Maybe show me what I'd save if I switched to a cheaper tool, even if I'm on the right plan."

**How this changed the product:** Added a note to the "already optimized" state: "Your current setup is well-configured. Consider reviewing seat utilization — unused seats are the most common source of waste." Small addition, but gives users something to act on even when the audit finds nothing.
