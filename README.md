# Drishti (দৃষ্টি) — Civic Infrastructure & Scheme Monitoring Platform

> A serene, accessible, full-stack civic infrastructure monitoring, scheme intelligence, and decentralised planning platform tailored for Assam and North East India.

---

## Overview

**Drishti** bridges the gap between public works transparency and citizen empowerment. Designed with an editorial, airy aesthetic and powered by a robust Next.js 15 App Router backend, Drishti enables citizens, civic inspectors, and administrators to track projects, verify infrastructure milestones with geospatial geotagging, audit fund disbursements, and query local public schemes via **Sahay AI (সহায়)**.

---

## Key Features

- **Decentralised Civic Dashboard**: Live district-level metrics for Assam (Darrang, Dhubri, Jorhat, Lakhimpur, Kamrup, Majuli, etc.) tracking physical vs. financial progress, inspection milestones, and contractor accountability.
- **Milestone & Asset Verification**: Public verification portal (`/verify`, `/asset/[id]`) with GPS radius validation, cryptographic photo hashing, and audit trails.
- **Multilingual Support (4 Languages)**: Seamless instant switching between **English**, **অসমীয়া (Assamese)**, **हिन्दी (Hindi)**, and **বাংলা (Bengali)**.
- **Inclusive Accessibility Suite (WCAG 2.2 AA+)**: Real-time high-contrast toggles, text scaling, OpenDyslexic dyslexia-friendly typography, keyboard-friendly focus indicators, and screen reader announcements.
- **Sahay AI (সহায়)**: Multilingual contextual AI assistant providing real-time queries over schemes, budgets, public notices, and district progress with graceful multi-model failover (NVIDIA, Gemini, Ollama, or intelligent local rule heuristics).
- **Public Notices & Grievance Redressal**: Direct access to tender notices, administrative sanctions, and citizen grievance submission with status tracking.
- **Enterprise-Grade Security (OWASP ASVS)**:
  - AES-256-GCM data encryption
  - Zod request schema validation
  - Strict Content Security Policy (CSP) & HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `HSTS`)
  - Role-Based Access Control (RBAC) with secure session handling

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS, CSS Custom Properties, Lucide Icons
- **Database & ORM**: SQLite / PostgreSQL with Prisma ORM
- **Testing**: Vitest (255 unit, integration, security, and accessibility tests)
- **AI Engine**: Sahay AI with OpenAI-compatible / Gemini / Ollama adapter & local fallback

---

## Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Zadrboi/govt-schemes.git
cd govt-schemes

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your database and AI provider variables as needed:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secure-random-32-byte-hex-secret"

# Optional Sahay AI Providers
AI_PROVIDER="nvidia" # or "gemini" / "ollama" / "heuristic"
NVIDIA_API_KEY="your-nvidia-api-key"
NVIDIA_BASE_URL="https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL="meta/llama-3.3-70b-instruct"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client and push schema
npx prisma db push

# Seed initial Assam infrastructure data & schemes
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Gates

Run the automated test suites:
```bash
# Run all 255 unit, security, and integration tests
npx vitest run

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint
npm run lint

# Run production build
npm run build
```

---

## License

This project is licensed under the MIT License.
