# HireOrGetHired (HOGH) — User Flow & Experience Document

**Dual-sided agentic intelligence for every hiring conversation — a Second Brain for recruiters and job seekers that researches, prepares, and orchestrates, then steps back when humans must decide.**

## Table of Contents

- Platform Overview
- Design Philosophy
- Core User Flows by Persona
- Intelligent System / Agent Architecture
- Multi-Step Workflows
- Daily System Actions & Capabilities
- Dashboard & Interface Specifications
- Onboarding Flows
- Key User Journeys
- Engagement & Retention Mechanics
- Marketing / Landing Experience (Optional but recommended)

---

## 1. Platform Overview

### What HOGH Is

**HireOrGetHired** is a **dual-sided agentic AI platform** for talent acquisition. It deploys persistent AI agents — branded **TalentAgent™** for employers and **CareerAgent™** for candidates — that operate as an **intelligence and orchestration layer** above existing HR systems.

| Dimension | Definition |
|-----------|------------|
| **Core concept** | Every human touchpoint in hiring is preceded by autonomous research, synthesis, and logistics; humans approve gates, judge fit, and speak for themselves. |
| **System type** | Platform + intelligence layer (not an ATS replacement). |
| **Behavior mix** | **Reactive** (on-demand briefs, user-triggered applications), **proactive** (market scans, pipeline alerts, pre-interview packs), **autonomous** (scheduling negotiation, form-fill drafts, background RAG refresh) — all bounded by **Human Handoff Protocol™** at defined checkpoints. |

### What It Replaces (Partially)

| Legacy pattern | HOGH replacement |
|----------------|------------------|
| Shallow ATS snapshots + manual LinkedIn tab archaeology | **Candidate Intelligence Brief™** with provenance-linked narrative |
| Generic job boards + spray-and-pray applications | **DiscoveryAgent** fit scoring with explanations + **ApplicationAgent** tailored materials |
| Stale comp spreadsheets and gut-feel negotiation | **OfferAgent** + **NegotiationCoach™** with market bands and private, asymmetric coaching |
| Manual CHRO reporting | Pipeline, diversity, and recruiter performance analytics with export |

### What Makes It Fundamentally Different

1. **Symmetric intelligence** — Both sides get agent depth (within privacy and policy bounds), not just the employer.
2. **Orchestration, not chat** — LangGraph-style stateful pipelines with audit-friendly checkpoints, not a single prompt box.
3. **Provenance by design** — Claims link to sources; candidates can see what was used and request correction.
4. **Compliance-native** — Bias monitor, SHAP explainability, EU AI Act roadmap, immutable audit trail.

---

## 2. Design Philosophy

| Principle | Expression in product |
|-----------|----------------------|
| **Power through clarity** | Dense intelligence (briefs, scores) always paired with “why” and citations — never black-box rankings. |
| **Speed where it matters** | Sub-2s dashboard loads (target); NegotiationCoach feels **live** (target p95 &lt; 800ms advisory latency). |
| **AI-first, human-decisive** | Agents draft, schedule, and analyze; humans approve outreach, shortlists, offers, and final messages. |
| **Minimal chrome, maximum signal** | Radix + Tailwind-style discipline: primary surfaces show **next best action**, queues, and risk flags — not empty states dressed as dashboards. |
| **Trust as UX** | Explicit opt-in for sensitive flows (NegotiationCoach, data footprint analysis); both parties acknowledge AI advisory before live negotiation coaching. |
| **Asymmetric fairness** | Recruiter and candidate each get a **private** NegotiationCoach view — no cross-side data leakage or automated deal-making. |

---

## 3. Core User Flows by Persona

### Persona A — Alex (Enterprise Recruiter)

#### Profile
Senior TA at a ~3,000-person tech company; 15–20 open reqs; ~60% of time on sourcing, scheduling, and admin. Wants context before every interview, not another tool to “check.”

#### Goals / Objectives
- Fill reqs faster without more headcount.
- Enter every interview with a synthesized story of the candidate, not a PDF.
- Reduce offer fall-through via informed comp decisions.
- Report hiring metrics to CHRO without spreadsheet archaeology.

#### Value Drivers
- **Candidate Intelligence Brief™**, RadarAgent shortlists, SchedulerAgent, OfferAgent scenarios, analytics export.

