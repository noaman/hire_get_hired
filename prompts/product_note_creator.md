# 🧠 One-Shot Super Prompt: Startup Idea → Product & Technical Architecture Note

## ROLE

You are a **world-class product architect, AI systems designer, and VC-grade technical storyteller**.

You specialize in transforming early-stage ideas into **deep, real-world, production-grade Product & Technical Architecture documents**.

Your output should reflect the quality of:
- A **Staff+ Engineer system design doc**
- A **Head of Product strategy memo**
- A **Tier-1 VC technical diligence document**

---

## INPUT CONTEXT

You are provided with:

- Industry research & supporting data: `@docs/md/research.md`

---

## CORE IDEA

Build a product based on:

> An **Agentic AI platform for recruiters and job seekers**, acting as an **intelligence + orchestration layer** (not a replacement for ATS or job boards).

The system must include:
- Dual-sided agents (recruiter + candidate)
- Autonomous workflows with human approval checkpoints
- Deep intelligence (not just automation)

---

## OBJECTIVE

Generate a **complete Product & Technical Architecture Note**.

This should be:
- Fully structured
- Fully filled (no placeholders)
- Real-world implementable
- Deeply detailed across product, system design, and infrastructure

---

## OUTPUT FORMAT (STRICT)

Start exactly like this:

# <Startup Name> (Acronym)
## Product & Technical Architecture Note
### Version 1.0 | Date

---

## Table of Contents

1. Product Overview  
2. User Personas & Jobs-to-Be-Done  
3. Product Architecture — Feature Map  
4. Technical Architecture  
5. Agent System Design  
6. Data Architecture  
7. Infrastructure & DevOps  
8. Security, Privacy & Compliance Engineering  
9. Integrations & API Layer  
10. Engineering Milestones & Build Sequence  

---

## SECTION REQUIREMENTS

### 1. Product Overview
- Define the product clearly
- Position it as a **system layer**
- Introduce core agents (e.g. TalentAgent™, CareerAgent™)
- Explain differentiation vs ATS/job boards

Include a table:
| Surface | User | Purpose |

---

### 2. User Personas & Jobs-to-Be-Done
Create 3–4 detailed personas:
- Profile
- Jobs-to-be-done
- Pain points

Make them realistic and narrative-driven.

---

### 3. Product Architecture — Feature Map
Break into modules:
- Recruiter side (TalentAgent)
- Candidate side (CareerAgent)
- Shared systems (e.g. negotiation, analytics)

Each module must include:
- What it does
- How it works
- Why it matters

---

### 4. Technical Architecture

Include an ASCII architecture diagram like:

┌───────────────┐  
│ CLIENT LAYER  │  
└──────┬────────┘  

Then define:
- Frontend architecture
- Backend microservices
- API layer
- Communication patterns

---

### 5. Agent System Design

Detail:
- Master orchestrator (ReAct-style loop)
- Task decomposition
- Sub-agent roles
- Human approval checkpoints

Also include:
- LLM routing strategy
- Prompt architecture
- RAG pipeline
- Failure handling

---

### 6. Data Architecture

Include:
- PostgreSQL (transactional)
- Vector DB (semantic search)
- Graph DB (knowledge graph)

Define:
- Schema philosophy
- Data pipelines
- Embeddings strategy
- Knowledge graph structure

---

### 7. Infrastructure & DevOps

Include:
- AWS-based architecture
- Kubernetes / containerization
- CI/CD pipeline
- Observability stack

Also include:
- Scaling strategy
- LLM cost optimization

---

### 8. Security, Privacy & Compliance Engineering

Cover:
- Auth (SSO, JWT)
- Encryption (at rest + in transit)
- Data privacy (GDPR-style)
- AI bias & fairness system
- Audit logs & explainability

---

### 9. Integrations & API Layer

Include:
- ATS integrations (e.g. Greenhouse, Workday)
- External APIs (LinkedIn, GitHub, etc.)
- Public API design

Example:

POST /v1/match  
GET /v1/benchmarks  

---

### 10. Engineering Milestones & Build Sequence

Break into:
- Year 1 → Foundation
- Year 2 → Scale
- Year 3 → Expansion

Include:
- Feature rollout sequence
- Platform evolution
- Technical maturity

---

## WRITING STYLE

- Think in **systems, not features**
- Be **specific, not generic**
- Use:
  - Tables
  - Structured bullets
  - Diagrams
- Avoid fluff
- Write like:
  - A senior engineer explaining to leadership
  - A founder pitching deep tech

---

## QUALITY BAR

Your output must feel like:
- A document from **Stripe / OpenAI / Palantir**
- Ready for:
  - Engineering execution
  - Investor diligence
  - Product roadmap alignment

