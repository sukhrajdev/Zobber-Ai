# Zobber AI

> **AI-powered GitHub outreach automation** — discovers HR leaders and founders on GitHub, classifies them with Jev System One intelligence, and sends personalised cold emails at scale.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter%20%2F%20Jev-purple)](https://openrouter.ai)

---

## What is Zobber AI?

Zobber AI is an open-source intelligence pipeline that:

1. **Discovers** GitHub user profiles matching your search keywords (e.g. "founder", "CTO", "head of hr").
2. **Enriches** each profile — fetching real name, bio, email, company, and social links.
3. **Classifies** candidates using **Jev System One** (a calibrated AI decision model) — determining role (`founder` / `hr` / `developer` / `other`) and whether they are currently hiring.
4. **Writes** a personalised cold outreach email for every qualified lead using a generative LLM.
5. **Sends** the email via Nodemailer with throttling and delivery tracking.

All in one automated pipeline triggered by a single command.

---

## Pipeline Overview

```
GitHub Search API
      │
      ▼
Phase 1 — Discovery
  Scrapes user profiles matching the search query.
  De-duplicates by GitHub user ID.
      │
      ▼
Phase 2 — Enrichment + Pre-filtering
  Fetches full profile (GET /users/{username}).
  Requires: public email OR twitter handle.
  Checks bio keywords (founder, hr, ceo, developer …).
      │
      ▼
Phase 3 — Jev AI Intelligence  ◀── (merged into Phase 2 pipeline)
  Jev System One classifies the candidate:
    • target_role  → Choice  (founder / hr / developer / other)
    • is_hiring    → Noul    (yes / no / unknown)
    • authority    → Score   (0.0 – 1.0 decision-making weight)
  If founder or hr → generates personalised outreach email.
      │
      ▼
Phase 4 — Cold Email Dispatch
  Sends emails via Nodemailer (SMTP).
  Throttles delivery (EMAIL_THROTTLE_MS + jitter).
  Logs per-recipient delivery status.
  Prints campaign summary report.
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| TypeScript | ≥ 7 |

Accounts required:
- [OpenRouter](https://openrouter.ai) — for Jev + generative LLM access
- GitHub — Personal Access Token (optional but recommended for higher rate limits)
- Any SMTP provider — Gmail, Outlook, SendGrid, Mailgun, etc.

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/sukhrajdev/Zobber-Ai.git
cd Zobber-Ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .sample.env .env
# Then open .env and fill in your real values
```

---

## Environment Variables

Copy `.sample.env` → `.env` and configure the following:

### OpenRouter / LLM

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENROUTER_API_TOKEN` | ✅ | — | Your OpenRouter API key |
| `JEV_MODEL` | ❌ | `typesafe/jev-1.13` | Jev System One model for classification |
| `OPENROUTER_GENERATIVE_MODEL` | ❌ | `openai/gpt-4o-mini` | Generative model for email writing |

### GitHub

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | ❌ (recommended) | GitHub PAT — increases API rate limit from 60 → 5000 req/hr |

### Search

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SEARCH_QUERY` | ❌ | `founder` | Keyword to search on GitHub |

### SMTP (Phase 4)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | ✅ | — | SMTP server hostname |
| `SMTP_PORT` | ❌ | `587` | SMTP port |
| `SMTP_SECURE` | ❌ | `false` | `true` for port 465 (SSL) |
| `SMTP_USER` | ✅ | — | SMTP login username |
| `SMTP_PASS` | ✅ | — | SMTP password or App Password |
| `EMAIL_FROM` | ✅ | — | Sender address shown to recipient |
| `EMAIL_THROTTLE_MS` | ❌ | `3000` | Delay between emails (ms) |

---

## Usage

```bash
# Build TypeScript
npm run build

# Run the pipeline
npm start

# Run with a custom search query
SEARCH_QUERY="head of engineering" npm start
```

The pipeline will:
1. Search GitHub for matching users
2. Enrich, pre-filter, and classify each user with Jev AI
3. Generate personalised emails for founders and HR profiles
4. Dispatch emails via your configured SMTP server
5. Print a campaign summary report

---

## Project Structure

```
Zobber-Ai/
├── src/
│   ├── index.ts                        ← Pipeline entry point
│   ├── phases/
│   │   ├── phase-1/                    ← GitHub discovery
│   │   │   ├── phase-1.ts
│   │   │   ├── discovery.service.ts
│   │   │   ├── discovery.schema.ts
│   │   │   └── discovery.types.ts
│   │   ├── phase-2/                    ← Enrichment + pre-filter (+ Phase 3 wiring)
│   │   │   ├── phase-2.ts
│   │   │   ├── enrichment.service.ts
│   │   │   ├── enrichment.schema.ts
│   │   │   └── enrichment.types.ts
│   │   ├── phase-3/                    ← Jev AI classification + email writer
│   │   │   ├── phase-3.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── ai.schema.ts
│   │   │   └── ai.types.ts
│   │   └── phase-4/                    ← Nodemailer outreach dispatch
│   │       ├── phase-4.ts
│   │       ├── mail.service.ts
│   │       ├── mail.schema.ts
│   │       └── mail.types.ts
│   ├── llm/
│   │   ├── openai.client.ts            ← OpenRouter SDK instance
│   │   └── llm.service.ts              ← Dual-engine LLM wrapper (Jev + generative)
│   ├── integrations/
│   │   └── mail/
│   │       ├── mail.client.ts          ← Nodemailer transporter wrapper
│   │       ├── mail.types.ts
│   │       └── mail.errors.ts
│   ├── prompts/
│   │   ├── candidate/classify.ts       ← Jev decision questions + state builder
│   │   └── email/generate.ts           ← Email writer system prompt
│   └── utils/
│       └── mail/index.ts               ← Template placeholder interpolator
├── docx/
│   ├── ReadMe.md                       ← Technical documentation
│   ├── artichecture.md                 ← System architecture design
│   ├── Flow.md                         ← Phase-by-phase flow documentation
│   ├── Jev-System-One-Guide.md         ← Jev AI beginner guide
│   └── Phase-4-System-Design.md        ← Phase 4 architectural blueprint
├── dist/                               ← Compiled JS output (git-ignored)
├── .sample.env                         ← Environment variable template
├── .env                                ← Your local secrets (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Architecture: Dual-Engine LLM Strategy

Zobber AI uses **two separate LLM engines** for two different responsibilities:

| Layer | Engine | Model | Purpose |
|-------|--------|-------|---------|
| **Decision Layer** | Jev System One | `typesafe/jev-1.13` | Binary classification of candidates — fast, calibrated, deterministic |
| **Generative Layer** | Chat Completion | `openai/gpt-4o-mini` | Personalised email copy generation |

This separation keeps classification **fast and measurable** (Jev returns confidence scores, not free-form text) while email writing remains **creative and personalised**.

---

## Jev System One — How it works

Jev is a **decision model**, not a text generator. Instead of producing prose, it answers structured questions:

- **Choice** — "Is this person a founder, hr, developer, or other?"
- **Noul** — "Are they currently hiring? (yes / no / unknown)"
- **Score** — "How much decision-making authority do they hold? (0.0–1.0)"

Each answer comes with a **confidence value**. Zobber AI uses confidence thresholds to filter low-quality classifications before spending tokens on email generation.

> See [`docx/Jev-System-One-Guide.md`](docx/Jev-System-One-Guide.md) for a full beginner walkthrough.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a pull request

---

## License

[MIT](LICENSE) — © 2024 sukhraj.dev
