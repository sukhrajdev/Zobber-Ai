import { z } from "zod";
/**
 * Zod schema validating the AI candidate classification response
 */
export declare const AICandidateClassificationSchema: z.ZodObject<{
    role: z.ZodEnum<{
        founder: "founder";
        hr: "hr";
        other: "other";
    }>;
    isHiring: z.ZodBoolean;
    hiringRole: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reasoning: z.ZodOptional<z.ZodString>;
    confidence: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Zod schema validating the generated cold email response
 */
export declare const AIEmailOutputSchema: z.ZodObject<{
    subject: z.ZodString;
    body: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=ai.schema.d.ts.map