# HOGH VC pitch deck — narrative review & optional changes

**Scope:** `hogh_vc_pitch_presentation.html` (10 slides) vs `docs/md/product_note.md` (product/architecture source of truth).  
**Purpose:** Confirm story coherence; list **optional** edits for you to accept/reject—nothing here is auto-applied.

---

## Executive summary — is the arc strong?

**Yes.** The flow matches a standard investor narrative and aligns well with the product note’s core claims:

| # | Role in story | Product-note fit |
|---|----------------|------------------|
| 1 | Hook: dual Second Brain, not ATS replacement | §1 overview, core surfaces |
| 2 | Problem: fragmentation, both sides underserved | §2 personas / friction |
| 3 | Solution: squads, briefs, NegotiationCoach™, handoffs | §3 feature map, §5 agents |
| 4 | Why now: adoption, capital, EU high-risk | §8.4 EU AI Act |
| 5 | How it’s built: orchestration, graph, gates, demo | §4 tech, §6 data, §5 |
| 6 | Moat: workflow + dual-sided + trust | §1–3, §8 |
| 7 | GTM & revenue: employer-first, four lines | Consistent with submission-style model (not fully spelled out in product_note) |
| 8 | Roadmap: Greenhouse → ATS breadth → EU → platform | §9.1 ATS phases, §8.4 timeline |
| 9 | Economics + ask + use of proceeds | Financial table is **model-level** (not in product_note); use of proceeds maps to §1, §9 |
| 10 | Close: prep vs decision, compound / refuse / scale | §1, §8, Admin Console |

**Gaps (conceptual, not broken):**

1. **Product note §10 (Engineering milestones)** is truncated in the repo—the deck’s Slide 8 is **more detailed** than what’s visible in the markdown file. If you extend §10 later, **re-sync** Slide 8 wording so both documents match.
2. **Slide 2 & 4** use market/statistics that are **not** in the product note. Fine for a pitch, but worth a **single footnote or appendix** with sources if investors ask.
3. **Slide 3 footer** pilot metrics are explicitly “research”—good; keep saying that aloud so they aren’t read as HOGH-only claims.

---

## Slide-by-slide — optional changes (your call)

### Slide 1 — Title & hook

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Narrative | Sets dual-sided + “not ATS” in footer—consistent with §1. | None required. |
| Product note | Mentions specialist agents; note also lists **Admin Console** and **API** as surfaces—they’re not on S1. | Add **one phrase** in subtitle or foot: “…plus governance (Admin) and platform API for partners”—*only if* you want full surface parity on slide 1. |
| Visual | Orbit diagram is fine; different style from slides where you removed deco. | Unify later (cosmetic). |

---

### Slide 2 — Problem

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Narrative | Symmetric employer/candidate pain matches §2. | None required. |
| Stats | 42d, 60%, 73%, etc. are **not** verified in product_note. | Add tiny “*industry / analyst sources—appendix*” in footer or speaker note only; or replace with 2–3 **qualitative** bullets if you want zero unsourced numbers on-screen. |

---

### Slide 3 — Solution (squads)

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Product note | **Opportunity Intelligence Brief™** matches §3.1 / career modules. **NegotiationCoach™** matches overview table. | None required. |
| Agent names | Deck uses shorthand (Radar, Intelligence…); note uses *RadarAgent*, *IntelligenceAgent*, etc. | Optional: add “Agent” once in speaker note for pedantic technical audiences. |
| Footer | Category validation labeled research—good. | Keep presenter script warning (already there). |

---

### Slide 4 — Why now

| Area | Observation | Optional change |
|------|-------------|-----------------|
| EU AI Act | Matches high-risk recruitment framing in §8.4. | None required. |
| Fortune 500 / VC $ | External research—not product_note. | Same as Slide 2: source appendix or soften to “order-of-magnitude” language if challenged. |

---

