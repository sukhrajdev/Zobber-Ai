import llmService from "../../llm/llm.service.js";
import { AIEmailOutputSchema } from "./ai.schema.js";
import type { AICandidateClassification, AIEmailOutput, AIEvaluationResult } from "./ai.types.js";
import type { EnrichedCandidate } from "../phase-2/enrichment.types.js";
import { CANDIDATE_JEV_QUESTIONS, buildCandidateState } from "../../prompts/candidate/classify.js";
import { EMAIL_WRITER_SYSTEM_PROMPT, buildEmailWriterPrompt } from "../../prompts/email/generate.js";
import type { DecisionsChoiceAnswer, DecisionsNoulAnswer, DecisionsScoreAnswer } from "@openrouter/sdk/models";

/**
 * AIService handles all Phase 3 AI operations:
 * 1. Executes Jev System One decision evaluation for rapid candidate role & hiring classification
 * 2. Generates personalized cold outreach emails for qualified leads (founders and HR leaders)
 */
class aiServiceClass {
  /**
   * Minimum confidence threshold required on Jev choice predictions
   */
  readonly confidenceThreshold: number = 0.50;

  /**
   * Minimum Noul threshold required to declare active hiring intent
   */
  readonly hiringNoulThreshold: number = 0.65;

  /**
   * STEP 1 - 3: Classify candidate role and hiring status using Jev System One model
   */
  async classifyCandidate(candidate: EnrichedCandidate): Promise<AICandidateClassification | null> {
    try {
      const state = buildCandidateState(candidate);

      const answers = await llmService.makeDecisions({
        state,
        questions: CANDIDATE_JEV_QUESTIONS
      });

      if (!answers) {
        console.warn(`[Phase 3 AI] Jev decisions returned null for @${candidate.username}`);
        return null;
      }

      const roleAnswer = answers["target_role"] as DecisionsChoiceAnswer | undefined;
      const hiringAnswer = answers["is_hiring"] as DecisionsNoulAnswer | undefined;
      const authorityAnswer = answers["decision_authority"] as DecisionsScoreAnswer | undefined;

      if (!roleAnswer || roleAnswer.type !== "choice") {
        console.warn(`[Phase 3 AI] Missing or invalid target_role answer from Jev for @${candidate.username}`);
        return null;
      }

      const rawChoice = roleAnswer.choice;
      const role: "founder" | "hr" | "other" =
        rawChoice === "founder" || rawChoice === "hr" ? rawChoice : "other";

      const confidence = roleAnswer.confidence ?? 0;

      // Filter out low confidence classifications
      if (confidence < this.confidenceThreshold && role !== "other") {
        console.log(
          `[Phase 3 AI] Low confidence (${confidence.toFixed(2)}) for @${candidate.username}. Demoting to 'other'.`
        );
      }

      const isHiring = Boolean(hiringAnswer && hiringAnswer.type === "noul" && hiringAnswer.noul >= this.hiringNoulThreshold);

      const hiringNoulScore = hiringAnswer && hiringAnswer.type === "noul" ? hiringAnswer.noul : 0;
      const authorityScore = authorityAnswer && authorityAnswer.type === "score" ? authorityAnswer.score : 0;

      const reasoning = `Jev System One: role='${role}' (conf=${confidence.toFixed(2)}), isHiring=${isHiring} (noul=${hiringNoulScore.toFixed(2)}), authorityScore=${authorityScore.toFixed(2)}`;

      const classification: AICandidateClassification = {
        role,
        isHiring,
        hiringRole: isHiring
          ? (candidate.company ? `roles at ${candidate.company}` : "engineering talent")
          : null,
        confidence,
        reasoning
      };

      return classification;
    } catch (error: any) {
      console.error(`[Phase 3 AI] Classification failed for @${candidate.username}: ${error.message}`);
      return null;
    }
  }

  /**
   * STEP 4: Send qualified candidate data to Writer AI for personalized outreach mail
   */
  async generateOutreachEmail(
    candidate: EnrichedCandidate,
    classification: AICandidateClassification
  ): Promise<AIEmailOutput | null> {
    try {
      const userPrompt = buildEmailWriterPrompt(candidate, classification);
      const emailOutput = await llmService.generateJson<AIEmailOutput>({
        systemPrompt: EMAIL_WRITER_SYSTEM_PROMPT,
        userPrompt,
        schema: AIEmailOutputSchema
      });

      return emailOutput;
    } catch (error: any) {
      console.error(`[Phase 3 AI] Email generation failed for @${candidate.username}: ${error.message}`);
      return null;
    }
  }

  /**
   * Complete Phase 3 pipeline: Classify via Jev + Generate Mail if role qualifies
   */
  async evaluateCandidate(candidate: EnrichedCandidate): Promise<AIEvaluationResult | null> {
    const classification = await this.classifyCandidate(candidate);
    if (!classification) {
      return null;
    }

    // Only generate outreach emails for founders and HR leaders
    if (classification.role !== "founder" && classification.role !== "hr") {
      return {
        classification
      };
    }

    const mail = await this.generateOutreachEmail(candidate, classification);
    return {
      classification,
      ...(mail ? { mail } : {})
    };
  }
}

export default new aiServiceClass();
