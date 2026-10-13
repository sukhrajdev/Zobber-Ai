import type { z } from "zod";
import type { AICandidateClassificationSchema, AIEmailOutputSchema } from "./ai.schema.js";
/**
 * Result of the AI candidate classification analysis
 */
export type AICandidateClassification = z.infer<typeof AICandidateClassificationSchema>;
/**
 * Result of the AI email generation
 */
export type AIEmailOutput = z.infer<typeof AIEmailOutputSchema>;
/**
 * Complete evaluation result from Phase 3 AI service
 */
export interface AIEvaluationResult {
    classification: AICandidateClassification;
    mail?: AIEmailOutput;
}
//# sourceMappingURL=ai.types.d.ts.map