### Slide 5 — Architecture + demo

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Product note | LangGraph, services, graph, Kafka-style events align with §4 / §6 themes; bias/SHAP/offer gate align with §5 / §8. | None required for credibility. |
| Numbers | “50K+ skills, 10K+ role archetypes—design targets” may or may not appear verbatim in product_note. | If note doesn’t define these, either **remove numbers** on slide or add matching sentence in product_note to avoid diligence mismatch. |
| Narrative | Very technical after Slide 4—some VC rooms want **business before stack**. | Optional deck variant: move S5 after S7 for non-technical audiences, or add one bridging subtitle line: “Why this matters: auditability and margin at scale.” |

---

### Slide 6 — Moat

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Product note | Dual flywheel, no interview automation, NegotiationCoach™—all in note. | None required. |
| Footer | Patents “roadmap”—ensure this matches legal reality when you say it. | Optional: shorten footer to “patent strategy in diligence” if not filed yet. |

---

### Slide 7 — GTM & revenue

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Product note | Pricing/ACV/API tiers are **not** the subject of the architecture note; deck reflects **business model doc / submission**. | Add one footnote on slide or in notes: “Pricing bands—financial model; product scope—product note.” Reduces confusion in diligence. |
| Consistency | Same employer-first story as S1, S8, S9. | None required. |

---

### Slide 8 — 36-month roadmap

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Terminology | Year 1 bullet says “**Intelligence Brief**” generically; product_note distinguishes **Candidate Intelligence Brief™** (recruiter) vs **Opportunity Intelligence Brief™** (candidate). | **Recommended small fix:** use **Candidate Intelligence Brief™** in the Year 1 recruiter bullet for strict alignment. |
| Product note | Greenhouse / Lever / Workday / SF / Ashby phases match §9.1 table; EU months align with §8.4. | None beyond naming precision above. |
| Length | Dense on small screens. | Optional: move one bullet per column to **appendix** if you present on laptop only. |

---

### Slide 9 — Financials & ask

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Product note | No ARR/EBITDA table in note—numbers are **model-only**; use of proceeds matches product scope. | Explicitly say in room: “Economics from model; product scope from architecture note.” |
| Subtitle | Short version may omit “data room” cue (if you want that reminder). | Optional: add back *“Assumptions in the data room.”* at end of subtitle. |
| Ask | $3.2M Seed is specific—good. | If round size changes, update **HTML + speaker script** together. |

---

### Slide 10 — Close

| Area | Observation | Optional change |
|------|-------------|-----------------|
| Product note | Strong alignment: dual platform, ATS layer, bias/SHAP/provenance, human approval, Admin, GDPR, EU AI Act. | None required. |
| Subtitle | Long; you previously asked for smaller subtitles globally. | Optional: split into **two lines** (second line smaller via a `<span class="subtitle-sub">`) or trim 15–20% words if it overflows on projectors. |

---

## Cross-cutting checklist (optional)

1. **One glossary** (appendix PDF or speaker doc): Candidate Intelligence Brief™ vs Opportunity Intelligence Brief™, Human Handoff Protocol™, Talent Intelligence Graph™.
2. **Single “source of truth” sentence** reused on S1, S7, S9: *intelligence + orchestration layer above ATS/HRIS—not replacement.*
3. After you **finalize §10** in `product_note.md`, diff it against Slide 8 and update either side.

---

## Suggested priority if you only change a few things

| Priority | Item |
|----------|------|
| **P1** | Slide 8: rename generic “Intelligence Brief” → **Candidate Intelligence Brief™** in Year 1 recruiter bullet. |
| **P2** | Slides 2 & 4: add source footnote or appendix pointer for statistics. |
| **P3** | Slide 5: confirm or remove “50K / 10K” design targets vs product_note. |
| **P4** | Slide 9 subtitle: optionally restore “Assumptions in the data room.” |

---

*Generated for review; edit this doc as you decide what to implement in `hogh_vc_pitch_presentation.html`.*
