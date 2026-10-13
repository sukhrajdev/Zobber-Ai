import type { z } from "zod";
import type { SmtpConfigSchema, SendMailPayloadSchema, DeliveryResultSchema, DeliveryBatchReportSchema } from "./mail.schema.js";
export type SmtpConfig = z.infer<typeof SmtpConfigSchema>;
export type SendMailPayload = z.infer<typeof SendMailPayloadSchema>;
export type DeliveryResult = z.infer<typeof DeliveryResultSchema>;
export type DeliveryBatchReport = z.infer<typeof DeliveryBatchReportSchema>;
//# sourceMappingURL=mail.types.d.ts.map