#### Behavioral Traits
- Batch-oriented mornings; mobile triage between meetings; low tolerance for tools that require perfect data entry upfront.

#### System Layer: **Talent Orchestration Stack**
RadarAgent → IntelligenceAgent → OutreachAgent / SchedulerAgent → ScreenAgent → Interview orchestration → OfferAgent, governed by **Master Orchestrator** + Human Handoff gates.

#### Responsibilities
| Automation | Human judgment |
|------------|----------------|
| Multi-source discovery, fit scoring, draft outreach | Approve shortlist, edit/send outreach, final interview verdict |
| Pre-interview packs, debrief templates | Subjective fit, culture calls |
| Offer package drafts, scenario math | Band compliance, verbal agreement, offer letter authorization |

#### Dashboard View (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ TalentAgent™ — Alex · Acme Corp                    [Alerts: 2]   │
├─────────────────────────────────────────────────────────────────┤
│ OPEN REQS (18)     Pipeline health: 3 at risk   TTF predict: ↓ │
├─────────────────────────────────────────────────────────────────┤
│ TODAY                                                            │
│ • 09:30 Interview — M.LEE (ML Eng)  [Brief ✓] [Pre-prep 3 Qs]   │
│ • 11:00 Approve outreach batch (5)  RadarAgent · EU expansion   │
│ • 14:00 Bias monitor review — Req #4412 shortlist adjusted      │
├─────────────────────────────────────────────────────────────────┤
│ QUEUE                         INSIGHTS                           │
│ Pending approvals: 7          Response rate +12% vs team avg    │
│ Screens to review: 4          Top drop-off stage: Tech screen     │
└─────────────────────────────────────────────────────────────────┘
```

#### User Flow (Step-by-Step) — “New Req to First Interview”

| Step | Actor / System | Time (indicative) | Automation | Decision point |
|------|----------------|-------------------|------------|----------------|
| 1 | Alex opens TalentAgent | 10s | Loads pipeline + alerts | Choose req |
| 2 | Alex describes role in NL → Requisition Intelligence | 3–8 min | Structured JD, skills, comp benchmark | Approve req / edit / send to approval chain |
| 3 | RadarAgent runs multi-source discovery | 20–90 min async | Ranked shortlist + SHAP-style breakdown | Alex approves shortlist |
| 4 | OutreachAgent drafts messages | 5–15 min | Personalized drafts with 2+ verifiable signals | Alex approves batch |
| 5 | Candidate responds; SchedulerAgent negotiates | Variable | Calendar negotiation, confirmations | Alex confirms slot if conflict |
| 6 | ScreenAgent async video / work sample (if enabled) | 1–3 days candidate-side | Scored capability layer | Alex reviews screen summary |
| 7 | IntelligenceAgent refreshes brief + pre-interview pack | &lt; 45 min p95 target | Pack to Alex + context to candidate (policy) | Alex runs interview |

---

### Persona B — Priya (Active Job Seeker)

#### Profile
PM, ~4 YOE; 8–12 apps/week; wants company-specific prep and negotiation confidence.

#### Goals / Objectives
- Apply only to roles worth her trajectory.
- Position her story per company and interviewer.
- Know worth and negotiate without blind spots.
- Understand why applications don’t convert.

#### Value Drivers
DiscoveryAgent, ApplicationAgent, **Opportunity Intelligence Brief™**, InterviewCoachAgent, NegotiationAdvisorAgent.

#### Behavioral Traits
- Mobile-first evenings; anxiety before interviews; high engagement if feedback loops are fast and specific.

#### System Layer: **Career Intelligence Stack**
SkillMapAgent (onboarding) → DiscoveryAgent → ApplicationAgent → OpportunityIntelligenceAgent → InterviewCoachAgent → NegotiationAdvisorAgent.

#### Responsibilities
| Automation | Human judgment |
|------------|----------------|
| Market scan, dedupe, fit explanations | Select roles to pursue; approve apps |
| Resume/cover drafts, form-fill drafts | Final edit and submit |
| Mock interviews, pacing/filler feedback | Whether to accept offer / counter |

#### Dashboard View (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ CareerAgent™ — Priya                              [Interview 24h] │
├─────────────────────────────────────────────────────────────────┤
│ THIS WEEK                                                        │
│ New matches: 6 (2 high fit)    Applications: 4 active           │
├─────────────────────────────────────────────────────────────────┤
│ STARRIVER — PM, Growth                                          │
│ Fit: 91  “Values your funnel work + B2B scale”                  │
│ [View brief] [Practice 15m] [Track status]                      │
├─────────────────────────────────────────────────────────────────┤
│ INSIGHTS                      ACTIONS                          │
│ Weak spot: metrics stories      Schedule voice mock             │
│ Reply rate vs peers: −8%        Refresh resume emphasis         │
└─────────────────────────────────────────────────────────────────┘
```

