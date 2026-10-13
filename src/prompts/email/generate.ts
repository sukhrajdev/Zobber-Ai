import type { EnrichedCandidate } from "../../phases/phase-2/enrichment.types.js";
import type { AICandidateClassification } from "../../phases/phase-3/ai.types.js";

export const EMAIL_WRITER_SYSTEM_PROMPT = `You are a world-class executive talent outreach copywriter for Zobber AI.
Your objective is to write hyper-personalized, concise, professional, and high-converting cold outreach emails to founders and HR talent leaders.

CRITICAL GUIDELINES:
1. Tone must be respectful, genuine, authentic, and direct. Avoid generic marketing fluff or pushy sales jargon.
2. Tailor the angle depending on whether the recipient is a "founder" (focus on scaling their team, saving engineering time, shipping faster) or "hr" (focus on vetted talent pipelines, reducing time-to-hire, high-caliber engineering candidates).
3. The response MUST be a valid JSON object only, matching:
{
  "subject": string,
  "body": string
}
4. The body must include placeholder variables like {name}, {company}, and {hiringRole} filled or clearly formatted.
`;

export function buildEmailWriterPrompt(
  candidate: EnrichedCandidate,
  classification: AICandidateClassification
): string {
  return `Write a personalized outreach email for the following candidate:

Candidate Name: ${candidate.name}
Target Company: ${candidate.company ?? "your company"}
Target Role: ${classification.role === "founder" ? "Founder / Executive" : "Talent Acquisition / HR"}
Active Hiring Status: ${classification.isHiring ? "Actively Hiring" : "General Team Expansion"}
Target Hiring Role: ${classification.hiringRole ?? "engineering talent"}
Candidate Bio / Context: "${candidate.bio}"

Return the result strictly as JSON:
{
  "subject": "...",
  "body": "..."
}`;
}
