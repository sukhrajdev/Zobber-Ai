# Beginner's Guide: Understanding Jev & System One Models

> **A complete, zero-prerequisite guide to TypeSafe's Jev model, System One decision intelligence, and how it transforms Zobber AI.**

---

## 1. What is System One vs. Traditional LLMs?

To understand **Jev**, let's start with how traditional AI works and why it often frustrates developers.

### The Problem with Traditional LLMs (Generative AI)
Traditional LLMs (like GPT-4, Claude, or Gemini) are **text-generation machines**. They are trained to predict the next token (word) in a paragraph. 

When you want an LLM to make a simple decision in code (for example: *"Is this GitHub user an HR manager or a Founder?"*), you have to:
1. Write a complex prompt begging the model: *"Output ONLY valid JSON, do not include markdown or explanations"*.
2. Wait while the model slowly generates tokens one-by-one.
3. Parse the string output into JSON with `JSON.parse()`.
4. Pray that the model didn't hallucinate invalid keys, syntax errors, or markdown fences (` ```json `).
5. If the model is uncertain, it might guess with 100% false confidence.

```
Traditional Flow (Slow & Fragile):
[Your Code] ──Prompt──> [LLM Generates Text Token-by-Token] ──Raw Text String──> [JSON.parse()] ──Errors/Hallucinations?──> [Your Code]
```

---

### The System One Solution: Decision-First AI
The name **System One** comes from psychologist Daniel Kahneman's famous book *Thinking, Fast and Slow*:
- **System 1 (Fast & Intuitive)**: Quick, gut-check instinctive decisions.
- **System 2 (Slow & Deliberative)**: Complex multi-step reasoning, writing essays, or solving math.

**Jev** is the world's first **System One model**, developed by **TypeSafe AI** and hosted on **OpenRouter** (`typesafe/jev-1.13`).