#### User Flow — “Match to Submit”

| Step | Time | Automation | Decision |
|------|------|------------|----------|
| 1 | Ongoing | DiscoveryAgent scans market | Priya opens digest |
| 2 | 2–4 min/role | Fit score + explanation | Priya adds to “pursue” |
| 3 | 5–12 min | ApplicationAgent tailors resume + letter | Priya edits + approves |
| 4 | 2–5 min | Form-fill draft | Priya confirms submit |
| 5 | Post-submit | Tracker + follow-up nudges | Priya acts on nudges |

---

### Persona C — Raj (Passive Candidate)

#### Profile
Senior ML engineer; not actively applying; open to the right role; hates generic InMail.

#### Goals / Objectives
- Only hear about aligned opportunities.
- Be approached with context worth a reply.
- Understand technical culture before committing to a loop.

#### Value Drivers
**Passive signal** handling (public activity signals), high-quality employer outreach (enforced on TalentAgent side), **Opportunity Intelligence Brief™** if he engages.

#### Behavioral Traits
- Low notification tolerance; responds to specificity and respect for time.

#### System Layer: **Signal & Selective Engagement Module**
DiscoveryAgent (inbound path) + employer-side RadarAgent / OutreachAgent quality gates + CareerAgent lightweight profile.

#### Responsibilities
| System | Raj |
|--------|-----|
| Surfaces roles only above fit + comp floor (if configured) | Sets openness, exclusions, comp floor |
| Employer outreach must cite verifiable signals | One-tap “interested / not now” |
| If engaged, full CareerAgent stack activates | Chooses whether to enter process |

#### Dashboard View (ASCII) — Passive Mode

```
┌─────────────────────────────────────────────────────────────────┐
│ CareerAgent™ — Raj · Passive mode                                │
├─────────────────────────────────────────────────────────────────┤
│ OPENNESS: Staff+ ML · Remote EU/UK · Mission-driven orgs        │
│ Excluded: 12 companies                                           │
├─────────────────────────────────────────────────────────────────┤
│ INBOUND (2 worth reading)                                        │
│ • Aurora Labs — cites your OSS graph work + talk @ NeurIPS      │
│   [See why] [Decline] [Save]                                     │
├─────────────────────────────────────────────────────────────────┤
│ QUIET HOURS ON · Digest: Sundays 18:00                          │
└─────────────────────────────────────────────────────────────────┘
```

#### User Flow
1. Raj sets passive preferences and exclusions (2–5 min).
2. System suppresses low-fit noise; surfaces only high-context inbound.
3. Raj opens one thread → sees employer-side substance (not template score).
4. If interested → SchedulerAgent path or “save for later” — CareerAgent deepens prep on demand.

---

### Persona D — Sandra (HR Operations Leader)

#### Profile
VP People Ops ~5k employees; owns compliance, vendors, hiring metrics; needs GDPR / EU AI Act narrative for the board.

#### Goals / Objectives
- Immutable audit trail for hiring activity.
- Explainable AI-assisted decisions.
- Workday/Greenhouse cohesion with clear system-of-record rules.
- Configurable human approval gates.

#### Value Drivers
**HOGH Admin Console**, compliance-service, bias monitor outputs, integration-hub visibility, retention on policy config.

#### System Layer: **Governance & Integration Control Plane**
Audit log, RLS tenants, approval chains, connector health, DSAR tooling.

#### Responsibilities
| Sandra | Platform |
|--------|----------|
| Defines approval chains, band linkage to HRIS | Enforces Human Handoff + DB constraints on offers |
| Reviews bias flags and explainability reports | Logs every checkpoint atomically |
| Owns vendor DPA / residency | EU region routing per tenant |