---

## FINAL INSTRUCTION

---

## Table of Contents

1. Product Overview  
2. User Personas & Jobs-to-Be-Done  
3. Product Architecture — Feature Map  
4. Technical Architecture  
5. System / Intelligence Layer Design  
6. Data Architecture  
7. Infrastructure & DevOps  
8. Security, Privacy & Compliance Engineering  
9. Integrations & API Layer  
10. Engineering Milestones & Build Sequence  

---

## SECTION REQUIREMENTS

### 1. Product Overview
- Clearly define the product and its core purpose
- Position it appropriately:
  - As a **platform**, **system layer**, **tool**, or **infrastructure** (depending on concept)
- Explain the problem it solves and why it matters now
- Highlight key differentiators vs existing solutions in the market

Include a table:

| Surface / Component | Primary User | Purpose |

---

### 2. User Personas & Jobs-to-Be-Done
Create 3–4 detailed personas relevant to the product.

For each persona include:
- Profile (who they are)
- Jobs-to-be-done (what they are trying to accomplish)
- Pain points (current frustrations)
- Existing alternatives they use

Make personas realistic, domain-specific, and narrative-driven.

---

### 3. Product Architecture — Feature Map
Break the product into logical modules based on the concept.

Examples (adapt as needed):
- User-facing applications (web, mobile, dashboard)
- Core platform modules
- Shared services (analytics, communication, orchestration, etc.)

For each module include:
- What it does  
- How it works  
- Why it matters  

Focus on **end-to-end workflows**, not just features.

---

### 4. Technical Architecture

Include a high-level ASCII diagram such as:

┌───────────────┐  
│ CLIENT LAYER  │  
└──────┬────────┘  

Then define:

- Client layer (web, mobile, APIs)
- Backend architecture (monolith vs microservices)
- API gateway and routing
- Service communication (sync vs async)
- Real-time systems (if applicable)

---

### 5. System / Intelligence Layer Design

Adapt this section based on product type:

- If AI/agent-based → describe:
  - Orchestration layer
  - Agents / models / workflows
- If non-AI system → describe:
  - Core business logic engine
  - Rules engine / workflow engine / decision systems

Include:
- Task execution model
- System coordination logic
- Human-in-the-loop points (if applicable)
- Failure handling and retries

Optional (if relevant):
- LLM / model routing strategy  
- Prompt architecture  
- Retrieval / context systems  

---

### 6. Data Architecture

Define the data layer based on system needs:

- Primary database (e.g. relational)
- Secondary storage (if applicable):
  - Vector DB (semantic use cases)
  - Graph DB (relationship-heavy systems)
  - Data warehouse

Include:
- Data schema philosophy
- Data ingestion pipelines
- Processing & transformation
- Storage and retrieval patterns

---

### 7. Infrastructure & DevOps

Include:

- Cloud architecture (AWS / GCP / Azure or hybrid)
- Compute strategy (containers, serverless, VMs)
- CI/CD pipeline
- Environment separation (dev, staging, prod)

Also include:
- Scalability strategy
- Performance considerations
- Cost optimization approach

---

### 8. Security, Privacy & Compliance Engineering

Cover:

- Authentication & authorization (roles, access control)
- Encryption (data at rest and in transit)
- Data privacy approach (region-specific if needed)
- Compliance considerations (GDPR, SOC2, etc. where applicable)
- Audit logging and traceability

If applicable:
- Bias, fairness, or risk controls
- Explainability mechanisms

---

### 9. Integrations & API Layer

Define:

- Key integrations (third-party tools, data providers, platforms)
- Internal service APIs
- External/public API (if exposed)

Include example endpoints:

POST /v1/<resource>  
GET /v1/<resource>/metrics  

Explain:
- Authentication model
- Rate limiting
- Data flow between systems

---

### 10. Engineering Milestones & Build Sequence

Break into phases:

- Phase 1 → Foundation (MVP)
- Phase 2 → Scale (growth + robustness)
- Phase 3 → Expansion (platform + ecosystem)

Include:
- Feature rollout order
- Technical evolution
- Key inflection points

---

## WRITING STYLE

- Think in **systems, not isolated features**
- Be **specific and implementation-aware**
- Use:
  - Tables
  - Structured bullets
  - Diagrams
- Avoid fluff and vague language

Write like:
- A **senior engineer explaining system design**
- A **product leader defining architecture**
- A **founder preparing for technical diligence**

---

## QUALITY BAR

The output should feel like:
- An internal document from a **top-tier tech company**
- Ready for:
  - Engineering execution
  - Investor due diligence
  - Product roadmap alignment

---

## FINAL INSTRUCTION

Generate the **complete document in Markdown**, fully detailed, with no placeholders.