import type { AICandidateClassification, AIEmailOutput, AIEvaluationResult } from "./ai.types.js";
import type { EnrichedCandidate } from "../phase-2/enrichment.types.js";
/**
 * AIService handles all Phase 3 AI operations:
 * 1. Executes Jev System One decision evaluation for rapid candidate role & hiring classification
 * 2. Generates personalized cold outreach emails for qualified leads (founders and HR leaders)
 */
declare class aiServiceClass {
    /**
     * Minimum confidence threshold required on Jev choice predictions
     */
    readonly confidenceThreshold: number;
    /**
     * Minimum Noul threshold required to declare active hiring intent
     */
    readonly hiringNoulThreshold: number;
    /**
     * STEP 1 - 3: Classify candidate role and hiring status using Jev System One model
     */
    classifyCandidate(candidate: EnrichedCandidate): Promise<AICandidateClassification | null>;
    /**
     * STEP 4: Send qualified candidate data to Writer AI for personalized outreach mail
     */
    generateOutreachEmail(candidate: EnrichedCandidate, classification: AICandidateClassification): Promise<AIEmailOutput | null>;
    /**
     * Complete Phase 3 pipeline: Classify via Jev + Generate Mail if role qualifies
     */
    evaluateCandidate(candidate: EnrichedCandidate): Promise<AIEvaluationResult | null>;
}
declare const _default: aiServiceClass;
export default _default;
//# sourceMappingURL=ai.service.d.ts.map