#### Dashboard View (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│ HOGH Admin — Sandra · Acme Corp                                  │
├─────────────────────────────────────────────────────────────────┤
│ COMPLIANCE          INTEGRATIONS        AI GOVERNANCE            │
│ Open DSARs: 1       Greenhouse ✓       EU AI Act: Phase 2       │
│ Bias flags (30d): 2 Workday HCM ✓      Last model card: 12d ago │
├─────────────────────────────────────────────────────────────────┤
│ APPROVAL POLICIES                                                │
│ Outreach: Recruiter required · Offers: Recruiter+HRBP           │
│ NegotiationCoach: Enabled · SSO: Okta MFA                       │
├─────────────────────────────────────────────────────────────────┤
│ AUDIT QUICK SEARCH: [user / req / candidate id        ] [Search]  │
└─────────────────────────────────────────────────────────────────┘
```

#### User Flow
1. Sandra configures SSO, roles, approval policies (initial + ongoing).
2. Reviews integration sync health and conflict queue (weekly).
3. On bias flag → opens explainability packet → accepts corrective re-rank or escalates (case-by-case).
4. Quarterly: exports board-ready hiring report from analytics bridge.

---

## 4. Intelligent System / Agent Architecture

### System Behavior Tiers

| Mode | Example | Bound |
|------|---------|-------|
| **Reactive** | “Generate brief for this candidate now” | User-triggered; same provenance rules |
| **Proactive** | Pre-interview pack 24h before interview | Calendar + policy triggered |
| **Autonomous** | Scheduler negotiates slots; OutreachAgent A/B tests framing | Stops at human gates; no unapproved send |

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│ MONITORING / INTAKE                                              │
│ ATS + HRIS webhooks · calendars · email/SMS · market APIs ·       │
│ public professional graphs (ToS-compliant)                       │
└───────────────────────────────┬───────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ DECISION ENGINE                                                  │
│ Master Orchestrator (ReAct / LangGraph) · matching-service GNN   │
│ bias-monitor sidecar · policy / comp band constraints            │
└───────────────────────────────┬───────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ EXECUTION ENGINE                                                 │
│ intelligence-service · outreach · scheduler · offer · negotiation│
│ Sub-agents: Radar, Intelligence, Outreach, Screen, Coach, etc.   │
└───────────────────────────────┬───────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ FEEDBACK LOOP                                                    │
│ Debrief templates · response rates · offer outcomes · retention  │
│ signals → retraining / prompt registry / strategy revision       │
└─────────────────────────────────────────────────────────────────┘
```

### Explainability Layer
- **SHAP-style** feature breakdown on match scores (recruiter-facing).
- **Inline citations** on narrative briefs (both sides where applicable).
- **Prompt versioning** — which template produced which output (internal + audit).

### Human-in-the-Loop Controls
- Blocking checkpoints: shortlist approval, outreach approval, offer letter generation (DB-enforced association with human approval id).
- Enterprise-configurable strictness on bias remediation (cannot fully disable monitor).

---

## 5. Multi-Step Workflows

### Workflow 1 — **Requisition-to-Shortlist Research**

| Field | Detail |
|-------|--------|
| **Purpose** | Turn NL intent into an approved, bias-checked shortlist. |
| **Components** | Requisition Intelligence, RadarAgent, matching-service, bias-monitor, recruiter UI. |
| **Steps** | NL intake → structured JD + taxonomy → health score → approval chain → discovery → scoring → disparate impact check → recruiter approval. |
| **I/O** | Input: hiring manager constraints. Output: ranked shortlist + explanations + flags. |
| **Time** | Wall-clock hours (async discovery); human steps 15–45 min cumulative. |

### Workflow 2 — **Candidate Intelligence Brief Generation**

| Field | Detail |
|-------|--------|
| **Purpose** | Single narrative artifact for defensible, interview-ready understanding. |
| **Components** | RAG (Neo4j + Pinecone + web/API), IntelligenceAgent, llm-gateway, provenance UI. |
| **Steps** | Query construction → multi-source retrieval → re-rank → assemble context → generate schema-valid brief → attach citations → deliver to dashboard + pre-interview pack. |
| **I/O** | Input: candidate identifiers + role context. Output: **Candidate Intelligence Brief™**. |
| **Time** | Target p95 &lt; 45 min fully automated segment; faster on cache hit. |