Instead of writing text, Jev is trained specifically to **make structured decisions**:
- You send **State** (the data to evaluate, like a candidate's profile).
- You send **Questions** (typed primitives).
- Jev returns **Typed Answers + Mathematical Probabilities + Confidence** in a single parallel evaluation.
- **No text generation. No token streaming delays. No JSON parsing. No hallucinations.**

```
System One Flow (Fast & Type-Safe):
[Your Code] ──State + Typed Questions──> [Jev Decision Model] ──Typed Values + Probabilities + Confidence──> [Your Code Branches Directly]
```

---

## 2. Comparison: Traditional LLM vs. Jev

| Feature | Traditional LLM (GPT-4 / Gemini) | Jev (TypeSafe System One) |
| :--- | :--- | :--- |
| **Primary Goal** | Generate human-readable prose & conversation | Make calibrated software decisions |
| **Output Type** | Free-form text stream / strings | Strictly typed answers (`choice`, `score`, `noul`) |
| **Speed** | 1 to 5+ seconds (generates tokens one by one) | Ultra-fast (sub-second single-pass evaluation) |
| **Cost Model** | Pay for both input and output tokens | **Output tokens are FREE**; pay only for input |
| **Uncertainty** | Hallucinates or pretends to be sure | Returns exact **probability distributions** & **confidence** |
| **Parsing** | Requires regex, code fence strippers, Zod parse | Native typed structure returned directly |
| **Parallelism** | Questions sequential in prompt | All questions evaluated in parallel in one request |

---

## 3. The Core Concept: State + Questions

Every interaction with Jev requires two things:

### 1. `state`
The raw information to judge. This can be:
- A plain text string (e.g. `"GitHub user bio: Co-founder @ Acme, hiring distributed Elixir engineers"`).
- A JSON object (e.g. `{ "bio": "...", "company": "...", "followers": 140 }`).
- An array of context items.

### 2. `questions`
A dictionary of atomic questions you want Jev to answer about that state. You give each question an ID (like `role`, `is_hiring`, `seniority`). Jev answers each question independently and returns the answers under those exact keys.

---

## 4. The Three AI Primitives

Jev provides three specialized question types called **primitives**. You can mix and match all three in a single API call!

```
                  ┌─────────────── JEV PRIMITIVES ───────────────┐
                  │                                              │
         ┌────────┴────────┐            ┌────────┴────────┐     ┌┴───────────────┐
         │     Choice      │            │      Score      │     │      Noul      │
         ├─────────────────┤            ├─────────────────┤     ├────────────────┤
         │ Pick 1 option   │            │ Rate on an      │     │ Yes / No       │
         │ from a list     │            │ ordered rubric  │     │ boolean check  │
         │ (e.g. Founder   │            │ (e.g. Seniority │     │ (e.g. Is       │
         │ vs HR vs Other) │            │ 0 to 3)         │     │ Hiring?)       │
         └─────────────────┘            └─────────────────┘     └────────────────┘
```

---

### Primitive 1: Choice (Categorical Selection)
Use `Choice` when the answer must be picked from a fixed set of options (e.g. category, role, intent).

#### Request Example:
```json
{
  "state": "Co-founder & CTO at NextGen AI. Building autonomous agents. We are looking for lead backend engineers!",
  "questions": {
    "role": {
      "type": "choice",
      "instructions": "What is this user's primary professional role?",
      "criteria": {
        "founder": "Founder, Co-Founder, CEO, or C-level executive",
        "hr": "HR, Recruiter, Talent Acquisition, People Ops",
        "developer": "Individual contributor software engineer or designer",
        "other": "None of the above"
      }
    }
  }
}
```

#### What Comes Back:
```json
{
  "answers": {
    "role": {
      "type": "choice",
      "choice": "founder",
      "confidence": 0.94,
      "probabilities": {
        "founder": 0.95,
        "developer": 0.04,
        "hr": 0.01,
        "other": 0.00
      }
    }
  }
}
```

- **`choice`**: The winning option name (`"founder"`).
- **`probabilities`**: The probability for every option (sums to 1.0).
- **`confidence`**: A score from `0.0` (complete confusion) to `1.0` (absolute certainty).

---

### Primitive 2: Noul (Boolean / True-or-False)
Use `Noul` (named from "No / Yes") when you have a direct binary condition: *Is this true or false?*

#### Request Example:
```json
{
  "state": "Co-founder & CTO at NextGen AI. We are hiring founding engineers!",
  "questions": {
    "is_hiring": {
      "type": "noul",
      "instructions": "Is this person or company actively hiring?",
      "criteria": {
        "true": "Explicitly mentions hiring, looking for talent, open positions, or careers",
        "false": "No mention of hiring or looking for employees"
      }
    }
  }
}
```

#### What Comes Back:
```json
{
  "answers": {
    "is_hiring": {
      "type": "noul",
      "noul": 0.98
    }
  }
}
```

- **`noul`**: A floating point number between `0.0` (definitive NO) and `1.0` (definitive YES).
- A value of `0.5` means the model is completely unsure.
- You can check in code: `if (answers.is_hiring.noul > 0.8) { ... }`.

---

### Primitive 3: Score (Ordered Spectrum / Rubric)
Use `Score` when an answer is not just a label, but lies along an **ordered scale** (e.g. urgency from low to high, candidate fit, sentiment, seniority).

#### Request Example:
```json
{
  "state": "VP of Engineering with 12 years of experience managing 40+ engineers across infrastructure and cloud.",
  "questions": {
    "seniority": {
      "type": "score",
      "instructions": "How senior is this candidate in engineering leadership?",
      "criteria": [
        "Junior or Entry-level individual contributor",
        "Mid-level individual contributor",
        "Senior / Staff individual contributor",
        "Engineering Manager or Director",
        "Executive leadership (VP, CTO, Founder)"
      ]
    }
  }
}
```

#### What Comes Back:
```json
{
  "answers": {
    "seniority": {
      "type": "score",
      "score": 3.82,
      "confidence": 0.88,
      "probabilities": {
        "0": 0.0,
        "1": 0.0,
        "2": 0.05,
        "3": 0.08,
        "4": 0.87
      }
    }
  }
}
```

- **`score`**: A weighted position on the scale (here `3.82` out of `4.0`, landing right at Director/Executive level).
- **`confidence`**: Tells you if the rating was concentrated or spread across levels.

---

## 5. Understanding Confidence: "I Don't Know" is a Superpower

One of the greatest dangers of traditional LLMs is **uncalibrated overconfidence**. An LLM will invent a convincing lie rather than say *"I don't know"*.

Jev calculates a mathematical **confidence** metric ($0.0$ to $1.0$):
- **Concentrated probability** on one answer $\rightarrow$ **High Confidence** ($> 0.80$).
- **Split probability** across multiple answers $\rightarrow$ **Low Confidence** ($< 0.50$).

### How to use Confidence in Your Code (The 3-Tier Pattern):

```typescript
const roleAnswer = decision.answers.role;

if (roleAnswer.confidence >= 0.85) {
  // HIGH CONFIDENCE: Act automatically without hesitation
  proceedWithOutreach(candidate, roleAnswer.choice);

} else if (roleAnswer.confidence >= 0.50) {
  // MEDIUM CONFIDENCE: Safe to flag for quick manual review
  logForReview(candidate, roleAnswer.choice);

} else {
  // LOW CONFIDENCE: Jev is saying "I don't have enough data"
  skipCandidate(candidate, "Ambiguous role profile");
}
```

---

## 6. How Zobber AI Will Use Jev

In Zobber AI, our goal is to identify **Founders** and **HR professionals** on GitHub and find out if they are **hiring**, so we can generate tailored emails.

Instead of asking a slow, expensive LLM to analyze the profile and output JSON, we send the candidate's GitHub data to **Jev** in **ONE request**:

```typescript
const decision = await openrouter.alpha.decisions.create({
  decisionsRequest: {
    model: "typesafe/jev-1.13",
    state: {
      name: candidate.name,
      username: candidate.username,
      company: candidate.company,
      bio: candidate.bio,
      hireable: candidate.hireable,
      followers: candidate.followers
    },
    questions: {
      // 1. Role Classification (Choice)
      target_role: {
        type: "choice",
        instructions: "What is this person's role in the company?",
        criteria: {
          founder: "Founder, Co-Founder, CEO, CTO, or C-suite executive",
          hr: "Recruiter, HR Manager, Head of Talent, People Ops",
          other: "General developer, student, consultant, or unrelated"
        }
      },

      // 2. Hiring Status (Noul)
      is_hiring: {
        type: "noul",
        instructions: "Is this profile or company actively looking to hire or expand team?",
        criteria: {
          true: "Bio or company explicitly says hiring, looking for engineers, or expanding",
          false: "No hiring signals mentioned"
        }
      },

      // 3. Hiring Fit / Seniority (Score)
      decision_authority: {
        type: "score",
        instructions: "How high is this person's decision-making power for hiring?",
        criteria: [
          "No authority (individual contributor or intern)",
          "Low authority (peer developer)",
          "Direct hiring influence (recruiter or hiring manager)",
          "Ultimate hiring authority (founder, CEO, CTO)"
        ]
      }
    }
  }
});
```

### Why this is a 10x Improvement for Zobber AI:
1. **Speed**: Evaluates thousands of scraped profiles in minutes instead of hours.
2. **Deterministic Control**: Your code branches using standard `if (answers.target_role.choice === 'founder')`.
3. **No Parsing Failures**: No `try / catch (SyntaxError)` from invalid LLM JSON strings.
4. **Cost Optimization**: Jev output tokens are completely **free**! You only pay per input token.
5. **Generative Separation (SRP)**: Jev makes the decision (*"Is this an HR or Founder? Are they hiring?"*). Once verified, you only invoke a generative model for the qualified leads to write the personalized email.

---

## 7. Next Steps & Confirmation

Now that we understand:
1. What System One models are.
2. How Jev uses State and Primitives (`choice`, `noul`, `score`).
3. How OpenRouter exposes Jev via `openrouter.alpha.decisions.create`.

**Once you confirm, we will update `LLmService` to use Jev as the core decision engine for candidate classification in Zobber AI!**
