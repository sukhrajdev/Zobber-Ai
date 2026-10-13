import type { EnrichedCandidate } from "../phase-2/enrichment.types.js";
import type { AIEvaluationResult } from "./ai.types.js";
/**
 * Phase 3 Coordinator
 * Responsible for orchestrating candidate evaluation via LLM
 */
declare class phase3Class {
    evaluateCandidate(candidate: EnrichedCandidate): Promise<AIEvaluationResult | null>;
    evaluateCandidates(candidates: EnrichedCandidate[]): Promise<Map<string, AIEvaluationResult>>;
}
declare const _default: phase3Class;
export default _default;
//# sourceMappingURL=phase-3.d.ts.map