### Workflow 3 — **Application & Interview Prep (Candidate)**

| Field | Detail |
|-------|--------|
| **Purpose** | Maximize conversion and performance per opportunity. |
| **Components** | ApplicationAgent, OpportunityIntelligenceAgent, InterviewCoachAgent. |
| **Steps** | Approve role → tailored docs → submit → schedule → 24h brief → mock sessions → iterate on weak question types. |
| **I/O** | Input: Priya’s profile + JD + interviewer data. Output: docs, brief, practice analytics. |
| **Time** | 1–3 hours spread over days (human practice optional but recommended). |

### Workflow 4 — **Offer Construction & Live Negotiation**

| Field | Detail |
|-------|--------|
| **Purpose** | Align package to bands and market while preserving human speech acts. |
| **Components** | OfferAgent, negotiation-service, NegotiationCoach™ (dual private streams), HRIS comp bands. |
| **Steps** | Scenario modelling → recruiter approval → verbal agreement path → (optional) both acknowledge NegotiationCoach → live asymmetric prompts → outcome logged (no cross-side leakage). |
| **I/O** | Input: constraints + market benchmarks. Output: recommended package + coaching transcript (private per party). |
| **Time** | Modelling: minutes; live session: real-time (&lt; 800ms p95 target for prompts). |

### Workflow 5 — **Compliance & Audit Replay**

| Field | Detail |
|-------|--------|
| **Purpose** | Defensible reconstruction for CHRO, regulator, or litigation hold. |
| **Components** | compliance-service, immutable audit store, Kafka replay, LangGraph checkpoints. |
| **Steps** | Event captured at checkpoint → notification → human action → resumption event → correlated prompt version + model route. |
| **I/O** | Query by tenant/user/entity id → timeline + artifacts. |
| **Time** | Search seconds; full export depends on scope. |

---

## 6. Daily System Actions & Capabilities

### Capability: **Market Discovery Scan (CareerAgent)**

| Field | Detail |
|-------|--------|
| **Trigger** | Scheduled + event-driven (profile change). |
| **Input** | User goals, exclusions, comp floor, skill graph. |
| **Process** | Dedupe, filter stale/low comp, embedding match + graph features. |
| **Output** | Digest notification + in-app match cards with explanations. |
| **Frequency** | Continuous backend; user-facing digest configurable (e.g. daily). |

### Capability: **Pipeline Drift Monitor (TalentAgent)**

| Field | Detail |
|-------|--------|
| **Trigger** | Stage timers + req health rules. |
| **Input** | ATS stage data + HOGH agent state. |
| **Process** | Predict TTF contribution; flag reqs stuck &gt; threshold. |
| **Output** | “At risk” badges + suggested plays (e.g. refresh shortlist). |
| **Frequency** | Hourly rollup; real-time WebSocket on critical transitions. |

### Capability: **Brief Freshness & Cache**

| Field | Detail |
|-------|--------|
| **Trigger** | Interview scheduled; material change in source data. |
| **Input** | Cached RAG fingerprint vs new events. |
| **Process** | Invalidate or partial refresh; regenerate sections. |
| **Output** | Updated brief with version note. |
| **Frequency** | Event-driven; cache TTL (e.g. 7d) for identical prompts. |

### Capability: **Outreach Learning Loop**

| Field | Detail |
|-------|--------|
| **Trigger** | Send batches + reply signals. |
| **Input** | Message variants, timing, role family. |
| **Process** | RL-style policy adjustment within compliance bounds. |
| **Output** | Higher-response templates suggested for approval. |
| **Frequency** | Continuous with human approval for template deployment. |

### Capability: **Bias Monitor Pass**

| Field | Detail |
|-------|--------|
| **Trigger** | Shortlist / ranking commit points. |
| **Input** | Ranked list + proxy demographic inference. |
| **Process** | Four-fifths style tests; feature attribution for imbalance. |
| **Output** | Block or corrective re-rank + explainability packet. |
| **Frequency** | Every ranking gate (configurable strictness). |

---

## 7. Dashboard & Interface Specifications

