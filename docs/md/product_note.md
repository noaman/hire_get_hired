# HireOrGetHired (HOGH)
## Product & Technical Architecture Note
### Version 1.0 | March 2026 | Confidential

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Personas & Jobs-to-Be-Done](#2-user-personas--jobs-to-be-done)
3. [Product Architecture — Feature Map](#3-product-architecture--feature-map)
4. [Technical Architecture](#4-technical-architecture)
5. [Agent System Design](#5-agent-system-design)
6. [Data Architecture](#6-data-architecture)
7. [Infrastructure & DevOps](#7-infrastructure--devops)
8. [Security, Privacy & Compliance Engineering](#8-security-privacy--compliance-engineering)
9. [Integrations & API Layer](#9-integrations--api-layer)
10. [Engineering Milestones & Build Sequence](#10-engineering-milestones--build-sequence)

---

## 1. Product Overview

HireOrGetHired is a dual-sided Agentic AI platform for talent acquisition. It deploys a persistent AI agent — a "Second Brain" — for both sides of every hiring conversation: the **TalentAgent™** for recruiters and the **CareerAgent™** for job seekers. Both agents operate autonomously on research, logistics, and preparation tasks, and step back entirely when human judgment is required.

The platform is not an ATS replacement. It is an **intelligence and orchestration layer** that sits above existing HR tooling, connects to it via APIs, and makes every human touchpoint in the hiring process exponentially more informed.

### Core Product Surfaces

| Surface | Primary User | Purpose |
|---|---|---|
| **TalentAgent™ Dashboard** | Recruiter / HR team | Pipeline visibility, Candidate Intelligence Briefs, interview prep, offer management |
| **CareerAgent™ App** (web + mobile) | Job seeker | Job discovery, application management, interview prep, negotiation coaching |
| **NegotiationCoach™** | Both parties (separate private views) | Real-time advisory during live offer conversations |
| **HOGH Admin Console** | HR Ops / Enterprise Admin | User management, ATS integration config, compliance reporting, audit log access |
| **Talent Intelligence API** | Third-party developers / HR platforms | Programmatic access to skill graphs, market benchmarks, and match scoring |

---

## 2. User Personas & Jobs-to-Be-Done

### Persona 1 — The Enterprise Recruiter ("Alex")

**Profile:** Senior talent acquisition specialist at a 3,000-person technology company. Manages 15–20 open requisitions simultaneously. Spends ~60% of time on sourcing, scheduling, and administrative tasks. Frustrated by shallow ATS data and the lack of context before interviews.

**Jobs-to-be-done:**
- Find qualified candidates faster without increasing headcount
- Walk into every interview knowing who I'm talking to — not just their resume
- Reduce offer fall-through by making better-informed compensation decisions
- Show measurable hiring metrics to the CHRO without manual reporting

**Key friction points today:** LinkedIn Recruiter gives raw data, not synthesis. ATS holds stale profiles that never get re-surfaced. No system connects sourcing intelligence to interview prep to offer management.

---

### Persona 2 — The Active Job Seeker ("Priya")

**Profile:** 4 years experience as a product manager. Actively job-searching. Applies to 8–12 roles per week with limited response rates. Lacks salary negotiation confidence. Spends significant time on interview prep that doesn't feel personalized.

**Jobs-to-be-done:**
- Know which roles are actually worth applying to, given my specific background
- Walk into interviews knowing exactly how to position my story for this company
- Understand what I'm worth and how to negotiate without leaving money on the table
- Get feedback on why applications aren't converting

**Key friction points today:** Generic job boards. Cookie-cutter resume advice. No company-specific interview preparation. Negotiating blind against an employer with full salary band information.

---

### Persona 3 — The Passive Candidate ("Raj")

**Profile:** 7 years as a senior ML engineer. Not actively looking but open to the right opportunity. Hates unsolicited, generic recruiter outreach. Values relevant, context-rich engagement.

**Jobs-to-be-done:**
- Only hear about roles that are genuinely aligned with where I want to go
- Be approached with enough context that it feels worth my time
- Understand a company's technical culture before committing to an interview process

**Key friction points today:** 90% of recruiter outreach is mass-produced. No easy way to passively signal openness to specific types of roles without full public job-searching.

---

### Persona 4 — The HR Operations Leader ("Sandra")

**Profile:** VP People Ops at a 5,000-person company. Responsible for compliance, vendor management, and hiring metrics. Needs audit trails. Must demonstrate GDPR and EU AI Act compliance to the board.

**Jobs-to-be-done:**
- Single source of truth for all hiring activity with immutable audit logs
- Confidence that AI-assisted hiring decisions are explainable and defensible
- Seamless integration with existing Workday and Greenhouse environment
- Configurable human approval gates that satisfy legal and HR policy requirements

---

## 3. Product Architecture — Feature Map

### 3.1 TalentAgent™ — Recruiter Product

#### Module 1: Requisition Intelligence
- Natural language requisition creation: recruiter describes the role conversationally; system generates structured JD, extracts skill requirements, maps to ESCO/O*NET taxonomy, and benchmarks the comp range against the Talent Intelligence Graph
- Requisition health scoring: flags unrealistic requirements, identifies mismatches between stated seniority and offered compensation, suggests adjustments based on market supply data
- Approval workflow: routes requisition through configured human approval chain before sourcing begins

#### Module 2: Candidate Sourcing (RadarAgent)
- Multi-source candidate discovery across LinkedIn (via official API), GitHub (public repos + contribution history), Stack Overflow, internal ATS talent pools, and referral networks
- Multi-dimensional fit scoring: skills match, career trajectory alignment, inferred motivation fit, cultural signals — weighted by recruiter-configured priorities
- Passive candidate identification: surfaces professionals whose public activity signals interest in a career move (recent skill additions, follow activity on company pages, increased GitHub public commits) without requiring them to be actively applying
- Shortlist generation: ranked candidate list delivered to recruiter for approval before any outreach is initiated

#### Module 3: Candidate Intelligence Brief™ (IntelligenceAgent)
- Automated synthesis of publicly available professional data into a structured narrative brief
- Career arc analysis: LLM-generated narrative of the candidate's professional trajectory, identifying patterns, pivots, and apparent motivations
- Skills evidence map: each claimed skill backed by concrete public evidence (GitHub repos, publications, presentation history, certification dates)
- Motivation inference: sentiment analysis of public writing, job transition patterns, and engagement signals translated into likely priorities (growth, autonomy, compensation, mission, stability)
- Conversation recommendations: 3–5 specific interview angles tailored to this candidate and this role
- Verification flags: gaps, rapid tenure changes, or inconsistencies surfaced for the recruiter to explore directly
- Data provenance: every claim in the brief links back to its source; candidates can view what data was used and request corrections

#### Module 4: Outreach & Scheduling (OutreachAgent + SchedulerAgent)
- Personalised outreach generation: each message references at least two specific, verifiable signals from the candidate's public profile — not templated mass messages
- Response rate learning: OutreachAgent continuously A/B tests message framing and timing, improving conversion rates using reinforcement learning on response signals
- Recruiter approval gate: all outreach to shortlisted candidates reviewed by recruiter before first send
- SchedulerAgent: negotiates availability across candidate and recruiter calendars (Google Calendar, Outlook), sends confirmation with context-rich pre-meeting briefs to both parties, handles rescheduling autonomously

#### Module 5: Screen & Assessment (ScreenAgent)
- Async video screening: AI-generated role-specific questions delivered via embedded video tool; responses analysed for content quality, communication clarity, and structured competency signals
- Portfolio and work-sample analysis: GitHub repositories, design portfolios, writing samples — assessed against role requirements with evidence-backed scoring
- Structured capability profile: output fed into Candidate Intelligence Brief™ as a verified competency layer

#### Module 6: Interview Orchestration
- Pre-interview pack sent automatically to recruiter: final Candidate Intelligence Brief™ with updated screen data, recommended questions, compensation context
- Video interview hosted within platform (or integrated with Zoom/Teams via webhook)
- Post-interview debrief prompt: structured feedback template sent to recruiter immediately after the call; impressions logged and used to update candidate ranking
- Candidate feedback loop: CareerAgent notifies job seeker of outcome and provides anonymised feedback points where recruiter has enabled this

#### Module 7: Offer Management (OfferAgent)
- Offer package generation: recommended salary, bonus, equity, and benefits package benchmarked against Talent Intelligence Graph real-time market data and company's own historical offer distribution
- Scenario modelling: "if equity cliff is extended, what's the cash equivalent?" — modelled for the recruiter before the offer conversation
- Approval workflow: every offer requires human recruiter approval before generation; offer letter generated only after verbal agreement is reached
- NegotiationCoach™ activation: see Section 3.3

#### Module 8: Analytics & Reporting
- Pipeline velocity dashboard: real-time view of all requisitions by stage, time-in-stage, and predicted time-to-fill
- Diversity analytics: demographic composition at each funnel stage; bias audit results surfaced in real-time
- Recruiter performance metrics: conversion rates, response rates, offer acceptance rates — benchmarked against platform averages
- CHRO-level reporting: auto-generated board-ready hiring reports exportable as PDF or pushed to HRIS

---

### 3.2 CareerAgent™ — Job Seeker Product

#### Module 1: Career Intelligence Session (onboarding)
- Structured onboarding conversation (30–45 minutes): CareerAgent conducts a deep discovery session — skills inventory, career motivations, work style preferences, non-negotiables (comp floor, location, remote requirements), short- and long-term goals
- Public footprint analysis: with user consent, CareerAgent analyses their LinkedIn profile, GitHub repos (if applicable), and portfolio to identify how the market currently perceives them vs. how they perceive themselves
- Skill gap matrix: SkillMapAgent generates a visual map of the distance between current profile and target role requirements, with specific, actionable learning pathway recommendations

#### Module 2: Opportunity Discovery (DiscoveryAgent)
- Continuous background scanning: DiscoveryAgent monitors job market in real-time and surfaces opportunities matched to user's full profile — not just job title keywords
- Fit scoring with explanation: every surfaced role includes a transparent explanation of why it was matched — "this role values your ML pipeline experience and is a step toward the technical lead trajectory you mentioned"
- Deduplication and quality filtering: removes roles the user has already seen, companies they've explicitly excluded, and roles where compensation is publicly listed below their stated floor
- User approval gate: user reviews shortlist and selects which roles to pursue — no applications submitted without explicit approval

#### Module 3: Application Engine (ApplicationAgent)
- Tailored resume generation: for each approved role, ApplicationAgent rewrites the user's resume to emphasise the experiences most relevant to that specific JD — same career history, different emphasis
- Cover letter generation: role-specific, company-specific, written in the user's established voice (learned from onboarding samples)
- Form-fill automation: multi-step application forms completed autonomously using profile data; user reviews and approves before submission
- Application tracker: every application logged with status, timeline, and follow-up recommendations

#### Module 4: Opportunity Intelligence Brief™ (OpportunityIntelligenceAgent)
Delivered 24 hours before every interview:
- Company intelligence: culture signals synthesised from Glassdoor reviews, LinkedIn employee posts, recent news, funding announcements (Crunchbase), founder interviews, and product reviews — not marketing copy
- Interviewer profile: their professional background, communication style inferred from public writing, career trajectory, topics they're known to care about
- Role market context: salary range for this exact role in this geography, demand trend for these skills, growth trajectory of this function at this company
- Narrative optimisation: 3–5 talking points connecting the user's specific background to what this role needs — not generic "tell your story" advice
- Anticipated questions: role-specific and interviewer-specific likely questions; suggested responses aligned to the user's actual experience
- Gap preparation: honest identification of where the profile falls short, with specific framing strategies for addressing those gaps directly and confidently in the interview

#### Module 5: Interview Coaching (InterviewCoachAgent)
- Personalised mock interview sessions: questions generated from the actual JD, the interviewer's known focus areas, and the user's profile — not generic question banks
- Real-time feedback: scored on content quality, conciseness, confidence signals (filler words, pacing), and STAR structure adherence
- Session history: improvement tracked across sessions; CareerAgent identifies which question types the user consistently struggles with and dedicates additional practice to them
- Voice mode: full spoken mock interview with transcription and annotated feedback

#### Module 6: Offer Evaluation & Negotiation (NegotiationAdvisorAgent)
- Offer analysis: any offer received is benchmarked against live market data, the company's known offer distribution (from platform data), and the user's stated priorities
- BATNA modelling: "what is your best alternative?" — modelled explicitly so the user knows their leverage
- Negotiation briefing: recommended counter-offer amount, specific framing language, which benefits are worth pushing on vs. accepting, and the likely range of recruiter flexibility
- NegotiationCoach™ activation: see Section 3.3

#### Module 7: Career Path Modelling (CareerPathAgent)
- Multi-year career trajectory simulation: given current profile and stated goals, models 3–4 plausible career paths with projected compensation, title progression, and required skill development
- Role ROI comparison: if choosing between two offers, models the 5-year financial and career-capital implications of each
- Market trend overlay: highlights which trajectories are being accelerated or disrupted by market and technology trends

---

### 3.3 NegotiationCoach™ — Dual-Side Advisory

The NegotiationCoach™ activates during the live offer conversation and delivers simultaneous, private, asymmetric intelligence to both parties. Both parties must explicitly acknowledge AI advisory is active before the session begins.

**Recruiter view (private dashboard):**
- Live offer comparison vs. market median and company's own 25th/50th/75th percentile offer distribution
- Candidate's inferred compensation floor (derived from CareerAgent interaction signals — only surfaced as a range, not a precise figure)
- Candidate's stated priority stack (e.g. equity > base > remote) — shared only if candidate has enabled this in their CareerAgent privacy settings
- Competing offer signals (if candidate has shared this via CareerAgent)
- If-then guidance: scenario-based recommendations updated as the conversation progresses
- Company policy guardrails: NegotiationCoach™ never suggests offers outside the recruiter's approved compensation band

**Candidate view (private app):**
- Offer benchmarked against market data in real-time
- Company's typical offer flexibility range (estimated from platform aggregate data)
- Recommended counter-offer with specific framing language
- Which benefits have historically been negotiable at this company vs. non-negotiable
- Live "coaching prompts" as the conversation develops — e.g. "if they push back on base, pivot to equity vesting cliff"

**What NegotiationCoach™ does not do:**
- It does not communicate between the two sides — no shared data, no coordination
- It does not make offers or counter-offers — it advises humans who then speak for themselves
- It does not activate unless both parties have acknowledged its presence in the session

---

## 4. Technical Architecture

### 4.1 High-Level System Architecture

HOGH is built as a **cloud-native, microservices-based platform** on AWS, with a clear separation between the AI/agent layer, the application layer, the data layer, and the integration layer.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  TalentAgent™ Web App  │  CareerAgent™ Web + Mobile  │  API     │
└──────────────┬──────────────────────┬───────────────────────────┘
               │                      │
┌──────────────▼──────────────────────▼───────────────────────────┐
│                     API GATEWAY (AWS API GW + Kong)             │
│     Auth (Cognito/JWT)  │  Rate Limiting  │  Request Routing    │
└──────────────┬──────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                   APPLICATION SERVICES LAYER                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Recruiter  │  │  Candidate  │  │  Negotiation│              │
│  │  Service    │  │  Service    │  │  Service    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                     │
│  ┌──────▼────────────────▼────────────────▼──────┐              │
│  │           AGENT ORCHESTRATION LAYER           │              │
│  │   Master Orchestrator (ReAct / LangGraph)     │              │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐      │              │
│  │   │TalentAgt │ │CareerAgt │ │NegoCoach │      │              │
│  │   │Sub-Agents│ │Sub-Agents│ │Sub-Agents│      │              │
│  │   └────┬─────┘ └────┬─────┘ └────┬─────┘      │              │
│  └────────┼────────────┼────────────┼────────────┘              │
└───────────┼────────────┼────────────┼────────────────────────── ┘
            │            │            │
┌───────────▼────────────▼────────────▼───────────────────────────┐
│                        DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │  │   Pinecone   │  │    Neo4j     │           │
│  │  (Primary)   │  │ (Vector DB)  │  │  (Graph DB)  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  Redis       │  │  S3 / Data   │                             │
│  │  (Cache)     │  │  Warehouse   │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                     INTEGRATION LAYER                           │
│  LinkedIn API  │  GitHub API  │  Greenhouse  │  Google/Outlook  │
│  Workday HCM   │  Stripe      │  Zoom/Teams  │  Comp Databases  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Frontend Architecture

**TalentAgent™ Dashboard (Web)**
- Framework: React 18 + TypeScript
- State management: Zustand (lightweight, avoids Redux overhead for agent state streams)
- Real-time updates: WebSocket connections via AWS API Gateway WebSocket API — agent progress, pipeline status changes, and NegotiationCoach™ live prompts all stream over WebSocket
- Component library: custom design system built on Radix UI primitives (accessible, unstyled base) with Tailwind CSS
- Charting: Recharts for pipeline analytics; D3.js for the Talent Intelligence Graph visualisation
- Auth: AWS Cognito with enterprise SSO support (SAML 2.0 / OIDC for Okta, Azure AD, Google Workspace)

**CareerAgent™ App (Web + Mobile)**
- Web: Next.js 14 (App Router) for SEO-friendly job discovery pages and fast initial load
- Mobile: React Native (shared business logic via a `@hogh/core` package between web and mobile)
- Offline capability: React Query with persistent cache — Opportunity Intelligence Briefs downloaded for offline reading before interviews
- Push notifications: Firebase Cloud Messaging for interview reminders, offer alerts, and agent status updates
- Voice mode (InterviewCoachAgent): WebRTC audio capture + streaming transcription via AWS Transcribe Streaming

### 4.3 Backend Architecture

**Service decomposition — Domain-driven microservices:**

| Service | Responsibility | Tech |
|---|---|---|
| `recruiter-service` | Recruiter user management, requisition CRUD, pipeline state | Node.js + Express, PostgreSQL |
| `candidate-service` | Candidate profiles, application tracking, CareerAgent state | Node.js + Express, PostgreSQL |
| `agent-orchestrator` | Master agent loop, task decomposition, sub-agent dispatch, Human Handoff Protocol enforcement | Python + FastAPI + LangGraph |
| `intelligence-service` | Candidate Intelligence Brief generation, Opportunity Intelligence Brief generation | Python + FastAPI, integrates LLM APIs |
| `matching-service` | Multi-dimensional candidate-role fit scoring using Talent Intelligence Graph | Python + FastAPI, Neo4j + Pinecone |
| `outreach-service` | Personalised message generation, send queue, response tracking | Python + FastAPI, SES, Redis |
| `scheduler-service` | Calendar negotiation, interview booking, conflict resolution | Node.js, Google Calendar API, Microsoft Graph API |
| `negotiation-service` | NegotiationCoach™ session management, private advisory stream per party | Python + FastAPI, WebSocket |
| `offer-service` | Offer package generation, approval workflow, contract generation | Node.js, PostgreSQL |
| `retention-service` | Post-hire pulse surveys, sentiment analysis, flight risk scoring | Python, scheduled jobs via AWS EventBridge |
| `compliance-service` | Audit log writes, DSAR processing, bias monitor, explainability engine | Python, immutable append-only PostgreSQL table + S3 archive |
| `notification-service` | Email, push, in-app notifications | Node.js, SES, SNS, FCM |
| `analytics-service` | Pipeline metrics aggregation, reporting, CHRO dashboard data | Python, AWS Athena + S3 data warehouse |

**Inter-service communication:**
- Synchronous (request-response): REST over internal HTTPS for user-facing operations
- Asynchronous (event-driven): Apache Kafka for agent task queues, pipeline state changes, audit log events, and data sync. Kafka chosen over SQS for its replay capability — critical for audit log reconstruction and agent debugging
- Agent streaming: Server-Sent Events (SSE) from `agent-orchestrator` to frontend for real-time agent progress display

---

## 5. Agent System Design

### 5.1 Master Orchestrator

The master orchestrator is the cognitive backbone of the HOGH agent system. It is implemented using **LangGraph** (a stateful, graph-based agent orchestration framework built on LangChain) with a custom **ReAct (Reasoning + Acting)** planner.

**Orchestrator loop:**

```
1. RECEIVE goal (e.g. "Fill ML Engineer role, London, £120K, 45 days")
2. DECOMPOSE into sub-tasks using LLM-powered task planner
3. ASSIGN sub-tasks to specialist sub-agents via task queue
4. MONITOR sub-agent progress via Kafka event stream
5. EVALUATE outputs — if quality threshold not met, re-queue with revised instructions
6. CHECK Human Handoff Protocol at each defined gate
   → If gate requires human approval: PAUSE, NOTIFY recruiter, AWAIT response
   → If approved: CONTINUE
   → If rejected: REVISE and re-present, or escalate
7. SYNTHESISE sub-agent outputs into unified deliverables (e.g. Candidate Intelligence Brief™)
8. REPORT progress to recruiter dashboard via WebSocket
9. ADAPT plan dynamically (e.g. low response rates → trigger OutreachAgent strategy revision)
```

**State management:** LangGraph maintains a persistent state graph for each active hiring requisition. State includes: current pipeline stage, all sub-agent outputs, human approval decisions, and a complete reasoning trace. State is checkpointed to PostgreSQL every 60 seconds and on every human approval event, enabling full replay for audit purposes.

**Failure handling:** Each sub-agent has a maximum retry count (default: 3) with exponential backoff. If a sub-agent fails after retries, the orchestrator escalates to the recruiter with a specific, actionable error description — it never silently fails or produces a degraded output without flagging it.

### 5.2 LLM Selection & Routing

HOGH uses a **multi-model routing strategy** — different LLMs for different task types based on cost, latency, and capability requirements:

| Task Category | Model | Rationale |
|---|---|---|
| Candidate Intelligence Brief synthesis | GPT-4o | Highest narrative quality; long-context synthesis across multiple sources |
| Opportunity Intelligence Brief synthesis | GPT-4o | Same — nuanced company culture synthesis requires depth |
| Outreach message generation | GPT-4o-mini | Cost-efficient; high volume; quality monitored via A/B response rate data |
| Resume tailoring | Claude 3.5 Sonnet | Strong instruction-following; better at preserving user voice while adapting content |
| Compliance-sensitive reasoning (bias monitor, DSAR, explainability) | Claude 3.5 Sonnet | Constitutional AI training makes it more reliable for fairness-sensitive outputs |
| Classification tasks (skill extraction, JD parsing) | Fine-tuned GPT-4o-mini | Low latency, high volume; fine-tuned on ESCO/O*NET taxonomy |
| NegotiationCoach™ if-then scenario reasoning | GPT-4o | Game-theoretic reasoning quality is critical here |
| Structured data extraction (form fill, ATS parsing) | GPT-4o-mini | Fast, cheap, well-suited to extraction tasks |

**LLM API abstraction:** All LLM calls are routed through an internal `llm-gateway` service that handles: model routing decisions, retry logic with fallback models (e.g. if GPT-4o is unavailable, route to Claude 3.5 Sonnet), prompt versioning and A/B testing, cost tracking per tenant, and response caching for identical prompts.

### 5.3 Prompt Architecture

All prompts are managed as versioned, parameterised templates stored in the `prompt-registry` service. This enables:
- A/B testing of prompt variants with statistical significance tracking
- Rollback to previous prompt versions if a new version degrades output quality
- Per-customer prompt customisation (e.g. an enterprise customer can configure the IntelligenceAgent to emphasise technical depth over communication style)
- Full audit trail of which prompt version generated which output

**Prompt structure for all synthesis tasks:**

```
[SYSTEM PROMPT]
Role definition + output format specification + quality standards + 
compliance guardrails (what NOT to include) + tone guidelines

[CONTEXT BLOCK — RAG-retrieved]
Relevant data retrieved from Talent Intelligence Graph and external sources,
ranked by relevance score, truncated to context window limit

[TASK PROMPT]
Specific synthesis instruction with explicit output schema

[EXAMPLES BLOCK — few-shot]
2–3 high-quality examples of the desired output format,
drawn from the platform's curated example library

[USER DATA BLOCK]
Candidate/company/role specific data for this particular synthesis task
```

### 5.4 RAG Pipeline

The Retrieval-Augmented Generation pipeline is the primary mechanism by which agents access the Talent Intelligence Graph and external data during brief synthesis.

**Pipeline stages:**

```
1. QUERY CONSTRUCTION
   LLM generates 3–5 semantic search queries from the task context
   (e.g. for a candidate brief: queries for skills, role history, public writing)

2. MULTI-SOURCE RETRIEVAL (parallel)
   → Talent Intelligence Graph (Neo4j): career trajectories, skill relationships
   → Vector store (Pinecone): semantic search over candidate data chunks
   → Web search (Bing API / Serper): recent news, publications, talks
   → External APIs: compensation data, Glassdoor, Crunchbase

3. RE-RANKING
   Cross-encoder model re-ranks retrieved chunks by relevance to the task
   Duplicate and low-confidence chunks filtered out

4. CONTEXT ASSEMBLY
   Top-N chunks assembled into context block, respecting token budget
   Source provenance metadata attached to each chunk

5. GENERATION
   LLM synthesises context + task prompt → structured output
   Output validated against output schema (Pydantic models)

6. PROVENANCE ATTACHMENT
   Every claim in the output linked back to its source chunk
   Displayed in the UI as inline citations recruiters/candidates can inspect
```

### 5.5 Human Handoff Protocol™ — Technical Implementation

The Human Handoff Protocol is enforced at the infrastructure level, not just in application logic. It cannot be bypassed by a bug in agent code.

**Implementation:**

- Each pipeline stage is modelled as a state in LangGraph's state machine
- States designated as "human required" are implemented as **blocking async checkpoints** — the orchestrator writes a `PENDING_HUMAN_APPROVAL` event to Kafka and halts that pipeline branch
- A notification is pushed to the recruiter dashboard
- The recruiter's approval (or rejection + revision instruction) is received via the `recruiter-service` REST API and triggers a `HUMAN_APPROVED` or `HUMAN_REJECTED` event on Kafka
- The orchestrator resumes only upon receiving the approval event
- The entire sequence — checkpoint creation, notification sent, human response, resumption — is written atomically to the immutable audit log
- **Hard constraint:** the `offer-service` has a database-level constraint that prevents an offer letter from being generated unless the associated `offer_approval_id` references a confirmed human approval record in the audit log. This constraint exists in the database itself — not just application code.

---

## 6. Data Architecture

### 6.1 Primary Database — PostgreSQL

Used for all transactional, relational data:
- User accounts, authentication, permissions
- Requisitions, applications, pipeline stage history
- Agent task logs and orchestrator state checkpoints
- Offer records, approval workflows, contract metadata
- Immutable audit log (append-only table; row-level deletion disabled at DB user privilege level)

**Schema design principles:**
- Soft deletes only (is_deleted flag) — hard deletes only via DSAR processing, which is logged separately
- All tables include `created_at`, `updated_at`, `created_by_agent` (or `created_by_user_id`) for full provenance
- Row-level security (RLS) enabled for multi-tenant isolation — each enterprise customer's data is logically isolated at the database query level, not just application level

### 6.2 Vector Database — Pinecone

Used for semantic similarity search:
- Candidate profile embeddings (text-embedding-3-large, 3072 dimensions)
- Job description embeddings for semantic role matching
- Talent Intelligence Graph node embeddings for GNN-augmented search
- Opportunity Intelligence Brief source chunks (Glassdoor, news articles, LinkedIn posts)

**Namespace strategy:** Each enterprise customer gets a dedicated Pinecone namespace. Consumer job seeker data is in a separate namespace. This provides logical isolation and allows per-customer index management.

**Embedding pipeline:**
- New data ingested → chunked (512-token chunks with 50-token overlap) → embedded via OpenAI text-embedding-3-large → upserted to Pinecone with metadata (source, timestamp, entity_id, data_type)
- Embeddings refreshed on significant profile changes (new role added, new skills added) — not on every update

### 6.3 Graph Database — Neo4j (Talent Intelligence Graph™)

The Talent Intelligence Graph is the core proprietary data asset of the HOGH platform. It is a persistent, continuously-updated knowledge graph connecting:

**Node types:**
- `Skill` — 50,000+ skills from ESCO v1.1, O*NET 28.0, and custom taxonomy extensions
- `Role` — 10,000+ job title archetypes with associated skill distributions
- `Candidate` — anonymised professional profiles (no PII in graph; linked to PostgreSQL record via encrypted ID)
- `Company` — employer profiles with culture signals, historical hiring patterns, comp distributions
- `MarketSignal` — time-series nodes for salary benchmarks, skill demand curves, scarcity indices
- `CareerOutcome` — post-hire performance and retention signals (anonymised, aggregated)

**Relationship types:**
- `REQUIRES (Role → Skill, weight: importance_score)`
- `HAS_SKILL (Candidate → Skill, weight: proficiency, evidence_count)`
- `WORKED_AT (Candidate → Company, properties: start, end, title)`
- `PRECEDED_BY (Role → Role, weight: transition_frequency)` — models common career paths
- `BENCHMARK (Role → MarketSignal, properties: percentile_25, median, percentile_75)`
- `LED_TO (CareerOutcome → Role)` — connects post-hire outcomes back to the roles they originated from

**GNN training pipeline:**
- Graph Neural Network (GraphSAGE architecture) trained on historical career trajectory and placement outcome data
- Node embeddings updated nightly via batch training job on AWS SageMaker
- Model output: match score between any (Candidate, Role) pair, incorporating graph neighbourhood context (not just direct skill overlap)
- Training data: anonymised, aggregated — no individual PII used in model training

### 6.4 Caching Strategy — Redis

- Session data and JWT token metadata: TTL 24 hours
- LLM response caching: identical prompt + context combinations cached for 7 days (significant cost reduction for repeated brief generation on the same candidate)
- Agent task status: real-time status cache for WebSocket delivery, TTL 5 minutes
- Rate limiting counters: per-user and per-tenant API rate limit state
- Outreach message deduplication: prevents the same candidate being contacted twice within a configurable window

### 6.5 Data Warehouse — AWS S3 + Athena

- All application events streamed from Kafka to S3 via Kinesis Firehose (Parquet format, partitioned by tenant + date)
- Queried via AWS Athena for analytics, CHRO reporting, and model training data preparation
- Separate cold storage bucket for audit log archives — versioned, MFA-delete protected, 7-year retention

---

## 7. Infrastructure & DevOps

### 7.1 Cloud Architecture

**Primary region:** AWS us-east-1 (Year 1)
**EU expansion:** AWS eu-west-1 (Dublin) added in Year 2 for GDPR data residency compliance
**APAC expansion:** AWS ap-southeast-1 (Singapore) added in Year 3

**Compute:**
- Application services: AWS EKS (Kubernetes) — containerised microservices with Helm charts
- AI/ML workloads: mixture of EKS GPU node pools (g5 instances) for inference and AWS SageMaker for model training
- Serverless: AWS Lambda for low-frequency event handlers (webhook receivers, DSAR processing, scheduled compliance reports)
- Database: AWS RDS Aurora PostgreSQL (Multi-AZ), AWS ElastiCache Redis (cluster mode)

**Kubernetes cluster design:**
- Separate node pools for: web services (CPU-optimised), AI inference (GPU), data processing (memory-optimised)
- Horizontal Pod Autoscaler on all services — agent workloads scale to zero during off-hours
- Cluster Autoscaler for node-level scaling during peak demand (e.g. Monday morning surge when recruiters start their week)

### 7.2 CI/CD Pipeline

```
Developer pushes to feature branch
         │
         ▼
GitHub Actions: lint + unit tests + type checking (< 3 min)
         │
         ▼
Pull Request: automated code review (CodeRabbit AI) + manual review required
         │
         ▼
Merge to main: integration tests + contract tests (Pact) (< 10 min)
         │
         ▼
Staging deploy (automatic): E2E tests (Playwright) + load tests (k6)
         │
         ▼
Production deploy (manual approval gate for infrastructure changes,
                   automatic for application-only changes)
         │
         ▼
Post-deploy: smoke tests + canary traffic (10% → 50% → 100% over 20 min)
             Automatic rollback if error rate > 1% on canary
```

**Feature flags:** LaunchDarkly used for all new feature releases. Agent capabilities released behind flags to individual enterprise customers for gradual rollout and A/B testing. NegotiationCoach™ is flag-gated per enterprise customer.

### 7.3 Observability Stack

| Signal | Tool | Key Dashboards |
|---|---|---|
| Metrics | Prometheus + Grafana | Agent task throughput, LLM API latency/cost, pipeline stage durations, error rates |
| Logs | AWS CloudWatch + OpenSearch | Structured JSON logs from all services; full-text search; 90-day hot retention |
| Traces | AWS X-Ray | Distributed traces across microservices; critical for debugging multi-agent workflows |
| Errors | Sentry | Real-time error alerting, stack traces, user context, release tracking |
| LLM observability | Langfuse (self-hosted) | Prompt version performance, token costs, model latency, output quality scores |
| Uptime | PagerDuty | On-call rotation, SLA monitoring, incident management |

**SLO targets (Year 1):**
- API availability: 99.9% (< 8.7 hours downtime/year)
- Agent task completion (p95): < 45 minutes for a full Candidate Intelligence Brief
- Dashboard load time (p95): < 2 seconds
- NegotiationCoach™ advisory latency (p95): < 800ms (must feel real-time during live conversation)

### 7.4 Cost Optimisation

LLM API costs are the largest variable cost item and require active management:

- **Response caching:** Redis cache on identical (prompt, context) pairs — estimated 30–40% reduction in API calls for common operations like re-running briefs on unchanged candidate data
- **Model routing:** GPT-4o-mini for all classification and extraction tasks (10–20× cheaper than GPT-4o with equivalent quality for these task types)
- **Batching:** non-urgent tasks (retention pulse analysis, background skill graph updates) batched and run during off-peak hours at lower API priority pricing
- **Context compression:** RAG pipeline truncates retrieved context to minimum necessary tokens before LLM call; summarisation of long documents before embedding
- **Fine-tuning roadmap:** Year 2 investment in fine-tuning GPT-4o-mini on HOGH-specific skill extraction and matching tasks, targeting 60% reduction in dependency on base GPT-4o for these workloads

---

## 8. Security, Privacy & Compliance Engineering

### 8.1 Authentication & Authorisation

- **Authentication:** AWS Cognito for consumer users; enterprise SSO via SAML 2.0 / OIDC (Okta, Azure AD, Google Workspace). MFA required for all enterprise users.
- **Authorisation:** Role-Based Access Control (RBAC) enforced at the API gateway and service level. Roles: `recruiter`, `hiring_manager`, `hr_admin`, `compliance_officer`, `candidate`
- **API security:** all external API calls authenticated with short-lived JWTs (15-minute TTL) + refresh token rotation. Internal service-to-service calls use mTLS with service mesh (AWS App Mesh)
- **Secret management:** all API keys, database credentials, and LLM API keys stored in AWS Secrets Manager with automatic rotation

### 8.2 Data Privacy Architecture

- **Data classification:** all data classified at ingestion as `PII`, `SENSITIVE`, `BUSINESS_CONFIDENTIAL`, or `PUBLIC`. Classification drives encryption, retention, and access control policies.
- **Encryption:** AES-256 at rest (AWS KMS customer-managed keys per enterprise tenant); TLS 1.3 in transit; field-level encryption for highest-sensitivity fields (SSN if collected, bank account details for payroll integrations)
- **Data residency:** enterprise customers in the EU are provisioned on the eu-west-1 region with contractual guarantee of no data transfer to US regions. Enforced at the tenant configuration layer.
- **Candidate data transparency:** every candidate can request a full export of all data HOGH holds about them (DSAR), and can request deletion. Deletion cascades across PostgreSQL, Pinecone (vector deletion by metadata filter), and triggers a graph node anonymisation in Neo4j (PII fields cleared; relationship structure preserved for model training in aggregate-only form).
- **Data minimisation:** IntelligenceAgent is architecturally constrained to only process publicly available data. No access to private social media, private repositories, or data obtained through platform ToS-violating methods. API integrations (LinkedIn Talent Solutions, GitHub) use official OAuth flows with explicit user consent.

### 8.3 Bias & Fairness Architecture

The bias architecture is implemented as a cross-cutting concern — it intercepts agent outputs at multiple points in the pipeline, not just at the final decision.

**Bias Monitor implementation:**
- A dedicated `bias-monitor` sidecar container runs alongside the `agent-orchestrator`
- At each defined check-point, the bias monitor receives the current candidate shortlist or ranking
- It runs a **disparate impact test** (80% rule / four-fifths rule) across gender, age group, and ethnicity — using proxy signals where direct demographic data is unavailable (names, educational institutions, graduation years)
- If the shortlist fails the test, the pipeline is paused and a `BIAS_FLAG` event is written to the audit log
- The recruiter receives an explainability report: which features are driving the demographic imbalance, and a revised shortlist with corrective re-ranking applied
- **Threshold configuration:** enterprise HR Ops can configure the strictness of the disparate impact threshold within EEOC-compliant bounds — but cannot disable the monitor entirely

**SHAP explainability:**
- Every candidate's match score is accompanied by a SHAP (SHapley Additive exPlanations) value breakdown showing which features contributed to the score and by how much
- Displayed in the recruiter dashboard as a human-readable explanation: "This candidate's strong Python evidence (4.2 pts), startup background (2.1 pts), and inferred growth motivation (1.8 pts) drove the high match score. Lower contribution from team leadership experience (-1.1 pts)."

### 8.4 EU AI Act Compliance Roadmap

HOGH's recruitment agents fall under the EU AI Act's **Annex III, Category 4** — AI systems used for recruitment and employment decisions — classified as **high-risk AI systems**. Compliance requirements and implementation timeline:

| Requirement | Implementation | Target Date |
|---|---|---|
| Technical documentation | Architecture documentation, model cards for all AI components, training data documentation | Month 6 |
| Data governance | Training data audit, bias analysis, data provenance records | Month 9 |
| Human oversight measures | Human Handoff Protocol™ technical documentation + audit evidence | Month 12 |
| Accuracy, robustness & cybersecurity | Adversarial testing, model drift monitoring, red team exercises | Month 18 |
| Transparency to affected persons | Candidate notification system, data usage disclosure, opt-out mechanism | Month 6 |
| Conformity assessment (formal) | Engagement with Notified Body; full technical file submission | Month 24 |
| CE Marking / EU market deployment | Target full conformity certification | Month 30 |

---

## 9. Integrations & API Layer

### 9.1 ATS Integrations

All ATS integrations use a **bidirectional sync architecture** — HOGH reads candidate and requisition data from the ATS, enriches it with agent intelligence, and writes back structured data (candidate profiles, interview notes, offer records) to keep the ATS as the system of record for enterprise HR teams.

| ATS | Integration Method | Data Synced | Phase |
|---|---|---|---|
| **Greenhouse** | Official REST API + webhooks | Requisitions, candidates, stages, interview kits, offer data | Phase 1 (Q4) |
| **Lever** | Official REST API + webhooks | Jobs, opportunities, feedback, offers | Phase 2 (Q6) |
| **Workday Recruiting** | Workday REST API (OAuth 2.0) | Job requisitions, candidate records, offer approvals | Phase 2 (Q8) |
| **SAP SuccessFactors** | OData API + integration middleware | Job postings, application data, offer management | Phase 2 (Q8) |
| **Ashby** | REST API | Requisitions, candidates, pipeline stages | Phase 3 |

**Integration architecture:**
- Each ATS integration is implemented as a separate `connector` microservice with its own schema mapping layer
- A central `integration-hub` service manages authentication token refresh, rate limit compliance, and sync scheduling
- Conflict resolution: ATS is always the system of record for HR compliance data; HOGH is the system of record for AI-generated intelligence data. No HOGH data overwrites ATS data without explicit recruiter confirmation.

### 9.2 HRIS Integrations

| HRIS | Data Used | Purpose |
|---|---|---|
| **Workday HCM** | Employee records, org structure, compensation bands | TalentAgent™ uses active comp bands to constrain OfferAgent recommendations; RetentionAgent reads employee tenure and performance data (with HR admin permission) |
| **SAP SuccessFactors HCM** | Same as above | Same as above |
| **BambooHR** | Employee lifecycle events | RetentionAgent flight risk signals |

### 9.3 Calendar Integrations

- **Google Calendar API** (OAuth 2.0): read/write access to recruiter and candidate calendars for interview scheduling; free/busy queries for availability negotiation
- **Microsoft Graph API** (Outlook Calendar): same as above for Microsoft 365 enterprise environments
- **Calendly API**: fallback scheduling via Calendly for candidates who prefer not to share direct calendar access

### 9.4 Communication Integrations

- **Zoom API**: automated meeting creation for HOGH-hosted video interviews; webhook for meeting completion events that trigger DebriefAgent
- **Microsoft Teams API**: same for Teams-first enterprise customers
- **SendGrid API**: transactional email delivery (interview confirmations, brief delivery, offer letters)
- **Twilio**: SMS notifications for interview reminders (opt-in only)

### 9.5 External Data Sources

| Source | Data Type | Access Method | Legal Basis |
|---|---|---|---|
| **LinkedIn Talent Solutions API** | Professional profiles, job postings | Official partner API (OAuth) | LinkedIn partnership agreement |
| **GitHub REST API** | Public repos, contribution history, profile data | Official API with rate limit compliance | Public data; GitHub ToS compliant |
| **Glassdoor Partner API** | Company reviews, salary data, interview reviews | Official partner API | Glassdoor data partnership |
| **Crunchbase Basic API** | Company funding, headcount, news | Official API | Licensed data |
| **Levels.fyi data** | Compensation benchmarks (tech roles) | Data licensing agreement | Licensed data |
| **Bing Web Search API** | Recent news, publications, public writing | Official Microsoft API | Public web; robots.txt compliant |
| **Bureau of Labor Statistics** | Occupational employment and wage statistics | Public API | US Government open data |

### 9.6 HOGH Public API

The Talent Intelligence API exposes a subset of HOGH's intelligence capabilities to third-party developers and enterprise HR platforms:

**Key endpoints:**

```
POST /v1/match
  Body: { candidate_profile, job_description }
  Returns: { match_score, feature_breakdown, recommended_questions }

POST /v1/skill-graph/query
  Body: { skills[], target_role }
  Returns: { gap_analysis, adjacent_skills, learning_pathways }

GET /v1/benchmarks/compensation
  Query: role, location, seniority, skills[]
  Returns: { p25, median, p75, p90, trend_direction }

POST /v1/intelligence/candidate-brief
  Body: { candidate_data, role_context }
  Returns: { brief: CandidateIntelligenceBrief }
  (Enterprise tier only; data processed under caller's data processing agreement)
```

**API authentication:** API key authentication for basic tier; OAuth 2.0 client credentials for enterprise tier. Rate limits: 100 req/min (basic), 1,000 req/min (enterprise). All API usage logged for billing and audit purposes.

---

## 10. Engineering Milestones & Build Sequence

### Year 1 — Foundation Build

The build sequence is delibera