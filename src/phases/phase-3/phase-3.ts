import aiService from "./ai.service.js";
import type { EnrichedCandidate } from "../phase-2/enrichment.types.js";
import type { AIEvaluationResult } from "./ai.types.js";

/**
 * Phase 3 Coordinator
 * Responsible for orchestrating candidate evaluation via LLM
 */
class phase3Class {
  async evaluateCandidate(candidate: EnrichedCandidate): Promise<AIEvaluationResult | null> {
    try {
      return await aiService.evaluateCandidate(candidate);
    } catch (err: any) {
      console.error(`[Phase 3] Error during candidate evaluation for @${candidate.username}: ${err.message}`);
      return null;
    }
  }

  async evaluateCandidates(candidates: EnrichedCandidate[]): Promise<Map<string, AIEvaluationResult>> {
    const results = new Map<string, AIEvaluationResult>();
    for (const candidate of candidates) {
      const evalResult = await this.evaluateCandidate(candidate);
      if (evalResult) {
        results.set(candidate.username, evalResult);
      }
    }
    return results;
  }
}

export default new phase3Class();