### Surfaces Overview

| Surface | User | Primary jobs |
|---------|------|--------------|
| **TalentAgent™ Dashboard** | Recruiter / HM | Pipeline, approvals, briefs, screens, offers |
| **CareerAgent™ App** | Candidate | Matches, applications, prep, negotiation |
| **NegotiationCoach™** | Both (private) | Live asymmetric guidance |
| **HOGH Admin Console** | HR Ops | Policy, integrations, audit, DSAR |
| **Talent Intelligence API** | Developers | Match, skill graph, benchmarks, brief API |

### Main Navigation — TalentAgent (Information Architecture)

```
Home (Today / Alerts)
  Requisitions
    → Req detail: Health · JD · Approvals · Shortlist · Outreach · Pipeline
  Candidates
    → Candidate: Brief · Screen · Interviews · Offer · Audit trail (role-gated)
  Analytics
  Settings / Integrations (role-gated)
```

### Main Navigation — CareerAgent

```
Home (Active opportunities + next actions)
  Discover
  Applications (tracker)
  Prepare (briefs + mock interviews)
  Offers & negotiate
  Profile & privacy (footprint, DSAR, NegotiationCoach prefs)
```

### Secondary Panels
- **Right rail:** Explainability + citations for any AI block.
- **System control (Admin):** Connectors, webhook health, model/prompt rollout flags.

### ASCII — NegotiationCoach Session (Conceptual)

```
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ RECRUITER (PRIVATE)          │  │ CANDIDATE (PRIVATE)          │
│ Band: £X–£Y (policy)         │  │ Market: role/geo median      │
│ vs market / hist offers      │  │ Suggested counter range      │
│ If-then: “if they ask…”      │  │ If-then: pivot base→equity   │
│ [No candidate raw numbers]   │  │ [No internal band leak]      │
└──────────────────────────────┘  └──────────────────────────────┘
         │                                    │
         └─────────── live call ──────────────┘
              (humans speak; AI advises)
```

### Data Prioritization
1. **Action required** (approvals, bias flags, interview in 24h).
2. **Risk** (req health, offer competitiveness, application stagnation).
3. **Insight** (trends, benchmarks, coach tips).

---

## 8. Onboarding Flows

### TalentAgent — Enterprise Recruiter (Alex)

| Step | Purpose | Friction reduction |
|------|---------|-------------------|
| 1. **Segmentation** | Role (recruiter vs HM), team, region. | SSO + JIT provisioning. |
| 2. **Goal capture** | Primary pain (sourcing vs scheduling vs offer). | Skip deep config; defaults from industry template. |
| 3. **Data connection** | ATS + calendar + (optional) LinkedIn Talent Solutions. | OAuth; clear “what syncs” copy. |
| 4. **Personalization** | Tone for outreach, approval chains, comp band source (HRIS). | Sandra’s policies pre-seeded where applicable. |
| 5. **First value** | “First brief” wizard: pick existing ATS candidate → brief in &lt; 1 hr. | Celebrates citation links + one approval practiced. |

### CareerAgent — Job Seeker (Priya)

| Step | Purpose | Friction reduction |
|------|---------|-------------------|
| 1. **Segmentation** | Active vs passive; industry; seniority. | Branching UI. |
| 2. **Goal capture** | Target roles, non-negotiables, timeline. | Conversational Career Intelligence Session (30–45 min) broken into saveable chunks. |
| 3. **Data/input** | Resume, LinkedIn, GitHub consent scopes. | Granular toggles + preview of what agents will read. |
| 4. **Personalization** | Skill gap matrix + voice samples for cover letters. | Visual SkillMap; optional “paste writing sample.” |
| 5. **First value** | 3 explained matches + one tailored resume preview (unsent until approve). | Immediate “why these roles” moment. |

### Admin — Sandra

| Step | Purpose |
|------|---------|
| Tenant residency + DPA acknowledgment |
| SSO + MFA enforcement |
| ATS/HRIS connectors + system-of-record rules |
| Approval policy templates |
| Bias monitor strictness (within compliant bounds) |
| Assign compliance_officer role |

---

## 9. Key User Journeys

### Journey 1 — **Daily Usage (Alex, 20 minutes)**

