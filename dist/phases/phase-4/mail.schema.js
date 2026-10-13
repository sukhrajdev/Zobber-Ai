import { z } from "zod";
/**
 * Zod schema validating SMTP configuration parameters
 */
export const SmtpConfigSchema = z.object({
    host: z.string().min(1, "SMTP host is required"),
    port: z.number().int().positive().default(587),
    secure: z.boolean().default(false),
    auth: z.object({
        user: z.string().min(1, "SMTP user is required"),
        pass: z.string().min(1, "SMTP password is required")
    }),
    from: z.string().min(1, "From email address is required"),
    throttleMs: z.number().int().min(500).default(3000)
});
/**
 * Zod schema validating outgoing mail payload
 */
export const SendMailPayloadSchema = z.object({
    to: z.string().email("Valid recipient email is required"),
    subject: z.string().min(1, "Email subject is required"),
    body: z.string().min(1, "Email body is required")
});
/**
 * Zod schema validating delivery result status
 */
export const DeliveryResultSchema = z.object({
    username: z.string(),
    recipientEmail: z.string(),
    status: z.enum(["SENT", "FAILED", "SKIPPED"]),
    messageId: z.string().optional(),
    timestamp: z.string(),
    error: z.string().optional()
});
/**
 * Zod schema validating batch outreach summary
 */
export const DeliveryBatchReportSchema = z.object({
    totalProcessed: z.number(),
    successfulCount: z.number(),
    failedCount: z.number(),
    skippedCount: z.number(),
    results: z.array(DeliveryResultSchema),
    startTime: z.string(),
    endTime: z.string()
});
//# sourceMappingURL=mail.schema.js.map