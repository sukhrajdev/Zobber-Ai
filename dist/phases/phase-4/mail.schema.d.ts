import { z } from "zod";
/**
 * Zod schema validating SMTP configuration parameters
 */
export declare const SmtpConfigSchema: z.ZodObject<{
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    secure: z.ZodDefault<z.ZodBoolean>;
    auth: z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, z.core.$strip>;
    from: z.ZodString;
    throttleMs: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Zod schema validating outgoing mail payload
 */
export declare const SendMailPayloadSchema: z.ZodObject<{
    to: z.ZodString;
    subject: z.ZodString;
    body: z.ZodString;
}, z.core.$strip>;
/**
 * Zod schema validating delivery result status
 */
export declare const DeliveryResultSchema: z.ZodObject<{
    username: z.ZodString;
    recipientEmail: z.ZodString;
    status: z.ZodEnum<{
        FAILED: "FAILED";
        SENT: "SENT";
        SKIPPED: "SKIPPED";
    }>;
    messageId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Zod schema validating batch outreach summary
 */
export declare const DeliveryBatchReportSchema: z.ZodObject<{
    totalProcessed: z.ZodNumber;
    successfulCount: z.ZodNumber;
    failedCount: z.ZodNumber;
    skippedCount: z.ZodNumber;
    results: z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        recipientEmail: z.ZodString;
        status: z.ZodEnum<{
            FAILED: "FAILED";
            SENT: "SENT";
            SKIPPED: "SKIPPED";
        }>;
        messageId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=mail.schema.d.ts.map