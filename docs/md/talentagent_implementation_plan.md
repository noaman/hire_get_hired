# TalentAgent™ — Recruiter Platform
## Execution & Implementation Plan
### HireOrGetHired (HOGH) | Version 1.0 | March 2026 | Confidential

---

## Document Purpose

This document is the engineering and product execution plan for the **TalentAgent™** — the recruiter/HR side of the HireOrGetHired platform. It is structured for development scoping, vendor selection, cost modelling, and sprint planning. Each module defines the feature in detail, the AI agents required (with their tasks, tools, and LLM models), the integrations needed, the technical components to build, and cost and complexity drivers.

---

## Table of Contents

1. [Platform Overview & Architecture Context](#1-platform-overview--architecture-context)
2. [Module 1 — Requisition Intelligence](#2-module-1--requisition-intelligence)
3. [Module 2 — Candidate Sourcing (RadarAgent)](#3-module-2--candidate-sourcing-radaragent)
4. [Module 3 — Candidate Intelligence Brief™ (IntelligenceAgent)](#4-module-3--candidate-intelligence-brief-intelligenceagent)
5. [Module 4 — Outreach & Scheduling (OutreachAgent + SchedulerAgent)](#5-module-4--outreach--scheduling-outreachagent--scheduleragent)
6. [Module 5 — Screen & Assessment (ScreenAgent)](#6-module-5--screen--assessment-screenagent)
7. [Module 6 — Interview Orchestration](#7-module-6--interview-orchestration)
8. [Module 7 — Offer Management (OfferAgent)](#8-module-7--offer-management-offeragent)
9. [Module 8 — Analytics & Reporting](#9-module-8--analytics--reporting)
10. [Module 9 — NegotiationCoach™ Live Session (Recruiter Side)](#10-module-9--negotiationcoach-live-session-recruiter-side)
11. [Module 10 — Compliance & Bias Architecture](#11-module-10--compliance--bias-architecture)
12. [Module 11 — HOGH Admin Console & Multi-Tenant Architecture](#12-module-11--hogh-admin-console--multi-tenant-architecture)
13. [Cross-Cutting Infrastructure](#13-cross-cutting-infrastructure)
14. [Integration Registry — Full List](#14-integration-registry--full-list)
15. [AI Agent Registry — Full List](#15-ai-agent-registry--full-list)
16. [Build Complexity & Cost Matrix](#16-build-complexity--cost-matrix)
17. [Development Roles Required](#17-development-roles-required)
18. [Phase-by-Phase Delivery Plan](#18-phase-by-phase-delivery-plan)

---

## 1. Platform Overview & Architecture Context

### What TalentAgent™ Is

TalentAgent™ is the recruiter's persistent AI orchestration layer. It sits above their existing ATS (Greenhouse, Lever, Workday), connects to it via bidirectional API sync, and enriches every step of the hiring pipeline with agentic intelligence. It is not an ATS replacement — it is the intelligence and automation layer that makes the ATS exponentially more useful.

### Core Architectural Decisions (Relevant to Recruiter Build)

| Concern | Decision | Implication for Build |
|---|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS + Radix UI | Custom design system; accessible component library |
| State Management | Zustand | Lightweight; handles agent state streams and pipeline updates |
| Real-time | WebSocket (AWS API Gateway) | Live agent progress, pipeline changes, NegotiationCoach™ prompts |
| Charting | Recharts (pipeline analytics) + D3.js (Talent Intelligence Graph) | Two separate charting libraries required |
| Auth | AWS Cognito + SAML 2.0/OIDC (Okta, Azure AD, Google Workspace) | Enterprise SSO is mandatory for recruiter product |
| Agent Orchestration | LangGraph (Python + FastAPI) | All agents are LangGraph state machines |
| ATS Integration | Bidirectional sync via connector microservices | ATS is always the system of record for HR compliance data |
| Multi-tenancy | Row-level security (PostgreSQL RLS) + per-tenant Pinecone namespaces | Strict enterprise data isolation |
| Compliance | Immutable audit log (PostgreSQL append-only) + database-level offer constraints | Cannot be bypassed at application layer |
| Human Handoff | Blocking async checkpoints in LangGraph — infrastructure-enforced | No agent action bypasses human approval at defined gates |

---

## 2. Module 1 — Requisition Intelligence

### 2.1 Feature Description

Recruiter describes a role conversationally in natural language. The system generates a structured job description, extracts skill requirements mapped to ESCO/O*NET taxonomy, benchmarks the compensation range against the Talent Intelligence Graph, and scores the requisition's "health" — flagging unrealistic requirements, seniority/comp mismatches, and suggesting adjustments. The requisition routes through a configured human approval chain before sourcing begins.

**User-facing outputs:**
- Structured JD generated from conversational description (editable)
- Required skills listed with ESCO/O*NET taxonomy IDs
- Comp benchmark widget: p25/median/p75/p90 for this role in this geography
- Requisition health score: green/amber/red with specific issue callouts
- Approval workflow: route to hiring manager → HR Ops → approved/rejected
- Approved requisition synced back to ATS

---

### 2.2 AI Agents Required

#### Agent 1.1 — `RequisitionIntelligenceAgent`

| Property | Detail |
|---|---|
| **Role** | Generates structured JD from natural language input; benchmarks comp; scores requisition health |
| **Trigger** | Recruiter initiates new requisition via conversational input in dashboard |
| **LLM Model** | GPT-4o (high-quality JD generation; nuanced requirement extraction) |
| **Orchestration** | LangGraph conversational state machine; pauses at approval gate |

**Tasks:**

**JD Generation:**
1. Receive natural language role description from recruiter (conversational input)
2. Extract structured fields: role title, seniority level, team, location, remote policy, key responsibilities, required skills, preferred skills, years of experience, education requirements
3. Map extracted skills to ESCO/O*NET canonical IDs using `skills_taxonomy_lookup_tool`
4. Generate formatted, well-structured JD in the recruiter's configured tone and style (enterprise customers can configure house style via prompt customisation)
5. Return to recruiter for review and edit before proceeding

**Comp Benchmarking:**
1. Query Neo4j Talent Intelligence Graph: `BENCHMARK (Role → MarketSignal)` for this role + geography + seniority (p25/median/p75/p90)
2. Query Levels.fyi data if tech role: total comp breakdown
3. Query Bureau of Labor Statistics API: occupational wage statistics
4. Cross-reference with company's own comp band data (from Workday HCM integration if available)
5. Display benchmark inline in JD editor; flag if proposed comp is below market median

**Requisition Health Scoring:**
1. Analyse skill requirements list: flag if requirements are contradictory, unrealistic for stated seniority, or commonly listed as "nice to have" for this role type
2. Check supply signal: query Neo4j for skill scarcity index for required skills in this geography — flag if combination is rare
3. Check comp vs. seniority: if comp is below market p25 for stated seniority level, flag as health risk
4. Generate health report: overall score (0–100), specific issues with suggested fixes
5. Return actionable suggestions: e.g., "Requiring 10+ years in Rust for a mid-level role will reduce your candidate pool by 94%. Suggest: 3+ years with demonstrated expertise."

**Approval Workflow:**
1. On recruiter approval of draft JD: create `PENDING_HUMAN_APPROVAL` checkpoint in LangGraph
2. Route approval notification to hiring manager (email via SES + in-app notification)
3. Hiring manager approves/rejects/requests changes via HOGH or linked ATS
4. If approved: write `HUMAN_APPROVED` event to Kafka; log to audit; proceed to sourcing
5. If rejected: return to recruiter with feedback; loop until approved
6. On final approval: sync approved requisition to ATS (Greenhouse/Lever/Workday) via connector

**Tools:**
- `conversational_jd_generator_tool` — GPT-4o call with JD generation prompt
- `skills_taxonomy_lookup_tool` — ESCO/O*NET mapping via Neo4j lookup
- `neo4j_comp_benchmark_tool` — salary percentile query from Talent Intelligence Graph
- `levelsfyi_comp_tool` — Levels.fyi licensed data
- `bls_api_tool` — Bureau of Labor Statistics public API
- `workday_comp_band_tool` — queries company's active comp bands from Workday HCM (if integrated)
- `requisition_health_scorer_tool` — structured analysis returning health score and issues
- `approval_workflow_tool` — creates LangGraph blocking checkpoint; sends notifications
- `ats_sync_tool` — pushes approved requisition to ATS via connector microservice

---

### 2.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **OpenAI API** (GPT-4o) | JD generation, health analysis | API Key | Phase 1 |
| **Neo4j** | Comp benchmarks, skill supply signals | Bolt driver | Phase 1 |
| **Levels.fyi** | Tech comp benchmarks | Data license | Phase 2 |
| **Bureau of Labor Statistics API** | Wage statistics | Public API | Phase 1 |
| **Workday HCM** | Active comp bands | Workday REST API (OAuth 2.0) | Phase 2 |
| **Greenhouse REST API** | Sync approved requisition to ATS | REST + webhooks | Phase 1 |
| **Lever REST API** | Sync approved requisition | REST + webhooks | Phase 2 |
| **AWS SES** | Approval notification emails | AWS SDK | Phase 1 |

---

### 2.4 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Conversational JD builder UI | Frontend | React 18 + Zustand | Chat-like input + structured JD preview side by side |
| JD editor | Frontend | React 18 + TipTap | Rich text editor; inline comp benchmark widget |
| Comp benchmark widget | Frontend | React 18 + Recharts | Percentile bar chart; p25/median/p75/p90 display |
| Requisition health report UI | Frontend | React 18 | Score gauge; issue list with fix suggestions |
| Approval workflow UI | Frontend | React 18 | Approval chain status; approve/reject/comment actions |
| Requisition database schema | Database | PostgreSQL | Requisitions, approval records, skill requirements |
| ATS connector framework | Backend microservice | Node.js | Generic connector interface; Greenhouse connector first |
| `integration-hub` service | Backend microservice | Node.js | Token refresh, rate limit compliance, sync scheduling |

---

### 2.5 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| RequisitionIntelligenceAgent | High | 3 weeks (1 AI/ML engineer) |
| Conversational JD builder UI | Medium | 2 weeks (1 FE engineer) |
| Comp benchmark integration | Medium | 1 week (1 backend engineer) |
| Approval workflow (LangGraph + Kafka) | High | 2 weeks (1 backend engineer) |
| Greenhouse ATS connector | High | 2 weeks (1 backend engineer) |

---

## 3. Module 2 — Candidate Sourcing (RadarAgent)

### 3.1 Feature Description

RadarAgent discovers candidates across multiple sources — LinkedIn (official API), GitHub, Stack Overflow, internal ATS talent pools, and referral networks. It scores candidates on multiple dimensions (skills match, trajectory alignment, motivation fit, cultural signals) weighted by recruiter priorities. It identifies passive candidates whose public activity signals a potential openness to a move. It delivers a ranked shortlist to the recruiter for approval before any outreach begins.

**User-facing outputs:**
- Ranked candidate shortlist with multi-dimensional fit score breakdown
- Passive candidate signals surface with evidence (e.g., "Added 3 new skills in last 30 days; following your company page")
- Source attribution for each candidate: how they were found
- Shortlist approval interface: recruiter approves/rejects each candidate before outreach
- Exclusion controls: previously contacted, declined, or blocked candidates filtered automatically

---

### 3.2 AI Agents Required

#### Agent 2.1 — `RadarAgent`

| Property | Detail |
|---|---|
| **Role** | Multi-source candidate discovery, fit scoring, passive signal detection, shortlist generation |
| **Trigger** | Approved requisition enters sourcing phase; also runs on schedule (daily refresh) |
| **LLM Model** | Fine-tuned GPT-4o-mini (profile parsing, skill extraction); GPT-4o (motivation and culture signal synthesis) |
| **Orchestration** | LangGraph pipeline with parallel multi-source discovery sub-tasks |

**Tasks:**

**Multi-Source Discovery:**
1. Query LinkedIn Talent Solutions API: boolean skill + location + seniority search
2. Query GitHub API: search users by language expertise, contribution frequency, public activity signals
3. Query Stack Overflow API: users with high reputation scores in required skill tags
4. Query internal ATS talent pool: re-surface previously assessed candidates with suitable profiles
5. Query referral network: flag any connections referred by current employees (via email domain matching)
6. Deduplicate across sources: same person found on LinkedIn + GitHub → merge into single candidate record

**Candidate Profiling & Skill Extraction:**
1. For each discovered candidate: extract structured profile data (skills, role history, education, location)
2. Map skills to ESCO/O*NET taxonomy
3. Embed candidate profile into Pinecone (user namespace or enterprise namespace)
4. Upsert/update Candidate node in Neo4j Talent Intelligence Graph

**Multi-Dimensional Fit Scoring:**
1. Compute semantic similarity score: Pinecone cosine similarity between candidate embedding and JD embedding
2. Compute GNN graph match score: GraphSAGE model — queries SageMaker endpoint — incorporates career trajectory context from Neo4j
3. Compute trajectory alignment score: does candidate's career path suggest they're heading toward this role type?
4. Infer motivation fit: use GPT-4o to analyse public writing (GitHub READMEs, Stack Overflow answers, LinkedIn posts) for motivation signals — growth, autonomy, compensation, mission, stability
5. Compute weighted composite score based on recruiter-configured weights per dimension
6. Rank shortlist by composite score

**Passive Candidate Signal Detection:**
1. Monitor LinkedIn API signals: recent skill additions, company page follow activity
2. Monitor GitHub signals: recent increase in public commit frequency, new repo creation in relevant tech stack
3. Monitor Stack Overflow: recent increase in activity in relevant technology tags
4. Flag candidates with 2+ passive signals as "potentially open to conversations"
5. Surface signal evidence to recruiter: specific, verifiable signals (not vague inferences)

**Shortlist Generation & Human Approval Gate:**
1. Compile ranked shortlist of top-N candidates (default: 20; configurable)
2. Present to recruiter with full fit score breakdown and evidence per dimension
3. Create `PENDING_HUMAN_APPROVAL` checkpoint (Human Handoff Protocol)
4. Recruiter approves individual candidates for outreach, rejects others, or requests more candidates
5. Approved candidates enter outreach queue; rejected candidates logged (with reason, if given) to audit log

**Tools:**
- `linkedin_talent_api_tool` — LinkedIn Talent Solutions search API
- `github_user_search_tool` — GitHub REST API: search users by language, topic, activity
- `stackoverflow_user_tool` — Stack Exchange API: users by tag reputation
- `ats_talent_pool_tool` — internal ATS sync: re-surface past candidates
- `referral_match_tool` — email domain matching against company employee list
- `profile_dedup_tool` — cross-source entity resolution (Redis-backed seen-profiles cache)
- `skills_taxonomy_lookup_tool` — ESCO/O*NET mapping
- `pinecone_candidate_upsert_tool` — embed + upsert candidate profile to Pinecone
- `neo4j_candidate_upsert_tool` — upsert Candidate node and skill/career edges to Neo4j
- `pinecone_semantic_match_tool` — cosine similarity match against JD embedding
- `neo4j_gnn_match_tool` — GraphSAGE SageMaker inference endpoint
- `motivation_inference_tool` — GPT-4o call: analyse public writing for motivation signals
- `passive_signal_detector_tool` — rule-based + ML classifier on platform activity signals
- `shortlist_approval_tool` — creates LangGraph blocking checkpoint; sends recruiter notification

---

### 3.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **LinkedIn Talent Solutions API** | Candidate search and profile data | OAuth (partner agreement) | Phase 1 |
| **GitHub REST API** | Developer profile and activity data | OAuth 2.0 / API Key | Phase 1 |
| **Stack Exchange API** | Technical reputation signals | API Key | Phase 2 |
| **Greenhouse REST API** | ATS talent pool data | REST + webhooks | Phase 1 |
| **Lever REST API** | ATS talent pool data | REST + webhooks | Phase 2 |
| **Pinecone** | Candidate embedding storage and semantic search | API Key | Phase 1 |
| **Neo4j** | Talent Intelligence Graph — candidate graph, GNN match | Bolt driver | Phase 1 |
| **AWS SageMaker** | GraphSAGE GNN inference | AWS SDK | Phase 2 |
| **Bing Web Search API** | Supplementary candidate public content | Azure API Key | Phase 1 |

---

### 3.4 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Shortlist UI | Frontend | React 18 | Ranked candidate cards; fit score breakdown; approve/reject controls |
| Passive signal indicators | Frontend | React 18 | Signal badges on candidate cards with evidence on hover |
| Source attribution display | Frontend | React 18 | "Found via: LinkedIn + GitHub" badges |
| Candidate deduplication engine | Backend | Python + Redis | Cross-source entity resolution; fuzzy name + email matching |
| Multi-source crawler scheduler | Backend | Python + AWS EventBridge | Per-requisition scheduled discovery runs |
| Candidate profile database schema | Database | PostgreSQL | Core candidate records; anonymised ID links to Neo4j |

---

### 3.5 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| RadarAgent LangGraph pipeline | Very High | 4 weeks (1 AI/ML engineer) |
| LinkedIn Talent Solutions integration | High | 2 weeks (1 backend engineer) |
| GitHub + Stack Overflow integration | Medium | 1 week (1 backend engineer) |
| Multi-dimensional scoring system | High | 2 weeks (1 AI/ML engineer) |
| Passive signal detection | High | 2 weeks (1 AI/ML engineer) |
| Shortlist approval UI | Medium | 1 week (1 FE engineer) |

---

## 4. Module 3 — Candidate Intelligence Brief™ (IntelligenceAgent)

### 4.1 Feature Description

Automated synthesis of publicly available professional data into a structured narrative brief delivered to the recruiter before every engagement. Every claim in the brief is backed by verifiable evidence and links to its source. Candidates can view what data was used and request corrections (GDPR compliance).

**User-facing outputs:**
- Career arc narrative: LLM-generated professional trajectory analysis
- Skills evidence map: each claimed skill backed by a specific public evidence item
- Motivation inference: likely priorities based on public signals (not assumptions)
- Conversation recommendations: 3–5 specific, personalised interview angles for this candidate + this role
- Verification flags: gaps, rapid tenure changes, inconsistencies surfaced for recruiter attention
- Data provenance panel: every claim links to its source; transparency for candidate access

---

### 4.2 AI Agents Required

#### Agent 3.1 — `IntelligenceAgent`

| Property | Detail |
|---|---|
| **Role** | Master orchestrator for Candidate Intelligence Brief™ generation |
| **Trigger** | Candidate approved for outreach by recruiter (shortlist approval gate passed) |
| **LLM Model** | GPT-4o (deep multi-source synthesis; long-context narrative generation) |
| **Orchestration** | LangGraph pipeline with parallel sub-agent data gathering, followed by synthesis |
| **SLO** | Brief must complete in < 45 minutes p95 |

**Tasks (Master Orchestrator Level):**
1. Receive trigger: (candidate_id, role_id, recruiter_id)
2. Decompose into 4 parallel data-gathering sub-tasks (see below)
3. Await all sub-agent completions (timeout + partial brief fallback if any source fails)
4. RAG pipeline: chunk, embed, retrieve most relevant context from gathered data
5. Synthesise Candidate Intelligence Brief™ using GPT-4o with full structured prompt
6. Validate output against Pydantic schema (all required sections present and populated)
7. Attach data provenance: link every claim to its source chunk
8. Store brief in PostgreSQL linked to candidate + requisition record
9. Push brief to recruiter dashboard via WebSocket notification
10. Run compliance check: verify no protected characteristic information (age, gender, nationality signals) is explicitly used as a decision signal — `bias-monitor` sidecar validates output before delivery

**Sub-tasks:**

---

#### Agent 3.1a — `LinkedInProfileSubAgent`

**Tasks:**
1. Fetch full LinkedIn profile via LinkedIn Talent Solutions API
2. Extract: all roles with tenure, company names, job titles, education, skills, endorsements, summary
3. Parse career arc: identify career pivots, progression pattern (linear/multi-functional/specialist), tenure patterns
4. Identify career gaps: periods > 6 months between roles — flag for recruiter awareness
5. Extract recent activity signals: posts, articles, engagement topics

**Tools:**
- `linkedin_full_profile_fetch_tool` — LinkedIn Talent Solutions API (full profile endpoint)
- `career_arc_parser_tool` — GPT-4o-mini: extracts structured career timeline from LinkedIn data
- `gap_detector_tool` — Python function: identifies tenure gaps in career history
- `linkedin_activity_tool` — LinkedIn API: recent posts and engagement data

---

#### Agent 3.1b — `PublicWorkSubAgent`

**Tasks:**
1. Fetch GitHub: public repos (README, primary language, stars, forks, recent commits), contribution graph, profile bio
2. Fetch GitHub Gists: assess code quality and problem-solving approach
3. Search for publications: academic papers (Google Scholar API), technical blogs (Substack, Medium, Dev.to)
4. Search for talks/presentations: YouTube, Loom, conference archives (SpeakerDeck API)
5. Generate skills evidence map: for each skill claimed on LinkedIn, find a specific public evidence item (GitHub repo, publication, talk) that corroborates it

**Tools:**
- `github_full_profile_tool` — GitHub REST API: repos, contributions, bio, gists
- `google_scholar_tool` — Google Scholar API (unofficial): publication search by author name
- `medium_substack_search_tool` — Bing search filtered to Medium/Substack/Dev.to
- `youtube_speaker_tool` — YouTube Data API v3: search for talks by name
- `speakerdeck_api_tool` — SpeakerDeck public API: presentation search
- `skills_evidence_mapper_tool` — GPT-4o: maps each skill to its best public evidence item

---

#### Agent 3.1c — `MotivationInferenceSubAgent`

**Tasks:**
1. Analyse public writing (LinkedIn articles, GitHub READMEs, blog posts, talks) for expressed priorities
2. Analyse job transition patterns: what types of companies/roles has this person moved toward vs. away from?
3. Classify motivation signals across 5 dimensions: growth, autonomy, compensation, mission, stability
4. Assign confidence score to each inferred motivation (high/medium/low based on volume of evidence)
5. Generate motivation narrative: 2–3 sentences explaining likely priorities with evidence citations

**Tools:**
- `content_sentiment_analyser_tool` — GPT-4o: multi-document sentiment and topic analysis
- `transition_pattern_analyser_tool` — Python function: classifies company types and sizes across career history
- `motivation_classifier_tool` — GPT-4o call with structured motivation classification prompt
- `motivation_confidence_scorer_tool` — scoring function based on evidence volume

---

#### Agent 3.1d — `ConversationAngleSubAgent`

**Tasks:**
1. Cross-reference candidate's profile with the specific role requirements
2. Identify 3–5 high-value interview angles: questions that explore the intersection of candidate's specific experiences and the role's most critical needs
3. Generate at least 1 "verification angle": a question to explore a gap or inconsistency identified in the brief
4. Ensure angles are specific to this candidate — not generic competency questions

**Tools:**
- `profile_role_crossref_tool` — compares candidate profile against JD requirements
- `interview_angle_generator_tool` — GPT-4o call: generates specific, evidence-grounded interview angles

---

### 4.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **LinkedIn Talent Solutions API** | Full candidate profile | OAuth (partner) | Phase 1 |
| **GitHub REST API** | Public repos, contributions, bio | API Key | Phase 1 |
| **Bing Web Search API** | Publications, blog posts, articles | Azure API Key | Phase 1 |
| **YouTube Data API v3** | Talks and presentations | API Key | Phase 2 |
| **SpeakerDeck API** | Conference presentations | Public API | Phase 2 |
| **OpenAI API** (GPT-4o, GPT-4o-mini) | Synthesis, classification | API Key | Phase 1 |
| **Pinecone** | RAG retrieval of candidate data chunks | API Key | Phase 1 |
| **Neo4j** | Career graph, skill evidence map | Bolt driver | Phase 1 |

---

### 4.4 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Candidate Intelligence Brief™ UI | Frontend | React 18 | Tabbed layout: Career Arc / Skills Evidence / Motivation / Conversation Angles / Verification Flags |
| Data provenance panel | Frontend | React 18 | Click any claim → see source; link to original URL |
| Brief generation status stream | Frontend | React 18 + WebSocket | Real-time agent progress display |
| Brief storage schema | Database | PostgreSQL | Brief JSON stored linked to candidate + requisition |
| Bias monitor sidecar | Backend | Python (containerised sidecar) | Runs alongside agent-orchestrator; validates brief output before delivery |
| SHAP explainability renderer | Frontend | React 18 + custom visualisation | Match score breakdown with human-readable SHAP values |
| Candidate data access portal | Frontend | Next.js (candidate-facing) | GDPR: candidates can view their brief data and request corrections |

---

### 4.5 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| IntelligenceAgent master pipeline | Very High | 4 weeks (1 AI/ML engineer) |
| 4 sub-agents | High | 3 weeks (1 AI/ML engineer) |
| Brief UI (tabbed, provenance) | High | 2 weeks (1 FE engineer) |
| Bias monitor sidecar | High | 2 weeks (1 backend engineer) |
| SHAP explainability | High | 2 weeks (1 ML engineer) |

---

## 5. Module 4 — Outreach & Scheduling (OutreachAgent + SchedulerAgent)

### 5.1 Feature Description

OutreachAgent generates a personalised outreach message for each approved candidate — referencing at least two specific, verifiable signals from their public profile. All messages require recruiter review and approval before sending. OutreachAgent learns from response rates using reinforcement learning on response signals, continuously improving message framing and timing. SchedulerAgent handles the full interview scheduling lifecycle: calendar negotiation, confirmation with pre-meeting briefs, and autonomous rescheduling.

**User-facing outputs:**
- Personalised message drafts for each approved candidate (editable before send)
- Send queue with configurable timing (e.g., send Tuesday 9–11am for highest response rates)
- Response rate analytics per message variant
- Calendar availability negotiation status per candidate
- Interview confirmation with context-rich pre-meeting brief attached
- Rescheduling handled automatically with recruiter notification

---

### 5.2 AI Agents Required

#### Agent 4.1 — `OutreachAgent`

| Property | Detail |
|---|---|
| **Role** | Generates personalised candidate outreach messages; manages send queue; learns from response rates |
| **Trigger** | Recruiter approves shortlisted candidate for outreach |
| **LLM Model** | GPT-4o-mini (cost-efficient; high volume; quality monitored via A/B response rate data) |
| **Orchestration** | LangGraph task triggered by approval event; A/B testing loop managed by orchestrator |

**Tasks:**

**Personalised Message Generation:**
1. Retrieve Candidate Intelligence Brief™ for this candidate (pre-generated in Module 3)
2. Extract 2–3 strongest specific signals from brief: concrete, verifiable items (a specific GitHub project, a blog post, a career pivot)
3. Retrieve role context: company, role title, key selling points (growth stage, team, impact)
4. Generate personalised message: opens with specific candidate signal, frames role relevance, clear call to action
5. Style the message per recruiter's configured tone (formal/conversational/technical)
6. Return message draft to recruiter for review — message cannot send without recruiter approval

**Approval Gate:**
1. Create `PENDING_HUMAN_APPROVAL` checkpoint for each message
2. Recruiter reviews draft, edits if needed, approves
3. Approved message enters send queue

**Send Queue Management:**
1. Schedule send at optimal time: research-backed default (Tuesday–Thursday, 9–11am local time of candidate) or recruiter-configured
2. Deduplication check: Redis cache — has this candidate been contacted for this role within the past 90 days?
3. Execute send via AWS SES (email) or LinkedIn InMail API (if recruiter prefers InMail)
4. Log send event to audit log

**Response Rate Learning:**
1. Track response/no-response per message variant (different signal types, different opening styles, different CTAs)
2. Feed response signals back to OutreachAgent via Kafka event stream
3. Use Thompson Sampling (simple Bayesian bandit) to adjust message variant weights over time
4. Surface response rate analytics to recruiter dashboard

**Tools:**
- `brief_retriever_tool` — fetches Candidate Intelligence Brief™ from PostgreSQL
- `signal_extractor_tool` — GPT-4o-mini: identifies 2–3 strongest specific signals from brief
- `message_generator_tool` — GPT-4o-mini: generates personalised message with specific signal references
- `message_approval_tool` — LangGraph blocking checkpoint; recruiter notification
- `outreach_dedup_tool` — Redis: checks if candidate has been contacted recently
- `ses_send_tool` — AWS SES email delivery
- `linkedin_inmail_tool` — LinkedIn Recruiter InMail API (if enabled)
- `response_tracker_tool` — tracks reply/no-reply per message; feeds into bandit model
- `thompson_sampling_tool` — Bayesian bandit for message variant optimisation

---

#### Agent 4.2 — `SchedulerAgent`

| Property | Detail |
|---|---|
| **Role** | Negotiates interview availability; books interviews; manages rescheduling |
| **Trigger** | Candidate responds positively to outreach and indicates availability |
| **LLM Model** | GPT-4o-mini (availability parsing from candidate email/message) |
| **Orchestration** | LangGraph event-driven state machine |

**Tasks:**
1. Parse candidate's availability response from email or in-app message
2. Query recruiter's calendar (Google Calendar or Outlook) for available slots via free/busy API
3. Propose 3 interview time options within candidate's stated availability window
4. Candidate selects a slot (via embedded scheduling link or CareerAgent™ calendar)
5. Create calendar event for both recruiter and candidate
6. Send confirmation to both parties: includes context-rich pre-meeting brief (link to sanitised Candidate Intelligence Brief™ for recruiter; Opportunity Intelligence Brief™ for candidate via CareerAgent™)
7. Handle rescheduling: if candidate or recruiter cancels, propose new slots automatically — notify recruiter of change
8. Handle no-show: flag to recruiter 5 minutes after scheduled start if interview hasn't been joined

**Tools:**
- `email_availability_parser_tool` — GPT-4o-mini: extracts availability windows from free text
- `google_calendar_tool` — Google Calendar API: free/busy query + event creation
- `outlook_calendar_tool` — Microsoft Graph API: free/busy query + event creation
- `calendly_fallback_tool` — Calendly API: alternative scheduling flow if recruiter prefers
- `interview_confirmation_mailer_tool` — AWS SES: sends confirmation with brief links
- `reschedule_manager_tool` — handles cancellation + reproposal flow
- `no_show_alerter_tool` — time-based event trigger (AWS EventBridge) if interview not joined

---

### 5.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **OpenAI API** (GPT-4o-mini) | Message generation, availability parsing | API Key | Phase 1 |
| **AWS SES** | Email outreach delivery + confirmations | AWS SDK | Phase 1 |
| **LinkedIn Recruiter InMail API** | InMail outreach (optional recruiter preference) | LinkedIn partner OAuth | Phase 2 |
| **Google Calendar API** | Recruiter + candidate calendar scheduling | OAuth 2.0 | Phase 1 |
| **Microsoft Graph API** (Outlook) | Same for Microsoft 365 customers | OAuth 2.0 (Azure AD app) | Phase 1 |
| **Calendly API** | Alternative scheduling flow | OAuth 2.0 | Phase 2 |
| **Redis** | Outreach deduplication | AWS ElastiCache | Phase 1 |
| **AWS EventBridge** | Scheduled actions (optimal send time, no-show alert) | AWS SDK | Phase 1 |

---

### 5.4 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Outreach message editor UI | Frontend | React 18 + TipTap | Pre-populated with agent draft; recruiter edits inline |
| Send queue dashboard | Frontend | React 18 | Queue items with status; scheduled send time; approve/reject |
| Response rate analytics panel | Frontend | React 18 + Recharts | Per message variant; send/response rates; trend chart |
| Scheduling status tracker | Frontend | React 18 | Per candidate: scheduling state; calendar event link |
| Calendar OAuth flows | Backend | Node.js + Cognito | Google + Microsoft OAuth tokens stored in Secrets Manager |
| Scheduling confirmation emails | Backend | Node.js + SES templates | HTML email templates with brief links |
| No-show alerter | Backend | Python + EventBridge | Time-triggered lambda: check if interview started |

---

### 5.5 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| OutreachAgent (message gen + bandit learning) | High | 3 weeks (1 AI/ML engineer) |
| SchedulerAgent (multi-calendar) | High | 3 weeks (1 backend engineer) |
| Google Calendar + Outlook OAuth | Medium | 1 week (1 backend engineer) |
| Outreach editor UI | Medium | 1 week (1 FE engineer) |
| Response rate analytics | Medium | 1 week (1 FE + 1 backend engineer) |

---

## 6. Module 5 — Screen & Assessment (ScreenAgent)

### 6.1 Feature Description

Async video screening with AI-generated role-specific questions. Responses analysed for content quality, communication clarity, and structured competency signals. Portfolio and work-sample analysis for technical roles. Structured capability profile output fed into the Candidate Intelligence Brief™ as a verified competency layer.

**User-facing outputs (recruiter):**
- Async video screening platform embedded in HOGH dashboard
- AI-generated screening questions specific to this role and candidate
- Transcript + annotated analysis per response: content score, communication clarity, competency signals
- Structured capability profile added to Candidate Intelligence Brief™
- Comparative scoring across all screened candidates for this requisition

---

### 6.2 AI Agents Required

#### Agent 5.1 — `ScreenAgent`

| Property | Detail |
|---|---|
| **Role** | Generates screening questions; analyses video responses; assesses portfolios and work samples |
| **Trigger** | Recruiter advances candidate to screening stage in pipeline |
| **LLM Model** | GPT-4o (question generation, response analysis, capability profile synthesis) |
| **Orchestration** | LangGraph pipeline: question generation → candidate submission → analysis |

**Tasks:**

**Question Generation:**
1. Retrieve role JD and Candidate Intelligence Brief™
2. Generate 4–6 role-specific screening questions:
   - 2 competency questions targeting the role's must-have skills (from JD)
   - 1–2 behavioural questions targeting motivations identified in brief
   - 1 "gap exploration" question targeting a verification flag in the brief
3. Return questions to recruiter for review/edit before sending to candidate

**Video Response Analysis:**
1. Receive video response file (uploaded by candidate via screening platform)
2. Transcribe video: AWS Transcribe (batch mode; async)
3. Analyse transcription per question:
   - Content quality: did the answer address the question? Is the claim specific and credible?
   - STAR structure: situation, task, action, result — all present?
   - Communication clarity: filler word rate, pacing, vocabulary complexity
   - Competency signals: extract specific claims → map to ESCO skill taxonomy
4. Generate competency signal per answer: "Candidate provided specific evidence of Python expertise at scale (claim: 'led migration of 50M row ETL pipeline from Pandas to PySpark') — rated: Strong"
5. Generate capability profile: structured JSON summarising all competency signals with confidence ratings

**Portfolio Analysis (Technical Roles):**
1. Receive GitHub repo URL or portfolio link from candidate profile
2. Analyse primary repo(s): code quality signals (test coverage, documentation, architecture patterns), technology stack, commit history and consistency
3. Generate portfolio assessment: 3–5 specific findings with evidence

**Structured Capability Profile:**
1. Synthesise video analysis + portfolio assessment into unified Structured Capability Profile
2. Add Structured Capability Profile as a new section to the existing Candidate Intelligence Brief™
3. Update candidate's Neo4j profile: add evidence-backed `HAS_SKILL` edges with `evidence_count` from screen

**Tools:**
- `brief_retriever_tool` — fetches brief from PostgreSQL
- `screen_question_generator_tool` — GPT-4o: generates role-specific screening questions
- `video_transcription_tool` — AWS Transcribe batch: transcribes video response
- `response_analyser_tool` — GPT-4o: structured analysis of transcribed response
- `star_structure_scorer_tool` — GPT-4o-mini: STAR adherence scoring
- `competency_signal_extractor_tool` — fine-tuned GPT-4o-mini: maps answer content to ESCO skills
- `github_portfolio_analyser_tool` — GitHub REST API + GPT-4o: code quality and pattern analysis
- `capability_profile_generator_tool` — GPT-4o: synthesises all signals into structured profile
- `neo4j_skill_evidence_updater_tool` — upserts `HAS_SKILL` edges with screen evidence

---

### 6.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **AWS Transcribe** (batch) | Video response transcription | AWS SDK | Phase 1 |
| **AWS S3** | Video response file storage | AWS SDK | Phase 1 |
| **OpenAI API** (GPT-4o, GPT-4o-mini) | Question gen, response analysis, portfolio analysis | API Key | Phase 1 |
| **GitHub REST API** | Portfolio and code sample analysis | API Key | Phase 1 |
| **Neo4j** | Update candidate skill evidence | Bolt driver | Phase 1 |
| **Zoom API** or **daily.co API** | Async video recording infrastructure (if not using self-hosted) | API Key | Phase 1 |

---

### 6.4 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Async video recording UI | Frontend | React 18 + WebRTC | Embedded in candidate-facing screen invite flow |
| Video upload + S3 storage pipeline | Backend | Node.js + AWS S3 + SQS | Trigger ScreenAgent on upload completion |
| Screen analysis results UI (recruiter) | Frontend | React 18 | Per-question scores, transcript, capability profile panel |
| Comparative scoring UI | Frontend | React 18 + Recharts | Cross-candidate capability comparison chart |
| Candidate screening invite flow | Frontend | React 18 + email | Candidate receives invite, records async, submits |

---

### 6.5 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| ScreenAgent (full pipeline) | Very High | 4 weeks (1 AI/ML engineer) |
| Video recording infrastructure | High | 2 weeks (1 backend + 1 FE engineer) |
| Transcription + analysis pipeline | High | 2 weeks (1 backend engineer) |
| Portfolio analysis agent | High | 2 weeks (1 AI/ML engineer) |
| Screen results UI | Medium | 2 weeks (1 FE engineer) |

---

## 7. Module 6 — Interview Orchestration

### 7.1 Feature Description

Pre-interview pack delivered automatically to the recruiter: final Candidate Intelligence Brief™ with updated screen data, recommended questions, compensation context. Video interview hosted in-platform or via Zoom/Teams. Post-interview debrief prompt sent immediately after the call. Feedback used to update candidate ranking. CareerAgent notifies the job seeker of outcome and provides anonymised feedback where recruiter has enabled this.

---

### 7.2 AI Agents Required

#### Agent 6.1 — `InterviewOrchestrationAgent`

| Property | Detail |
|---|---|
| **Role** | Manages pre-interview pack delivery, video hosting, post-interview debrief collection |
| **Trigger** | Interview confirmed and scheduled (SchedulerAgent event) |
| **LLM Model** | GPT-4o (debrief synthesis, feedback summary) |
| **Orchestration** | LangGraph event-driven state machine keyed to interview event |

**Tasks:**

**Pre-Interview Pack:**
1. 24 hours before interview: compile final Candidate Intelligence Brief™ (with screen data added)
2. Add recommended interview questions: from IntelligenceAgent conversation angles + ScreenAgent gap exploration
3. Add compensation context: current benchmark vs. candidate's inferred comp expectations (from CareerAgent data if candidate has shared)
4. Push to recruiter dashboard: WebSocket notification + email summary
5. Push Opportunity Intelligence Brief™ to candidate via CareerAgent™ (if CareerAgent user)

**Video Interview Hosting:**
1. If in-platform hosting: generate HOGH video room (WebRTC-based) with in-interview tools (note-taking, competency scoring checklist, question list)
2. If Zoom: create Zoom meeting via Zoom API; send join links to both parties
3. If Teams: create Teams meeting via Microsoft Graph API; send join links
4. Monitor meeting join events: detect when both parties have joined

**Post-Interview Debrief:**
1. 10 minutes after scheduled interview end time: push debrief prompt to recruiter
2. Debrief template: structured feedback form — competency ratings (per required skill), culture fit signal, communication effectiveness, hire/no-hire recommendation with reasoning
3. Recruiter completes debrief in HOGH or integrated ATS
4. Store debrief linked to candidate + requisition record
5. Update candidate composite score: weight debrief ratings into overall candidate ranking
6. Generate feedback summary for candidate (anonymised per recruiter preference):
   - If recruiter enables feedback: CareerAgent™ receives structured feedback for candidate
   - If recruiter disables: candidate notified of outcome only

**Outcome Communication:**
1. Recruiter marks decision: Advance / Reject / Hold
2. If Reject: CareerAgent™ notified; anonymous feedback delivered (if enabled) within 24 hours
3. If Advance: candidate moves to next stage; SchedulerAgent triggered for next interview booking
4. All decisions and timestamps written to audit log

**Tools:**
- `pre_interview_pack_generator_tool` — assembles updated brief + questions + comp context
- `zoom_meeting_creator_tool` — Zoom API: create meeting + send links
- `teams_meeting_creator_tool` — Microsoft Graph API: create meeting
- `webrtc_room_tool` — internal video room creation (daily.co API or self-hosted Mediasoup)
- `debrief_prompt_sender_tool` — EventBridge-triggered push at T+10min post-interview
- `debrief_collector_tool` — structured form submission → PostgreSQL
- `candidate_score_updater_tool` — updates candidate composite score with debrief ratings
- `outcome_communicator_tool` — triggers CareerAgent™ notification via Kafka event
- `audit_log_writer_tool` — immutable write to audit log

---

### 7.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **Zoom API** | Video interview creation | OAuth 2.0 | Phase 1 |
| **Microsoft Graph API** (Teams) | Teams meeting creation | OAuth 2.0 (Azure AD) | Phase 1 |
| **daily.co API** or **Mediasoup** | In-platform video rooms | API Key / self-hosted | Phase 2 |
| **AWS EventBridge** | Debrief prompt timing | AWS SDK | Phase 1 |
| **OpenAI API** (GPT-4o) | Debrief synthesis, feedback summary | API Key | Phase 1 |

---

### 7.4 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| Pre-interview pack compilation | Medium | 1 week (1 AI/ML engineer) |
| Zoom + Teams integration | Medium | 2 weeks (1 backend engineer) |
| In-platform video rooms | Very High | 4 weeks (1 backend + 1 FE engineer) — Phase 2 |
| Post-interview debrief flow | Medium | 1 week (1 FE + 1 backend engineer) |
| Outcome → CareerAgent communication | Medium | 1 week (1 backend engineer) |

---

## 8. Module 7 — Offer Management (OfferAgent)

### 8.1 Feature Description

OfferAgent generates a recommended offer package benchmarked against the Talent Intelligence Graph and the company's own historical offer distribution. Models compensation scenarios ("if equity cliff extended, cash equivalent?"). Every offer requires human recruiter approval before generation. Offer letter generated only after verbal agreement reached. NegotiationCoach™ activates for the live offer conversation.

**Critical compliance constraint:** The `offer-service` database has a hard constraint — an offer letter cannot be generated unless the associated `offer_approval_id` references a confirmed human approval record in the audit log. This is enforced at the database level, not application code.

---

### 8.2 AI Agents Required

#### Agent 7.1 — `OfferAgent`

| Property | Detail |
|---|---|
| **Role** | Generates recommended offer package; models comp scenarios; manages offer approval workflow |
| **Trigger** | Recruiter initiates offer process for a candidate |
| **LLM Model** | GPT-4o (scenario reasoning, offer letter generation) |
| **Orchestration** | LangGraph state machine with multiple human approval gates |

**Tasks:**

**Offer Package Generation:**
1. Retrieve role's approved comp band from Workday HCM / HR system
2. Query Neo4j: market benchmark for this role + location + seniority (p25/median/p75/p90)
3. Query platform aggregate data: company's own historical offer distribution (anonymised) — what has this company typically offered for this role type?
4. Retrieve candidate's inferred compensation expectations (from CareerAgent data if candidate has shared publicly; surfaced as a range, not a precise figure)
5. Generate recommended offer package:
   - Base salary recommendation: specific figure within approved comp band, anchored to market data
   - Bonus recommendation: percentage and structure
   - Equity recommendation: grant size, cliff, vesting schedule
   - Benefits package: standard + any flex benefits available
   - Signing bonus (if applicable): recommendation with rationale

**Scenario Modelling:**
1. Model "comp equivalent" scenarios: "if we extend the equity cliff by 6 months, what's the cash equivalent for the candidate?"
2. Model "trade-off" scenarios: "if candidate requests +$15K base, what's the total comp impact over 3 years vs. offering more equity?"
3. Generate scenario modelling table for recruiter review
4. Identify guardrails: flag if any scenario pushes outside the approved comp band

**Approval Workflow:**
1. Present recommended offer to recruiter for review
2. Create `PENDING_HUMAN_APPROVAL` checkpoint (Human Handoff Protocol)
3. Recruiter approves/adjusts and approves — approval record written to audit log
4. On recruiter approval: offer details locked; `offer_approval_id` generated and stored
5. Offer is in "verbal discussion" state — no letter generated yet

**Offer Letter Generation:**
1. Triggered only after recruiter confirms verbal agreement with candidate
2. Check database constraint: `offer_approval_id` must exist and be confirmed
3. Generate offer letter from approved offer details (using legal-compliant template)
4. Route offer letter to HR Ops for counter-signature (approval workflow)
5. On final signature: deliver offer letter to candidate via CareerAgent™ + email

**Tools:**
- `workday_comp_band_tool` — active comp bands from Workday HCM
- `neo4j_market_benchmark_tool` — salary benchmarks from Talent Intelligence Graph
- `platform_offer_history_tool` — anonymised company historical offer distribution
- `career_agent_inferred_comp_tool` — candidate's shared comp expectations (anonymised range)
- `offer_package_generator_tool` — GPT-4o: generates recommended offer with rationale
- `scenario_modeller_tool` — Python function + GPT-4o: comp scenario calculations and narratives
- `offer_approval_tool` — LangGraph blocking checkpoint; creates offer_approval_id on confirmation
- `offer_letter_generator_tool` — GPT-4o + legal template: generates offer letter document
- `offer_letter_delivery_tool` — SES + CareerAgent™ Kafka event: delivers offer to candidate
- `audit_log_writer_tool` — immutable write for every offer action

---

### 8.3 Integrations Required

| Integration | Purpose | Auth Method | Build Phase |
|---|---|---|---|
| **Workday HCM** | Active comp bands, employee records | Workday REST API (OAuth 2.0) | Phase 2 |
| **Neo4j** | Market benchmarks | Bolt driver | Phase 1 |
| **AWS SES** | Offer letter delivery | AWS SDK | Phase 1 |
| **OpenAI API** (GPT-4o) | Offer package generation, scenario reasoning, offer letter | API Key | Phase 1 |
| **DocuSign API** (optional) | Digital offer letter signature | OAuth 2.0 | Phase 2 |

---

### 8.4 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Offer builder UI | Frontend | React 18 | Recommended offer display; scenario modelling table; edit controls |
| Scenario modelling UI | Frontend | React 18 + Recharts | Interactive scenario explorer: adjust comp components, see total comp impact |
| Offer approval flow UI | Frontend | React 18 | Approval chain tracker; approve/reject buttons |
| Offer letter template | Backend | Node.js + PDF generation | Legal-compliant template with variable fields |
| `offer-service` microservice | Backend | Node.js + PostgreSQL | Core offer CRUD; database-level constraint on offer letter generation |
| Offer approval ID constraint | Database | PostgreSQL | NOT NULL FK constraint on `offer_approval_id` — enforced at DB level |

---

### 8.5 Build Complexity

| Component | Complexity | Estimated Dev Effort |
|---|---|---|
| OfferAgent LangGraph pipeline | High | 3 weeks (1 AI/ML engineer) |
| Scenario modelling UI | High | 2 weeks (1 FE engineer) |
| Database-level offer constraint | Medium | 0.5 weeks (1 backend engineer) |
| Offer letter generation + delivery | Medium | 1 week (1 backend engineer) |
| Workday comp band integration | High | 2 weeks (1 backend engineer) |

---

## 9. Module 8 — Analytics & Reporting

### 9.1 Feature Description

Real-time pipeline velocity dashboard. Diversity analytics with bias audit results. Recruiter performance metrics benchmarked against platform averages. CHRO-level auto-generated reports exportable as PDF or pushed to HRIS.

**User-facing outputs:**
- Pipeline velocity dashboard: all requisitions by stage, time-in-stage, predicted time-to-fill
- Diversity funnel: demographic composition at each pipeline stage; bias audit results
- Recruiter performance scorecard: conversion rates, response rates, offer acceptance rates
- CHRO board report: auto-generated PDF; pushed to Workday/SuccessFactors on schedule

---

### 9.2 AI Agents Required

#### Agent 8.1 — `AnalyticsAgent`

| Property | Detail |
|---|---|
| **Role** | Aggregates pipeline data; generates CHRO reports; surfaces recruiter performance insights |
| **Trigger** | Scheduled (daily/weekly CHRO report); real-time for pipeline dashboard |
| **LLM Model** | GPT-4o-mini (narrative generation for CHRO report text) |
| **Orchestration** | Scheduled EventBridge job for reports; real-time WebSocket for dashboard |

**Tasks:**
1. Aggregate pipeline metrics from `recruiter-service` PostgreSQL: stage counts, time-in-stage, conversion rates per stage
2. Compute predicted time-to-fill: regression model based on current stage counts, historical time-to-fill, and pipeline velocity
3. Aggregate diversity data: stage-by-stage demographic composition (using proxy signals where direct data unavailable)
4. Run disparate impact tests per pipeline stage (80% rule across gender, age group, ethnicity)
5. Compute recruiter performance metrics: outreach response rate, scheduling conversion, offer acceptance rate
6. Benchmark against platform anonymised averages: "your offer acceptance rate is 72% vs. platform average 68%"
7. Generate CHRO report narrative: GPT-4o-mini call; produces executive-level summary with data
8. Render CHRO report to PDF (WeasyPrint)
9. Push to Workday or SuccessFactors via HRIS integration

**Tools:**
- `pipeline_metrics_aggregator_tool` — SQL queries against `recruiter-service` PostgreSQL
- `time_to_fill_predictor_tool` — statistical regression model (Python scikit-learn, hosted on Lambda)
- `diversity_funnel_calculator_tool` — demographic aggregation + disparate impact test
- `platform_benchmark_tool` — queries anonymised platform aggregate data (PostgreSQL + Athena)
- `chro_report_generator_tool` — GPT-4o-mini: generates report narrative from structured data
- `pdf_renderer_tool` — WeasyPrint: renders CHRO report to PDF
- `hris_push_tool` — pushes report to Workday / SuccessFactors via HRIS integration

---

### 9.3 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Pipeline velocity dashboard | Frontend | React 18 + Recharts | Real-time Kanban + funnel chart; stage velocity metrics |
| Diversity analytics dashboard | Frontend | React 18 + Recharts | Stage-by-stage demographic funnel; bias flag alerts |
| Recruiter performance scorecard | Frontend | React 18 + Recharts | Per-metric gauge + trend line; platform benchmark overlay |
| CHRO report builder | Frontend | React 18 | Preview, date range selector, export to PDF |
| Analytics data warehouse | Backend | AWS Athena + S3 (Parquet) | Kafka → Kinesis Firehose → S3; queried via Athena |
| `analytics-service` microservice | Backend | Python + FastAPI | Data aggregation, metric computation, Athena query layer |

---

## 10. Module 9 — NegotiationCoach™ Live Session (Recruiter Side)

### 10.1 Feature Description

During the live offer conversation, NegotiationCoach™ delivers real-time private advisory to the recruiter through the TalentAgent™ dashboard. The recruiter sees: live offer comparison vs. market benchmarks and their own comp percentiles, candidate's inferred compensation floor (as a range, never a precise figure), candidate's shared priority stack (only if candidate has enabled this in their CareerAgent™ privacy settings), competing offer signals, and if-then guidance updated as the conversation progresses.

**Activation:** Both recruiter and candidate must explicitly acknowledge that NegotiationCoach™ is active before the session begins. This is a mutual acknowledgment — recorded and logged.

---

### 10.2 AI Agents Required

#### Agent 9.1 — `NegotiationCoachRecruiterAgent`

| Property | Detail |
|---|---|
| **Role** | Delivers real-time private negotiation advisory to recruiter during live offer conversation |
| **Trigger** | Both parties acknowledge NegotiationCoach™ activation |
| **LLM Model** | GPT-4o (real-time game-theoretic scenario reasoning; < 800ms p95 advisory latency) |
| **Orchestration** | Persistent WebSocket session; event-driven update loop |

**Tasks:**
1. Pre-session: load offer data, market benchmarks, candidate inferred comp floor (range), candidate's priority stack (if shared)
2. Load company's approved comp band guardrails — NegotiationCoach™ will never suggest offers outside these bands
3. Establish private WebSocket channel for recruiter (separate from candidate channel — zero data sharing)
4. Display: offer vs. market p25/50/75; offer vs. company's p25/50/75 historical distribution; candidate's inferred floor range
5. Accept real-time input: recruiter types "candidate said X" or "candidate is pushing back on equity"
6. Generate if-then guidance in real-time:
   - Candidate pushes back on base → "Consider extending equity cliff by 6 months. Cash equivalent: +$8K over 2 years."
   - Candidate mentions competing offer → "Candidate has leverage. Recommend going to 65th percentile on total comp."
   - Candidate asks about remote flexibility → "Remote is configurable for this band per HR policy."
7. Policy guardrails: flag if recruiter is about to deviate from approved comp band
8. Session end: generate negotiation debrief — agreed terms, ZOPA analysis, recommendations for future offers at this company level

**Tools:**
- `websocket_recruiter_stream_tool` — private WebSocket channel (recruiter side only)
- `offer_benchmark_display_tool` — real-time benchmark vs. market and company distribution
- `candidate_floor_display_tool` — candidate's inferred comp floor as anonymised range (from CareerAgent™ shared signals only if candidate opted in)
- `comp_band_guardrail_tool` — checks scenario against approved comp band; flags violations
- `scenario_advisor_recruiter_tool` — GPT-4o: if-then recommendation given current conversation state
- `negotiation_debrief_tool` — GPT-4o: post-session summary and ZOPA analysis
- `audit_log_writer_tool` — immutable log of every session event

---

### 10.3 Technical Components to Build

| Component | Type | Notes |
|---|---|---|
| NegotiationCoach™ session UI (recruiter) | React 18 | Private panel: benchmark display, candidate signals, coaching prompts, input field |
| Private WebSocket channel management | Python + FastAPI + AWS API Gateway | Strict isolation — recruiter and candidate channels never share data |
| Mutual acknowledgment gate | React 18 + PostgreSQL | Both-party acknowledgment logged before session activates |
| Comp band guardrail enforcement | Python | Hard block if suggestion would violate approved band |
| Session audit log | PostgreSQL (append-only) | Every session event timestamped and immutable |

---

## 11. Module 10 — Compliance & Bias Architecture

### 11.1 Overview

Compliance and bias monitoring are cross-cutting concerns — they intercept agent outputs at multiple pipeline stages. This module is not a feature presented to recruiters directly; it is the trust infrastructure that makes the platform legally and ethically defensible.

---

### 11.2 AI Agents Required

#### Agent 10.1 — `BiasMonitorAgent`

| Property | Detail |
|---|---|
| **Role** | Runs disparate impact tests on shortlists and rankings; flags bias; generates corrective re-rankings |
| **Trigger** | Every candidate shortlist or ranking update (runs as sidecar alongside `agent-orchestrator`) |
| **LLM Model** | Claude 3.5 Sonnet (Constitutional AI training for fairness-sensitive reasoning) |
| **Orchestration** | Sidecar container alongside `agent-orchestrator`; intercepts pipeline at defined checkpoints |

**Tasks:**
1. Receive current candidate shortlist or ranking from `agent-orchestrator`
2. Run **disparate impact test** (80% rule / four-fifths rule) across gender, age group, and ethnicity using proxy signals (names, educational institution names, graduation years as age proxy)
3. If shortlist passes: approve and forward to recruiter
4. If shortlist fails:
   - Pause pipeline; write `BIAS_FLAG` event to Kafka and immutable audit log
   - Run SHAP explainability: which features are driving the demographic imbalance?
   - Generate corrective re-ranked shortlist: re-weight scores with bias-corrective factor
   - Generate explainability report for recruiter: human-readable SHAP breakdown
   - Present to recruiter: original shortlist, bias flag, corrective shortlist, and explanation
5. Enterprise HR Ops can configure disparate impact threshold (within EEOC-compliant bounds) — cannot disable monitor entirely

**Tools:**
- `disparate_impact_tester_tool` — Python statistical function: 80% rule test on shortlist
- `proxy_demographic_classifier_tool` — ML classifier: infers demographic proxy signals from name + education institution data (US Census name-to-ethnicity models)
- `shap_explainer_tool` — SHAP value computation on candidate match score features
- `corrective_ranker_tool` — re-weighting algorithm that reduces demographic skew while preserving skill-based ordering
- `bias_report_generator_tool` — Claude 3.5 Sonnet: generates human-readable bias report
- `audit_log_writer_tool` — immutable write of `BIAS_FLAG` event

---

#### Agent 10.2 — `ComplianceAgent`

| Property | Detail |
|---|---|
| **Role** | Processes DSAR requests; generates compliance reports; monitors EU AI Act obligations |
| **Trigger** | DSAR request submitted by candidate; scheduled compliance report (monthly); EU AI Act audit event |
| **LLM Model** | Claude 3.5 Sonnet (compliance-sensitive reasoning) |
| **Orchestration** | Event-driven Lambda functions for DSAR; scheduled EventBridge for reports |

**Tasks:**
1. **DSAR Processing:**
   - Receive DSAR request from candidate (via HOGH self-service portal or email)
   - Export all data held about candidate: PostgreSQL records, Pinecone vectors (fetched by metadata filter), Neo4j anonymised node data
   - Generate structured data export package (JSON + PDF readable format)
   - Process deletion request: cascade deletion across PostgreSQL, Pinecone (vector deletion by metadata filter), Neo4j (PII field clearing while preserving relationship structure)
   - Log all DSAR actions to immutable audit log with timestamp and processing agent
2. **Compliance Reporting:**
   - Monthly: generate audit report for HR Ops — all AI-assisted decisions, human approval events, bias flags, SHAP explanations generated
   - Export to PDF; available in HOGH Admin Console
3. **EU AI Act Monitoring:**
   - Track completeness of required technical documentation
   - Generate transparency disclosures for candidates (what AI was used, what data was processed)
   - Monitor model drift alerts (flag if model outputs deviate significantly from baseline)

**Tools:**
- `dsar_data_exporter_tool` — queries all data sources for a given candidate_id
- `pinecone_vector_deletion_tool` — deletes vectors by metadata filter (candidate_id)
- `neo4j_pii_clearer_tool` — clears PII fields on Candidate node while preserving relationship edges
- `postgresql_soft_delete_tool` — sets is_deleted flag; hard delete only via DSAR flow
- `compliance_report_generator_tool` — Claude 3.5 Sonnet: generates audit narrative from structured log data
- `eu_ai_act_disclosure_tool` — generates per-candidate AI usage disclosure for transparency portal

---

### 11.3 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| `bias-monitor` sidecar container | Backend | Python (Docker sidecar) | Runs alongside agent-orchestrator pod in Kubernetes |
| SHAP explainability computation | Backend | Python (SHAP library) | scikit-learn SHAP on match score features |
| Bias flag + corrective shortlist UI | Frontend | React 18 | Alert banner; original vs. corrective shortlist toggle |
| DSAR self-service portal | Frontend | Next.js (candidate-facing) | Request export, view data, request deletion |
| `compliance-service` microservice | Backend | Python + FastAPI + Lambda | DSAR processing, compliance reports, EU AI Act monitoring |
| Immutable audit log | Database | PostgreSQL (append-only; RLS; row-level delete disabled) | All compliance-critical events |
| Audit log archive | Storage | AWS S3 (MFA-delete protected; 7-year retention) | Cold archive of audit log exports |

---

## 12. Module 11 — HOGH Admin Console & Multi-Tenant Architecture

### 12.1 Feature Description

The HOGH Admin Console is used by enterprise HR Ops and compliance officers. It provides: user management (add/remove recruiters, configure roles), ATS integration configuration, per-customer NegotiationCoach™ enablement (feature flag), bias monitor threshold configuration, compliance report access, and audit log access.

---

### 12.2 Technical Components to Build

| Component | Type | Tech | Notes |
|---|---|---|---|
| Admin Console UI | Frontend | React 18 | Enterprise-grade admin panel; accessible via SSO |
| Enterprise SSO configuration | Backend | AWS Cognito + SAML 2.0 / OIDC | Per-customer IdP configuration (Okta, Azure AD, Google Workspace) |
| RBAC configuration UI | Frontend | React 18 | Role assignment: recruiter, hiring_manager, hr_admin, compliance_officer |
| ATS integration config UI | Frontend | React 18 | Connect/disconnect ATS; configure sync settings; test connection |
| Feature flag management | Backend | LaunchDarkly | NegotiationCoach™ gated per enterprise customer; recruiter-level flag management |
| Bias threshold configuration | Backend | PostgreSQL + UI | Configurable disparate impact threshold per customer (within EEOC bounds) |
| Prompt customisation (enterprise) | Backend | PostgreSQL `prompt-registry` | Enterprise customers can configure IntelligenceAgent emphasis |
| Multi-tenant data isolation | Database | PostgreSQL RLS + per-tenant Pinecone namespaces | Per-customer row-level security |

---

## 13. Cross-Cutting Infrastructure

### 13.1 `recruiter-service` — Core Backend Service

The central service managing all recruiter-side data.

**Responsibilities:**
- Recruiter user management, RBAC, permissions
- Requisition CRUD, pipeline stage management
- Candidate records (HOGH-enriched; ATS is source of record for HR compliance data)
- Human Handoff Protocol checkpoint management
- Interview scheduling records
- Row-level security: per-tenant data isolation

**Tech:** Node.js + Express + PostgreSQL (Aurora RDS, Multi-AZ)

---

### 13.2 `agent-orchestrator` — Master Orchestrator Service

The cognitive backbone of TalentAgent™.

**Orchestrator loop for a single requisition:**
```
1. RECEIVE goal: "Fill ML Engineer role, London, £120K, 45 days"
2. DECOMPOSE into sub-tasks
3. ASSIGN sub-tasks to specialist sub-agents via Kafka task queue
4. MONITOR sub-agent progress via Kafka event stream
5. EVALUATE outputs — re-queue if quality threshold not met (max 3 retries)
6. CHECK Human Handoff Protocol at each defined gate
   → PAUSE if human approval required → NOTIFY → AWAIT
7. SYNTHESISE outputs into deliverables
8. REPORT progress via WebSocket to recruiter dashboard
9. ADAPT plan dynamically (low response rates → trigger OutreachAgent strategy revision)
```

**State management:** LangGraph persistent state graph per requisition. Checkpointed to PostgreSQL every 60 seconds and on every human approval event. Full replay capability for audit.

**Tech:** Python + FastAPI + LangGraph + Kafka (AWS MSK)

---

### 13.3 Human Handoff Protocol™ — Implementation

Every human-required gate in TalentAgent™:

| Gate | Trigger | Action Without Human Approval |
|---|---|---|
| Requisition approval | New requisition created | Sourcing cannot begin |
| Shortlist approval | RadarAgent generates shortlist | No outreach can be initiated |
| Outreach approval | OutreachAgent drafts message | Message cannot send |
| Screen question approval | ScreenAgent generates questions | Screening cannot launch |
| Offer approval | OfferAgent generates recommendation | Offer letter cannot be generated (DB constraint) |
| Offer letter approval | Verbal agreement reached | Letter not delivered to candidate |

All gates are implemented as **blocking async checkpoints** in LangGraph. The `offer-service` has an additional **database-level constraint** (FK to audit-confirmed `offer_approval_id`) that cannot be bypassed at the application layer.

---

### 13.4 `llm-gateway` Service

Routes all LLM calls across TalentAgent™:

| Task | Model | Rationale |
|---|---|---|
| Candidate Intelligence Brief synthesis | GPT-4o | Long-context multi-source synthesis |
| JD generation, health scoring | GPT-4o | Narrative quality critical |
| NegotiationCoach™ scenario reasoning | GPT-4o | Game-theoretic reasoning quality |
| Outreach message generation | GPT-4o-mini | High volume; A/B monitored |
| Skill extraction, JD parsing, email parsing | Fine-tuned GPT-4o-mini | Low latency; high volume |
| Bias monitor, compliance reasoning | Claude 3.5 Sonnet | Constitutional AI for fairness-sensitive tasks |
| Screen response analysis | GPT-4o | Nuanced competency assessment |

---

## 14. Integration Registry — Full List

| # | Integration | Module(s) | Auth | API Type | Cost Model | Build Phase |
|---|---|---|---|---|---|---|
| 1 | LinkedIn Talent Solutions API | 2, 3 | OAuth (partner) | REST | Partner pricing | Phase 1 |
| 2 | GitHub REST API | 2, 3, 5 | OAuth 2.0 / API Key | REST | Free (rate limited) | Phase 1 |
| 3 | Stack Exchange API | 2 | API Key | REST | Free | Phase 2 |
| 4 | OpenAI API (GPT-4o, GPT-4o-mini, embeddings) | All | API Key | REST | Per token | Phase 1 |
| 5 | Anthropic API (Claude 3.5 Sonnet) | 10 | API Key | REST | Per token | Phase 1 |
| 6 | Pinecone | 2, 3, 4 | API Key | REST | Usage-based | Phase 1 |
| 7 | Neo4j (Talent Intelligence Graph) | 1, 2, 3, 7, 8 | Bolt driver | Graph | Self-hosted / AuraDB | Phase 1 |
| 8 | AWS SageMaker | 2 | AWS SDK | REST | Per inference hour | Phase 2 |
| 9 | AWS Transcribe | 5 | AWS SDK | REST/WebSocket | Per audio second | Phase 1 |
| 10 | AWS Cognito | All | AWS SDK | Managed | Per MAU | Phase 1 |
| 11 | AWS SES | 4, 7 | AWS SDK | SMTP/REST | Per email | Phase 1 |
| 12 | AWS EventBridge | 2, 4, 6, 8 | AWS SDK | Event | Per event | Phase 1 |
| 13 | Apache Kafka (AWS MSK) | All | AWS MSK | Event stream | Per broker hour | Phase 1 |
| 14 | Redis (ElastiCache) | All | AWS SDK | Cache | Per node hour | Phase 1 |
| 15 | Greenhouse REST API + Webhooks | 1, 2, 6 | REST | REST + Webhooks | Free (requires Greenhouse license) | Phase 1 |
| 16 | Lever REST API + Webhooks | 1, 2, 6 | REST | REST + Webhooks | Free (requires Lever license) | Phase 2 |
| 17 | Workday Recruiting REST API | 1, 7 | OAuth 2.0 | REST | Enterprise pricing | Phase 2 |
| 18 | Workday HCM | 7 | OAuth 2.0 | REST | Enterprise pricing | Phase 2 |
| 19 | SAP SuccessFactors OData API | 1, 8 | OAuth 2.0 + middleware | OData/REST | Enterprise pricing | Phase 3 |
| 20 | BambooHR API | 10 | API Key | REST | Per employee/month | Phase 3 |
| 21 | Google Calendar API | 4 | OAuth 2.0 | REST | Free | Phase 1 |
| 22 | Microsoft Graph API (Outlook + Teams) | 4, 6 | OAuth 2.0 (Azure AD) | REST | Free | Phase 1 |
| 23 | Calendly API | 4 | OAuth 2.0 | REST | Per usage | Phase 2 |
| 24 | Zoom API | 6 | OAuth 2.0 | REST | Per meeting | Phase 1 |
| 25 | daily.co API | 6 | API Key | REST | Per participant-minute | Phase 2 |
| 26 | Glassdoor Partner API | 3, 8 | Partner agreement | REST | Partner pricing | Phase 1 |
| 27 | Crunchbase Basic API | 3 | API Key | REST | Per request | Phase 1 |
| 28 | Bing Web Search API | 3 | Azure API Key | REST | Per transaction | Phase 1 |
| 29 | Levels.fyi | 1, 7 | Data license | REST | Annual license | Phase 2 |
| 30 | Bureau of Labor Statistics API | 1 | Public | REST | Free | Phase 1 |
| 31 | YouTube Data API v3 | 3 | API Key | REST | Per quota unit | Phase 2 |
| 32 | SpeakerDeck API | 3 | Public | REST | Free | Phase 2 |
| 33 | LaunchDarkly | 11 | SDK | SDK | Per MAU | Phase 1 |
| 34 | DocuSign API | 7 | OAuth 2.0 | REST | Per envelope | Phase 2 |
| 35 | Okta (SAML 2.0 / OIDC) | 11 | SAML / OIDC | Federation | Enterprise pricing | Phase 1 |
| 36 | Azure AD (SAML 2.0 / OIDC) | 11 | SAML / OIDC | Federation | Per AAD license | Phase 1 |

---

## 15. AI Agent Registry — Full List

| # | Agent Name | Module | LLM Model | Primary Tasks | Key Tools | Orchestration |
|---|---|---|---|---|---|---|
| 1 | `RequisitionIntelligenceAgent` | 1 | GPT-4o | JD generation, comp benchmarking, health scoring, approval workflow | jd_generator, comp_benchmark, health_scorer, approval_workflow, ats_sync | LangGraph conversational state machine |
| 2 | `RadarAgent` | 2 | GPT-4o-mini + GPT-4o | Multi-source discovery, fit scoring, passive signal detection, shortlist approval | linkedin_talent_api, github_search, ats_talent_pool, pinecone_match, neo4j_gnn, motivation_inference, passive_signal_detector | LangGraph parallel pipeline |
| 3 | `IntelligenceAgent` | 3 | GPT-4o | Master brief orchestration; synthesis of 4 sub-agents | brief_synthesiser, rag_pipeline, provenance_attacher, bias_monitor_gate | LangGraph pipeline |
| 4 | `LinkedInProfileSubAgent` | 3 | GPT-4o-mini | LinkedIn data extraction, career arc parsing, gap detection | linkedin_full_profile, career_arc_parser, gap_detector | Sub-agent of Module 3 |
| 5 | `PublicWorkSubAgent` | 3 | GPT-4o | GitHub analysis, publication search, skills evidence mapping | github_full_profile, google_scholar, bing_search, youtube_speaker, skills_evidence_mapper | Sub-agent of Module 3 |
| 6 | `MotivationInferenceSubAgent` | 3 | GPT-4o | Public writing analysis, motivation classification | content_sentiment_analyser, transition_pattern_analyser, motivation_classifier | Sub-agent of Module 3 |
| 7 | `ConversationAngleSubAgent` | 3 | GPT-4o | Interview angle generation, verification question creation | profile_role_crossref, interview_angle_generator | Sub-agent of Module 3 |
| 8 | `OutreachAgent` | 4 | GPT-4o-mini | Personalised message generation, send queue management, response rate learning | brief_retriever, signal_extractor, message_generator, ses_send, thompson_sampling | LangGraph approval gate + A/B loop |
| 9 | `SchedulerAgent` | 4 | GPT-4o-mini | Calendar negotiation, interview booking, rescheduling, no-show detection | email_availability_parser, google_calendar, outlook_calendar, calendly_fallback, no_show_alerter | LangGraph event-driven state machine |
| 10 | `ScreenAgent` | 5 | GPT-4o | Question generation, video response analysis, portfolio analysis, capability profile | screen_question_generator, aws_transcribe, response_analyser, github_portfolio_analyser, capability_profile_generator | LangGraph sequential pipeline |
| 11 | `InterviewOrchestrationAgent` | 6 | GPT-4o | Pre-interview pack, video hosting, debrief collection, outcome communication | pre_interview_pack, zoom_api, teams_api, debrief_collector, outcome_communicator | LangGraph event-driven |
| 12 | `OfferAgent` | 7 | GPT-4o | Offer package generation, scenario modelling, offer letter, approval workflow | workday_comp_band, neo4j_benchmark, scenario_modeller, offer_approval, offer_letter_generator | LangGraph multi-gate state machine |
| 13 | `AnalyticsAgent` | 8 | GPT-4o-mini | Pipeline metrics, diversity analytics, CHRO report generation | pipeline_aggregator, diversity_calculator, platform_benchmarks, chro_report_generator, hris_push | Scheduled EventBridge + real-time WebSocket |
| 14 | `NegotiationCoachRecruiterAgent` | 9 | GPT-4o | Real-time negotiation advisory, comp band guardrails, scenario reasoning | websocket_recruiter_stream, offer_benchmark_display, comp_band_guardrail, scenario_advisor_recruiter | Persistent WebSocket session |
| 15 | `BiasMonitorAgent` | 10 | Claude 3.5 Sonnet | Disparate impact testing, SHAP explainability, corrective re-ranking | disparate_impact_tester, proxy_demographic_classifier, shap_explainer, corrective_ranker, bias_report_generator | Sidecar container; intercepts at pipeline checkpoints |
| 16 | `ComplianceAgent` | 10 | Claude 3.5 Sonnet | DSAR processing, compliance reporting, EU AI Act monitoring | dsar_data_exporter, pinecone_vector_deletion, neo4j_pii_clearer, compliance_report_generator, eu_ai_act_disclosure | Event-driven Lambda + scheduled EventBridge |

---

## 16. Build Complexity & Cost Matrix

### 16.1 Development Complexity by Module

| Module | Frontend Complexity | Backend Complexity | AI/Agent Complexity | Overall | Recommended Phase |
|---|---|---|---|---|---|
| 1 — Requisition Intelligence | Medium | High | High | **High** | Phase 1 (Month 1–3) |
| 2 — Candidate Sourcing | Medium | Very High | Very High | **Very High** | Phase 1 (Month 2–4) |
| 3 — Candidate Intelligence Brief™ | High | High | Very High | **Very High** | Phase 1 (Month 3–5) |
| 4 — Outreach & Scheduling | Medium | High | High | **High** | Phase 1 (Month 3–5) |
| 5 — Screen & Assessment | High | High | Very High | **Very High** | Phase 1 (Month 4–6) |
| 6 — Interview Orchestration | Medium | High | Medium | **High** | Phase 1 (Month 5–6) |
| 7 — Offer Management | High | High | High | **High** | Phase 2 (Month 6–8) |
| 8 — Analytics & Reporting | High | High | Medium | **High** | Phase 2 (Month 6–8) |
| 9 — NegotiationCoach™ | High | Very High | High | **Very High** | Phase 2 (Month 8–10) |
| 10 — Compliance & Bias | Low | Very High | High | **Very High** | Phase 1 foundational + Phase 2 depth |
| 11 — Admin Console | Medium | High | Low | **Medium–High** | Phase 1 (Month 2–4) |

---

### 16.2 Recurring Operational Cost Drivers (Monthly, at Scale)

| Cost Category | Driver | Estimated Cost (at 50 enterprise seats) | Notes |
|---|---|---|---|
| LLM API — GPT-4o | CIB generation, NegotiationCoach™, offer generation, screen analysis | $15,000–$30,000/month | CIB = ~80k tokens per candidate; NegotiationCoach live = ~30k tokens per session |
| LLM API — GPT-4o-mini | Outreach generation, JD parsing, email parsing, skill extraction | $2,000–$5,000/month | High volume; low cost per call |
| LLM API — Claude 3.5 Sonnet | Bias monitor, compliance reports, DSAR processing | $1,000–$3,000/month | Lower volume; premium justified for fairness-critical tasks |
| Pinecone | Candidate embedding storage and semantic search | $1,000–$3,000/month | Per-tenant namespace; scales with candidate volume |
| Neo4j AuraDB | Talent Intelligence Graph | $2,000–$5,000/month | Professional tier |
| AWS infrastructure (EKS, RDS, ElastiCache, MSK, SageMaker) | All services | $5,000–$12,000/month | GPU nodes for SageMaker inference; Phase 2+ |
| LinkedIn Talent Solutions | Candidate profile data | $5,000–$20,000/month | Partner pricing; heavily usage-dependent — single largest API cost |
| Glassdoor Partner API | Company + interview data | $1,000–$3,000/month | Partner pricing |
| AWS Transcribe | Screen response transcription | $500–$2,000/month | Per audio minute; scales with screening volume |
| Zoom API | Interview hosting | $500–$1,500/month | Per meeting; scales with interview volume |

**Total estimated operational cost at 50 enterprise seats: ~$33,000–$84,000/month**
(Before enterprise subscription revenue; LinkedIn Talent Solutions is the most volatile cost — model carefully during commercial planning)

---

### 16.3 One-Time Build Cost Drivers

| Item | Estimated Engineering Cost | Notes |
|---|---|---|
| Talent Intelligence Graph initial build (Neo4j + ESCO/O*NET) | $30,000–$50,000 | Shared with CareerAgent™ build |
| GraphSAGE GNN model training | $20,000–$40,000 | Phase 2; requires curated training data |
| Fine-tuning GPT-4o-mini for JD parsing + skill extraction | $10,000–$20,000 | Training data curation + runs |
| LinkedIn Talent Solutions partnership | $0–$10,000 (legal + BD) | Required for all LinkedIn profile data |
| Greenhouse API certification | $0–$5,000 | Requires Greenhouse partner review |
| Glassdoor data partnership | $0–$5,000 | Glassdoor partner agreement |
| Levels.fyi data license | $10,000–$30,000/year | Annual fee |
| Bias testing framework development | $20,000–$40,000 | Proxy demographic classifier; SHAP pipeline; corrective ranker |
| EU AI Act compliance documentation (Month 6–24) | $30,000–$60,000 | Technical documentation, Notified Body engagement |

---

## 17. Development Roles Required

| Role | Modules | FTE Estimate (Phase 1) | Notes |
|---|---|---|---|
| **AI/ML Engineer** | 1–7 agent modules | 3 FTE | LangGraph, LLM integration, RAG pipeline, NegotiationCoach™ |
| **Backend Engineer (Python)** | agent-orchestrator, intelligence services, bias monitor, compliance | 2 FTE | FastAPI, LangGraph, Kafka, bias architecture |
| **Backend Engineer (Node.js)** | recruiter-service, ATS connectors, integration-hub, offer-service | 2 FTE | Express, PostgreSQL, ATS integrations |
| **Frontend Engineer (React 18)** | All recruiter dashboard surfaces | 2 FTE | React 18, Zustand, Recharts, D3.js, TipTap |
| **ML Engineer (Graph/GNN)** | Talent Intelligence Graph, GraphSAGE, SHAP | 1 FTE (Phase 2) | Neo4j, GraphSAGE, SageMaker, SHAP |
| **Data Engineer** | Kafka → S3/Athena pipeline, Pinecone embeddings, Neo4j data import | 1 FTE | ETL, embedding pipeline, data warehouse |
| **DevOps / Platform Engineer** | EKS, CI/CD, observability, multi-tenant infra | 1–2 FTE | Kubernetes, Helm, Terraform, Prometheus/Grafana |
| **Security Engineer** | Auth (Cognito + SSO), KMS, GDPR, EU AI Act | 1 FTE | SAML/OIDC, encryption architecture, compliance |
| **Product Designer** | All dashboard surfaces + Admin Console | 1 FTE | Enterprise design system, accessibility |
| **BD / Partnership Lead** | LinkedIn, Glassdoor, Greenhouse, Levels.fyi partnerships | 1 FTE (non-engineering) | Partnership agreements required before API access |

**Minimum Phase 1 team: 12–14 engineers + 1 designer + 1 BD lead**

---

## 18. Phase-by-Phase Delivery Plan

### Phase 1 — Core Platform (Months 1–6)

**Goal:** Operational TalentAgent™ with requisition intelligence, candidate sourcing, Candidate Intelligence Brief™, outreach, scheduling, screening, and interview orchestration. All with Human Handoff Protocol and basic compliance infrastructure.

| Sprint | Deliverable | Module |
|---|---|---|
| Sprint 1–2 | Infrastructure: EKS cluster, RDS, Redis, Kafka (MSK), Cognito (SSO), CI/CD, LaunchDarkly | Cross-cutting |
| Sprint 3–4 | `recruiter-service`, requisition schema, RBAC, Admin Console (basic) | Module 1, 11 |
| Sprint 5–6 | RequisitionIntelligenceAgent: JD generation, comp benchmarking, health scoring | Module 1 |
| Sprint 7–8 | Greenhouse connector, ATS sync framework, `integration-hub` | Module 1, 11 |
| Sprint 9–10 | RadarAgent (v1 — semantic matching only), LinkedIn integration, candidate shortlist UI | Module 2 |
| Sprint 11–12 | IntelligenceAgent pipeline: all 4 sub-agents, brief synthesis, provenance UI | Module 3 |
| Sprint 13–14 | BiasMonitorAgent (sidecar), disparate impact test, SHAP explainability | Module 10 |
| Sprint 15–16 | OutreachAgent: message generation, approval gate, send queue | Module 4 |
| Sprint 17–18 | SchedulerAgent: Google Calendar + Outlook integration, confirmation emails | Module 4 |
| Sprint 19–20 | ScreenAgent: question generation, video infrastructure (AWS Transcribe), response analysis | Module 5 |
| Sprint 21–22 | InterviewOrchestrationAgent: pre-interview pack, Zoom/Teams integration, debrief flow | Module 6 |
| Sprint 23–24 | Integration testing, performance optimisation, security review, soft launch to beta customers | All |

---

### Phase 2 — Intelligence Depth & Offer Management (Months 7–12)

**Goal:** GNN match scoring, offer management, NegotiationCoach™, analytics reporting, Lever integration.

| Sprint | Deliverable | Module |
|---|---|---|
| Sprint 25–26 | GNN match scoring (GraphSAGE, SageMaker), RadarAgent upgrade | Module 2 |
| Sprint 27–28 | OfferAgent: offer package generation, scenario modelling, approval workflow | Module 7 |
| Sprint 29–30 | Database-level offer constraint, offer letter generation, DocuSign integration | Module 7 |
| Sprint 31–32 | NegotiationCoachRecruiterAgent: live session, WebSocket channels, mutual acknowledgment gate | Module 9 |
| Sprint 33–34 | AnalyticsAgent: pipeline dashboard, diversity analytics, CHRO report PDF | Module 8 |
| Sprint 35–36 | Lever connector, Workday Recruiting integration | Module 1, 2 |
| Sprint 37–38 | Workday HCM comp band integration, NegotiationCoach™ comp guardrails | Module 7, 9 |
| Sprint 39–40 | Passive candidate detection upgrade, motivation inference model tuning | Module 2 |

---

### Phase 3 — Enterprise Scale, Compliance & EU Expansion (Months 13–24)

**Goal:** EU AI Act compliance, GDPR data residency, enterprise hardening, additional ATS connectors, HOGH Public API.

| Sprint | Deliverable |
|---|---|
| Sprint 41–44 | GDPR data residency (eu-west-1 deployment), DSAR automation, EU AI Act technical documentation (Month 6 obligation) |
| Sprint 45–48 | EU AI Act transparency tooling: candidate disclosure portal, opt-out mechanism, data provenance reports |
| Sprint 49–52 | SAP SuccessFactors OData connector, BambooHR integration |
| Sprint 53–56 | GPT-4o-mini fine-tuning: JD parsing + skill extraction (Phase 3 cost optimisation) |
| Sprint 57–60 | HOGH Talent Intelligence API (public API layer): `/v1/match`, `/v1/skill-graph/query`, `/v1/benchmarks/compensation` |
| Sprint 61–68 | EU AI Act formal conformity assessment, Notified Body engagement (Month 24 target) |

---

### Summary Timeline

| Phase | Duration | Primary Output | Key Risk |
|---|---|---|---|
| Phase 1 | Months 1–6 | Core TalentAgent™ in production; beta enterprise customers | LinkedIn partnership approval time (allow 3–6 months for LinkedIn Talent Solutions agreement) |
| Phase 2 | Months 7–12 | Full pipeline including offer management and NegotiationCoach™ | GNN training data quality; Workday integration complexity |
| Phase 3 | Months 13–24 | EU compliance, APAC prep, public API, fine-tuned models | EU AI Act Notified Body timeline; SAP SuccessFactors integration complexity |

---

*End of TalentAgent™ Execution & Implementation Plan*
*Document version 1.0 | March 2026 | HireOrGetHired | Confidential*
