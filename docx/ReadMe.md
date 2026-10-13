# Zobber AI

> **Intelligence-driven GitHub scraping, AI-powered founder & HR classification, and automated outreach pipeline.**

---

## 📌 Overview

**Zobber AI** is an open-source intelligence and outreach automation platform built with Node.js and TypeScript. It discovers potential founders, hiring managers, and HR professionals from public developer platforms (starting with GitHub), enriches their profile information, evaluates hiring intent and leadership roles using large language models via OpenRouter, and automates personalized cold outreach.

Zobber AI is engineered with clean **Object-Oriented Programming (OOP)**, strict adherence to the **Single Responsibility Principle (SRP)**, and strong typing with TypeScript and Zod.

---

## 🚀 Key Features

- **Phase 1: Candidate Discovery**: Targeted querying of GitHub's user search API with automatic exclusion of site administrators, non-individual entities, and duplicate records.
- **Phase 2: Profile Enrichment**: Deep extraction of profile metadata (`email`, `bio`, `company`, `location`, `hireable`, `twitter_username`, `followers`) with pre-filtering on contact availability and keyword signals.
- **Phase 3: AI Intelligence & Decision Engine**: OpenRouter-powered classification that determines candidate role (`founder` vs `hr`), evaluates active hiring status, and crafts personalized outreach emails validated via Zod schemas.
- **Phase 4: Mail Delivery & Tracking**: Reliable dispatch of personalized emails with delivery tracking, status formatting, and feedback collection.

---

## 🏗️ Architecture & Philosophy

The project follows strict **Single Responsibility Principle (SRP)** and class-based design:

```
src/
├── index.ts                     # Main Application Entry Point
├── interface/                   # Shared TypeScript Interfaces & Contracts
├── integrations/                # External API Integrations (Transport Layer)
│   ├── github/                  # GitHub API Client, Mappers, Error Handlers
│   ├── linkedin/                # LinkedIn Adapter (Future Extension)
│   └── mail/                    # Mail Service Adapter (SMTP/Resend/SendGrid)
├── phases/                      # Core Business Logic Workflow
│   ├── phase-1/                 # Phase 1: User Discovery (Search & De-duplication)
│   ├── phase-2/                 # Phase 2: User Enrichment (Profile Details & Filtering)
│   ├── phase-3/                 # Phase 3: AI Intelligence (LLM Classification & Email Generation)
│   └── phase-4/                 # Phase 4: Mail Dispatch & Feedback
├── llm/                         # LLM Provider Clients & Structured Output Handlers
├── prompts/                     # Structured LLM Prompts (Candidate Analysis & Email Generation)
└── utils/                       # Shared Utilities (Zod Helpers, Mail Formatters)
```

For a comprehensive technical breakdown, see:
- 📖 [System Architecture](artichecture.md)
- 🔄 [Detailed Execution Flow & Phases](Flow.md)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20+ recommended, ESM native)
- **Language**: TypeScript (`moduleResolution: nodenext`, strict mode)
- **Validation**: Zod (runtime validation and schema inference)
- **AI/LLM**: OpenRouter SDK (`@openrouter/sdk`)
- **Environment**: Dotenv (`dotenv`)

---

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js (v20 or higher)
- npm or pnpm
- Valid API Keys:
  - `OPENROUTER_API_TOKEN` (for AI classification and generation)
  - `GITHUB_TOKEN` (recommended for higher GitHub API rate limits)
  - SMTP Credentials / Mail Provider Token (for Phase 4 delivery)

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# OpenRouter LLM API Key
OPENROUTER_API_TOKEN=your_openrouter_token_here

# GitHub Personal Access Token (Optional but recommended for rate limits)
GITHUB_TOKEN=your_github_token_here

# Mailer Configuration (Phase 4)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=outreach@example.com
SMTP_PASS=your_email_password
EMAIL_FROM="Zobber AI <outreach@example.com>"
```

### 3. Installation & Compilation

```bash
# Install dependencies
npm install

# Build the TypeScript project
npm run build

# Run the compiled application
npm start
```

---

## 🤝 Development & Collaboration Protocol

To maintain high code quality and prevent regressions, all work on Zobber AI adheres to the following workflow:

1. **System Design & Task Assignment**: Tasks are defined and handed over by the product lead.
2. **Review & Questioning**: The developer reviews the design, clarifies ambiguities, and requests approval before installing new dependencies or handling sensitive data.
3. **Strict SRP & Class Form**: All code must be written in modular classes with single responsibilities.
4. **Local Verification**: The developer builds and verifies code locally without pushing to remote.
5. **Lead Review & Push**: The product lead tests the implementation, provides feedback, and handles git commits and pushes.

---

## 📄 License

This project is licensed under the MIT License.
