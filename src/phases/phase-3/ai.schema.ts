import { z } from "zod";

/**
 * Zod schema validating the AI candidate classification response
 */
export const AICandidateClassificationSchema = z.object({
  role: z.enum(["founder", "hr", "other"]),
  isHiring: z.boolean(),
  hiringRole: z.string().nullable().optional(),
  reasoning: z.string().optional(),
  confidence: z.number().min(0).max(1).optional()
});

/**
 * Zod schema validating the generated cold email response
 */
export const AIEmailOutputSchema = z.object({
  subject: z.string().min(1, "Email subject is required"),
  body: z.string().min(1, "Email body is required")
});
