<div align="center">

# 🎓 SkillSetu AI

### The Closed-Loop Academia–Industry Intelligence Platform

**Bridging the gap between what industry needs and what students learn — with verified, data-driven proof at every step.**

[![SIH 2026](https://img.shields.io/badge/SIH%202026-Problem%20Statement%2026044-orange?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Production%20%26%20Evaluator%20Ready-brightgreen?style=for-the-badge)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-0%20Errors-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#)
[![Gemini](https://img.shields.io/badge/Gemini%202.5%20Flash-AI%20Copilot-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](#)

**[Live Demo](#) · [Problem Statement](#-the-problem) · [Architecture](#-technical-architecture) · [Features](#-feature-inventory) · [Get Started](#-getting-started)**

</div>

---

## 🌟 Overview

**SkillSetu AI** ("Skill Bridge") is an integrated four-sided ecosystem built for **SIH Problem Statement 26044**, connecting:

| 🧑‍🎓 Students | 🏢 Industry / Corporate Partners | 👨‍🏫 Academicians / Faculty | 🏛️ Academic Institutions |
|:---:|:---:|:---:|:---:|

Rather than functioning as another isolated student portal, SkillSetu closes the loop between **industry demand, academic curriculum, student skill development, and verified employment outcomes** — feeding every placement back into institutional intelligence so the system keeps getting smarter.

> *"SkillSetu doesn't just connect students to jobs. It creates a continuous feedback loop between industry demand, academic curriculum, student skills and employment outcomes."*

---

## 🎯 The Problem

Traditional higher-education systems suffer from a **closed-loop feedback deficit**:

- ⚡ Industry requirements evolve **faster** than academic curricula can adapt
- 📉 Students lack **objective, verifiable evidence** of their real skills
- 🔬 Faculty lack structured channels for **industrial R&D and professional growth**
- 🏫 Institutions lack **granular analytics** to detect skill gaps and launch targeted interventions

**SkillSetu AI solves this** by wiring all four stakeholders into a single, measurable, self-improving loop.

---

## 🔁 The Closed-Loop Model

```
 INDUSTRY DEMAND SIGNALS
          ↓
 INSTITUTIONAL GAP DETECTION
          ↓
   TARGETED INTERVENTIONS
          ↓
   STUDENT SKILL DEVELOPMENT
          ↓
   VERIFIED PLACEMENT OUTCOME
          ↓
   INSTITUTIONAL INTELLIGENCE  ─┐
          ↑                    │
          └────────────────────┘
```

**Demand → Diagnose → Develop → Match → Recruit → Verify → Measure → Improve.**

---

## 🏗️ Technical Architecture

| Layer | Technology |
|---|---|
| **Frontend** | React 18.3.1 · TypeScript 5.6 · Tailwind CSS 3.4 · Vite 6.0 |
| **Backend / API** | Node.js + Express (`server.ts`) |
| **Auth & Persistence** | Firebase Authentication + Cloud Firestore, with LocalStorage/in-memory fallback |
| **AI Layer** | Google GenAI SDK — Gemini 2.5 Flash, proxied server-side |
| **Matching & Scoring** | 100% deterministic mathematical engines (no LLM guesswork) |

### Production vs. Demo Mode

The app is engineered to run seamlessly in both a live production environment and a self-contained SIH showcase mode:

| Layer | 🚀 Production Mode | 🎬 Demo / SIH Mode |
|---|---|---|
| Authentication | Firebase Auth | Demo session + LocalStorage |
| Database | Cloud Firestore | Seeded LocalStorage data |
| Matching | Deterministic algorithm on live records | Same algorithm on benchmark data |
| AI Copilot | Gemini 2.5 Flash | Gemini + deterministic fallback |
| Documents | Firestore metadata + local file handling | Base64 / local simulation |
| Credentials | Firebase-backed | Mock / seeded verification data |

---

## 🧮 Matching & Scoring Engine

All matching, ranking, and scoring runs on **deterministic math** — Gemini is never permitted to invent or compute numerical match percentages, keeping every score explainable and auditable.

```
   STUDENT SKILL VECTOR
          ↓
   OPPORTUNITY SKILL SCHEMA
   (Required skills + Preferred skills)
          ↓
   DETERMINISTIC MATCH ENGINE
   0.70 × Required Match + 0.30 × Preferred Match + Bonuses
          ↓
   NORMALIZED 0–100% SCORE
          ↓
   EXPLAINABLE MATCH BREAKDOWN
   Matched Skills | Missing Critical Skills | Score
```

- **Student ↔ Opportunity:** weighted match on required/preferred skills, assessment evidence, and verified credentials — with alias normalization (`React.js` / `reactjs` / `React` all resolve to the same skill).
- **Faculty ↔ Industry:** matched on research-domain overlap, technical expertise, project requirements, experience, patent count, and proposed weekly hours.

---

## 🤖 Setu AI Copilot

```
 React Frontend
      │  POST /api/copilot/chat
      ▼
 Node.js / Express (server.ts)
      │  Server-side GenAI SDK
      ▼
 Gemini 2.5 Flash
```

- **Context-grounded** per persona — students get target role, verified skills, assessment scores and gaps; industry gets openings, applicants and cohort health; academicians get publications and collaborations; institutions get university-wide deficits and accreditation metrics.
- **Deterministic fallback:** if Gemini is unavailable (missing key, network issue, outage), `copilotService.ts` switches to a deterministic knowledge-base so the assistant never goes dark.

---

## 🧩 Feature Inventory

<details>
<summary><b>🧑‍🎓 Student Persona</b></summary>

- Readiness-gauge dashboard with applications, interviews & quick actions
- **Skill DNA** — five-axis competency vector + multi-step adaptive assessment
- **Skill Gap Analysis** — target-role benchmarking with delta percentages
- **AI Career Coach** — 30/60/90-day roadmap
- Deterministic **Opportunity Matching**
- **Internship Workspace** — weekly logs, milestones, mentor feedback, certificates
- **Application ATS** — Kanban/timeline tracking, interviews, offers
- **Secure Document Vault** — SHA-256 checksummed uploads
- **Career Passport** — consolidated, evidence-backed profile

</details>

<details>
<summary><b>🏢 Industry Persona</b></summary>

- Command Center — listings, applications, cohort health, faculty collaborations
- Searchable **Candidate Talent Pool** with deterministic matching
- Full **ATS** — postings, required/preferred skills, applicant stages
- **Internship Governance** — logs, milestones, performance scoring, credentials
- **Learning Programs** — certified micro-courses & workshops
- **Faculty Collaboration Hub** — consulting, R&D, FDP, sabbaticals

</details>

<details>
<summary><b>👨‍🏫 Academician Persona</b></summary>

- **Collaboration Marketplace** — research, FDP & consultancy opportunities
- **My Collaborations** pipeline: `Submitted → Under Review → Shortlisted → Approved → Active → Completed`
- **Faculty Passport** — publications, patents, domains, industry engagement
- **Curriculum Co-Design** — review skill deficits, co-author syllabus (OBE-aligned)

</details>

<details>
<summary><b>🏛️ Institution Persona</b></summary>

- Command Center — employability readiness, placements, skill deficit index
- **Demand vs. Readiness Matrix** — market hiring volume vs. assessment scores
- **Competency Heatmaps** across departments and branches
- **Intervention Center** — bootcamps, workshops, remedial programs
- **Accreditation & Placement Analytics** — progression, OBE attainment, salary distribution

</details>

---

## ✅ Problem Statement 26044 — Compliance Matrix

| Requirement | Status |
|---|:---:|
| Multi-tier Skill Assessment | ✅ **IMPLEMENTED** |
| Skill DNA & Gap Analysis | ✅ **IMPLEMENTED** |
| Digital Career Passport | ✅ **IMPLEMENTED** |
| Industry Internship Management | ✅ **IMPLEMENTED** |
| Placement ATS & Recruitment Pipeline | ✅ **IMPLEMENTED** |
| Faculty Sabbaticals / Collaborations | ✅ **IMPLEMENTED** |
| Faculty Passport & Matching | ✅ **IMPLEMENTED** |
| Curriculum Co-Design (OBE) | ✅ **IMPLEMENTED** |
| Institutional Demand vs. Readiness | ✅ **IMPLEMENTED** |
| Institutional Heatmaps & Action Center | ✅ **IMPLEMENTED** |
| Secure Document Vault | ✅ **IMPLEMENTED** |
| AI Career Coach & Copilot | ✅ **IMPLEMENTED** |

**Coverage: 100% · Architecture Health: Excellent · Security Status: High**

---

## 🗺️ End-to-End Lifecycles

**Placement & Recruitment**
```
Industry Posts Job → Matching Engine → Student Applies
   → Industry ATS → Interview → Evaluation → Offer
   → Student Accepts/Declines → Institutional Placement Analytics
```

**Internship Governance**
```
Industry Cohort → Student Enrollment → Weekly Logs → Mentor Review
   → Final Evaluation & Signoff → Verified Certificate → Career Passport
```

**Faculty Collaboration**
```
Industry R&D Topic → Faculty Proposal → Industry Review → Approval
   → Active Collaboration → Outcome Signoff → Faculty Passport
```

**Institutional Closed Loop**
```
Demand Signal → Skill Deficit → Institution Intervention → Assigned Lead
   → Post-Assessment → Skill Uplift Measurement → Updated Institutional Analytics
```

---

## 🏆 SIH 2026 — Nine-Step Evaluator Showcase Journey

An interactive guided tour (`SihDemoJourneyBanner.tsx` + `SihDemoCompletionModal.tsx`) walks evaluators through the entire ecosystem:

| # | Step | Route |
|---|---|---|
| 1 | Student Skill DNA | `/dashboard/student/skill-dna` |
| 2 | Adaptive Skill Assessment | `/dashboard/student/assessment` |
| 3 | Skill Gap & Roadmap | `/dashboard/student/skill-gap` |
| 4 | Secure Document Vault | `/dashboard/student/vault` |
| 5 | Deterministic Opportunity Match | `/dashboard/student/opportunities` |
| 6 | Industry ATS & Interview | `/dashboard/industry/applications` |
| 7 | Offer Acceptance & Placement | `/dashboard/student/applications` |
| 8 | Faculty–Industry Collaboration | `/dashboard/academician` |
| 9 | Institutional Closed Loop | `/dashboard/institution` |

---

## 🗄️ Data Architecture

```
/users/{uid}
├── Students
│   ├── assessments
│   ├── applications
│   ├── vault
│   └── interviews
├── Industry
│   ├── opportunities
│   ├── cohorts
│   ├── learningPrograms
│   └── candidates
├── Academicians
│   ├── proposals
│   ├── passport
│   └── FDP records
└── Institutions
    ├── analytics
    └── heatmaps
```

| Collection | Purpose | Persistence |
|---|---|---|
| `users` | Accounts & profiles | Firestore + LocalStorage fallback |
| `students` | Student profiles | Firestore + fallback |
| `students/.../assessments` | Assessment records | Firestore |
| `students/.../vault` | Document metadata | Firestore metadata, local/Base64 handling |
| `opportunities` | Jobs & internships | Firestore + seeded demo fallback |
| `applications` | Recruitment applications | Firestore + LocalStorage fallback |
| `collaborations` | Faculty–industry collaborations | Firestore + seeded demo fallback |
| `interventions` | Institutional interventions | Firestore + fallback |
| `learningPrograms` | Industry learning programs | Firestore + seeded demo fallback |

---

## 🔐 Security Architecture

- 🔑 **API Key Protection** — Gemini credentials never leave the server; no `VITE_` client exposure
- 🛂 **Role-Based Access** — each persona gets isolated routes and protected navigation
- 🧮 **Deterministic Scoring** — numerical match scores come from application logic, never an LLM
- 🧾 **Document Integrity** — SHA-256 digests provide tamper-evident verification

---

## 📁 Project Structure

```
/
├── server.ts
├── src/
│   ├── components/
│   │   ├── academician/
│   │   ├── industry/
│   │   ├── institution/
│   │   ├── student/
│   │   ├── copilot/
│   │   ├── layout/
│   │   └── showcase/
│   ├── context/
│   ├── services/
│   │   ├── authService.ts
│   │   ├── firestoreService.ts
│   │   ├── matchingService.ts
│   │   ├── collaborationMatchingService.ts
│   │   ├── copilotService.ts
│   │   └── placementService.ts
│   ├── types/
│   └── data/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A Firebase project (Auth + Firestore enabled)
- A Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd skillsetu-ai

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

> ⚠️ `GEMINI_API_KEY` must stay server-side only. Never expose it through a `VITE_` prefixed variable.

### Run

```bash
npm run dev       # start local dev server
npm run build     # production build (vite build + esbuild)
npm run typecheck # tsc --noEmit
```

---

## 🧪 Build & Quality Status

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ PASS — 0 errors, 0 warnings |
| Production bundle (`vite build` + esbuild) | ✅ PASS — clean `/dist` build |
| Automated tests | ⚠️ Not yet configured |

### Known Limitations
1. Google OAuth via `signInWithPopup` inside sandboxed iframes requires proper Firebase OAuth domain configuration — currently **unverified** at runtime.
2. Physical document binaries use browser-local Base64 data URLs rather than live cloud storage; Firestore stores metadata and SHA-256 verification data only.
3. External SIS/LMS integrations (Canvas, Moodle, Ellucian, etc.) are not yet connected.

---

## 🛣️ Roadmap to Production

| Priority | Improvement |
|:---:|---|
| 1 | 🧪 Automated testing — unit/integration coverage for matching, auth, placement, internships, documents, analytics |
| 2 | ☁️ Cloud file storage — migrate from Base64 to a production object storage service |
| 3 | 🔗 External SIS/LMS integration |
| 4 | 🔐 OAuth production verification across all deployment environments |
| 5 | ⚙️ CI/CD pipeline — Lint → Type Check → Tests → Build → Deploy |

---

## 💡 Why SkillSetu Wins

1. **Four-sided ecosystem** — not a student portal, a full academia–industry network
2. **True closed-loop architecture** — Demand → Gap → Training → Verification → Matching → Placement → Institutional Learning
3. **Explainable AI-assisted matching** — every score shows exactly which skills matched and which are missing
4. **End-to-end lifecycle coverage** — Assessment → Skill Gap → Learning → Internship → Recruitment → Interview → Offer → Placement → Career Passport
5. **Institutional intelligence** — universities get real-time visibility into deficits, department performance, demand, outcomes, and intervention effectiveness

---

## 📖 One-Line Definition

> **SkillSetu AI** is a closed-loop Academia–Industry platform that maps student skills against real industry demand, identifies and closes skill gaps, manages internships and recruitment, enables faculty–industry collaboration, and feeds verified placement outcomes back into institutional decision-making.

---

<div align="center">

### Built for **Smart India Hackathon 2026** · Problem Statement 26044

**Demand → Diagnose → Develop → Match → Recruit → Verify → Measure → Improve**

⭐ *If SkillSetu AI inspired you, consider starring the repo!* ⭐

</div>

---

<sub>This README is generated from the project's internal system audit and architecture documentation. Feature statuses reflect the project's own implementation report.</sub>