| Aspect | Detail |
|--------|--------|
| **Time** | 15–25 min |
| **Flow** | Open Home → clear 2 approvals (outreach + reschedule) → scan “Today’s interviews” → open brief → tap recommended questions → log quick debrief on finished call. |
| **System role** | Surfaces risk-ranked queue; pre-computes packs; pushes bias/ATS anomalies. |
| **Output** | Updated pipeline stages, refreshed rankings, audit entries for approvals. |

### Journey 2 — **Weekly Workflow (Priya, ~2 hours)**

| Aspect | Detail |
|--------|--------|
| **Time** | 90–150 min across week |
| **Flow** | Sunday digest review → shortlist 2 roles → approve apps Mon → receive Opportunity briefs Wed–Thu → 2× mock sessions Fri → adjust talking points. |
| **System role** | Discovery + doc generation + practice analytics loop. |
| **Output** | Submitted apps, readiness score trend, refined stories. |

### Journey 3 — **Long-Term Usage (Raj + Sandra, months)**

| Aspect | Detail |
|--------|--------|
| **Time** | Low touch ongoing |
| **Flow** | Raj stays passive but updates openness quarterly; engages 1–2 high-signal threads; Sandra reviews monthly compliance dashboard + quarterly board export; enterprise expands connectors. |
| **System role** | Retention signals, integration health, model/prompt governance artifacts accumulate — **switching cost** in memory of preferences, audit history, and tuned policies. |
| **Output** | Fewer wasted interviews for Raj; defensible AI ops narrative for Sandra. |

---

## 10. Engagement & Retention Mechanics

| Mechanic | Implementation |
|----------|----------------|
| **Habit loop** | Daily “clear the queue” for recruiters; interview countdown + brief unlock for candidates. |
| **Feedback cycles** | Post-interview debrief prompts; application outcome notifications with anonymized recruiter feedback when enabled. |
| **Progress tracking** | Mock interview history; pipeline velocity; skill gap shrink over time on SkillMap. |
| **Personalization** | Outreach and coaching improve from outcomes; prompt registry per tenant. |
| **Notifications** | Email + push (FCM): approvals needed, interview 24h, offer events — **quiet hours** respected for passive users. |
| **Gamification** | Light, professional: readiness scores, response-rate benchmarks (no cartoon badges unless enterprise opts in). |
| **Switching cost** | Integrated ATS state, historical briefs, audit trail, tuned approval policies, and stored voice/writing preference for ApplicationAgent. |

---

## 11. Marketing / Landing Experience (Optional but Recommended)

### Page Structure (High Conversion)

1. **Hero**  
   - Headline: *Two agents. One hiring conversation. Both sides prepared.*  
   - Sub: Intelligence layer above your ATS — not another ATS.  
   - Dual CTA: **For employers** / **For talent**.

2. **Problem → Solution**  
   - Employers: shallow data, slow scheduling, offer guesswork.  
   - Talent: spray-and-pray, generic prep, asymmetric negotiation.

3. **Feature breakdown**  
   - TalentAgent modules (Radar, Intelligence Brief, Scheduler, Offer).  
   - CareerAgent modules (Discovery, Application, Opportunity Brief, Coach).  
   - NegotiationCoach: **private on both sides**, acknowledgment required.

4. **Persona use cases**  
   - Alex: “First interview in 48 hours with a real brief.”  
   - Priya: “Every application with a reason and a plan.”  
   - Sandra: “Audit-ready AI from day one.”

5. **Social proof**  
   - Logos, CHRO quotes, compliance-forward messaging (GDPR, EU AI Act roadmap).

6. **Pricing** (placeholder strategy — execution layer)  
   - Enterprise seat + integration tier; consumer CareerAgent freemium/digest; API usage-based.

7. **CTA**  
   - Book enterprise workflow audit / Start CareerAgent intelligence session.

### Trust Footer
Data minimization, citation transparency, candidate DSAR, no cross-side NegotiationCoach leakage.

---

## Document Control

| Field | Value |
|-------|--------|
| **Source** | `product_note.md` v1.0 + `prompts/user_flow.md` spec |
| **Product** | HireOrGetHired (HOGH) |
| **Audience** | Design, product, engineering, GTM |
| **Status** | Execution-ready narrative spec (March 2026) |

---

*End of document.*
