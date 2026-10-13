import type { z } from "zod";
import type { DecisionsChoiceQuestion, DecisionsNoulQuestion, DecisionsScoreQuestion, Answers } from "@openrouter/sdk/models";
/**
 * LLmService manages:
 * 1. System One Decision Intelligence via Jev (typesafe/jev-1.13)
 * 2. Generative text and structured JSON completions for copywriting
 */
declare class LLmService {
    readonly jevModel: string;
    readonly generativeModel: string;
    /**
     * Helper to strip markdown code blocks from LLM output
     */
    private cleanJsonString;
    /**
     * Executes a System One decision request via Jev on OpenRouter
     * Fast, calibrated, parallel evaluation with zero token generation latency
     */
    makeDecisions<TQuestions extends Record<string, DecisionsChoiceQuestion | DecisionsNoulQuestion | DecisionsScoreQuestion>>(options: {
        state: string | Record<string, any> | Array<any>;
        questions: TQuestions;
        model?: string;
    }): Promise<{
        [k: string]: Answers;
    } | null>;
    /**
     * Generates text via chat completion (used for generative tasks like writing)
     */
    generateText(options: {
        systemPrompt: string;
        userPrompt: string;
        model?: string;
    }): Promise<string | null>;
    /**
     * Generates structured JSON from generative models with Zod validation
     */
    generateJson<T>(options: {
        systemPrompt: string;
        userPrompt: string;
        schema?: z.ZodType<T>;
        model?: string;
    }): Promise<T | null>;
    /**
     * Preserved legacy prototype to maintain backward compatibility
     */
    llmService(): Promise<import("@openrouter/sdk/models").DecisionsResponse | null>;
}
declare const _default: LLmService;
export default _default;
//# sourceMappingURL=llm.service.d.ts.map