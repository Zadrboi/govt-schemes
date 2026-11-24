================================================================================

DRISHTI (দৃষ্টি)

Transparent Public Scheme Monitoring & Physical-Financial Reconciliation Platform

================================================================================



Drishti is a full-stack civic intelligence and public transparency platform

designed to track decentralized development schemes across Assam from financial

sanction to on-ground physical completion. Built with a clean, high-legibility

editorial interface, offline-first field verification, explainable anomaly

detection, and multilingual AI assistance, Drishti bridges the gap between

citizens, field inspectors, and district auditors.





--------------------------------------------------------------------------------

1. CORE CAPABILITIES & PAGES

--------------------------------------------------------------------------------

- Overview & Impact Landing (/)

  Presents live reconciliation metrics, the three-stage scheme lifecycle (Plan &

  Sanction, Field Verification, Explainable Audit), and Assam infrastructure

  highlights.



- Role-Based Workspace Dashboard (/dashboard)

  Tailored views for Citizens, Officials, and Auditors featuring an interactive

  GIS scheme progress map and a physical-financial reconciliation ledger.



- Public Transparency Asset Card (/asset/[id])

  Scannable QR audit view displaying geo-tagged site photography, milestone

  verification timelines, sanctioned vs. disbursed funds, and tamper-evident

  audit hashes.



- Offline-First Field Verification (/verify)

  Low-bandwidth capture tool with GPS coordinate locking, client-side image

  compression, structured site checklists, and a local-first sync queue for

  remote blocks.



- Notices & Scheme Circulars (/notices)

  Searchable, filterable editorial feed of public circulars, audit schedules,

  and scheme deadlines with a distraction-free notice reader.



- Interactive Scheme Eligibility Checker (/eligibility)

  Guided three-step eligibility matcher with plain-language qualification

  breakdowns and required document checklists.



- Shared Transport & Civic Access Directory (/directory)

  Searchable map-and-card directory of ASTC transit hubs, Brahmaputra ferry

  ghats, block offices, and RTPS citizen facilitation centers across Assam.



- Explainable Intelligence & Insights (/insights)

  District-level financial vs. physical variance analytics and plain-English

  anomaly explanations ("Why this was flagged").



- Sahay AI Multilingual Assistant

  Persistent global assistant supporting English, Assamese (অসমীয়া), Hindi

  (हिन्दी), and Bengali (বাংলা) with route-aware context and

  database-grounded answers.





--------------------------------------------------------------------------------

2. ACCESSIBILITY & INCLUSIVE DESIGN

--------------------------------------------------------------------------------

Drishti adheres to WCAG 2.2 AA+ standards across every route:

- Dual Editorial Blue Theme: Seamless Light and Dark modes with persistent

  localStorage state and zero-flash hydration.

- Live Accessibility Controls: Global toolbar offering dynamic text scaling

  (85% to 150%+), High-Contrast mode, WCAG 1.4.12 enhanced text spacing, link

  underlining, Reduce Motion (prefers-reduced-motion aware), and keyboard

  Skip-to-Content navigation.

- Instant 4-Language UI Switching: Real-time interface translation across

  English, Assamese, Hindi, and Bengali.





--------------------------------------------------------------------------------

3. TECH STACK & SECURITY

--------------------------------------------------------------------------------

- Frontend: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, GSAP,

  Lenis, Lucide Icons

- Backend & Database: Next.js Route Handlers, Prisma ORM, SQLite (local

  development) / PostgreSQL (production)

- AI Integration: Configurable LLM provider layer supporting NVIDIA NIM,

  Google Gemini, and local Ollama

- Security (OWASP ASVS): Server-side Role-Based Access Control (RBAC), Zod

  schema validation on all endpoints, HttpOnly / SameSite session management,

  rate limiting, security headers, and structured audit logging

- Testing: Vitest unit and integration test suite





--------------------------------------------------------------------------------

4. GETTING STARTED

--------------------------------------------------------------------------------

Prerequisites:

- Node.js 20+ and npm

- Optional: PostgreSQL (defaults to local SQLite file:./dev.db) or Ollama for

  local AI inference



Step 1: Clone & Install

  git clone https://github.com/<YOUR_GITHUB_USERNAME>/government-schemes-repository.git

  cd government-schemes-repository

  npm install



Step 2: Environment Configuration

  cp .env.example .env.local



Update .env.local with your database URL, auth secret, and preferred AI

provider ("nvidia", "gemini", or "ollama"):

  DATABASE_URL="file:./dev.db"

  AUTH_SECRET="your-secure-random-secret"

  AI_PROVIDER="nvidia"

  NVIDIA_API_KEY="your-api-key"



Step 3: Database Setup

  npx prisma generate

  npx prisma db push

  npx prisma db seed



Step 4: Run Development Server & Tests

  npm run dev             # Start local server at http://localhost:3000

  npx tsc --noEmit        # Run TypeScript typechecking

  npm run lint            # Run ESLint

  npm test                # Run automated Vitest suite





--------------------------------------------------------------------------------

5. PROJECT STRUCTURE

--------------------------------------------------------------------------------

  prisma/          Prisma schema, migrations, and seed scripts

  public/images/   Curated Assam infrastructure & civic photography + CREDITS.md

  src/app/         Next.js App Router pages & REST API endpoints

  src/components/  Global navbar, theme/a11y/language providers & Sahay AI bot

  src/lib/         Prisma client, RBAC, Zod validators, i18n & AI services

  tests/           Automated Vitest suite

  .env.example     Environment variable template

  package.json     Project dependencies and scripts





--------------------------------------------------------------------------------

6. MEDIA ATTRIBUTION

--------------------------------------------------------------------------------

All regional photographs in public/images/ depict authentic locations and

public infrastructure across Assam, sourced under Creative Commons licenses

from Wikimedia Commons. Full file attributions are documented in:

  public/images/CREDITS.md
