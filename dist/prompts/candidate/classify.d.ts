import type { EnrichedCandidate } from "../../phases/phase-2/enrichment.types.js";
import type { DecisionsChoiceQuestion, DecisionsNoulQuestion, DecisionsScoreQuestion } from "@openrouter/sdk/models";
/**
 * Question suite for Jev (TypeSafe System One decision model)
 */
export interface CandidateEvaluationQuestions {
    [k: string]: DecisionsChoiceQuestion | DecisionsNoulQuestion | DecisionsScoreQuestion;
    target_role: DecisionsChoiceQuestion;
    is_hiring: DecisionsNoulQuestion;
    decision_authority: DecisionsScoreQuestion;
}
/**
 * Standard Jev question suite for candidate profiling
 */
export declare const CANDIDATE_JEV_QUESTIONS: CandidateEvaluationQuestions;
/**
 * Prepares the clean structured state payload sent to Jev
 */
export declare function buildCandidateState(candidate: EnrichedCandidate): Record<string, any>;
//# sourceMappingURL=classify.d.ts.map