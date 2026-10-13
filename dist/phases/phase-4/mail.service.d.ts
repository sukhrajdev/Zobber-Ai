import type { CombinedCandidateResult } from "../phase-2/enrichment.types.js";
import type { DeliveryResult, DeliveryBatchReport } from "./mail.types.js";
/**
 * MailService handles Phase 4 business logic:
 * 1. Validating candidate contact channel (public email)
 * 2. Dynamic template variable interpolation
 * 3. Anti-spam sequential throttling with jitter
 * 4. Dispatch verification and telemetry aggregation
 */
declare class mailServiceClass {
    private baseThrottleMs;
    constructor();
    /**
     * Helper delay introducing anti-spam throttling with randomized jitter
     */
    private sleepWithJitter;
    /**
     * Step 1 & 2: Sends a personalized email to an individual candidate
     */
    sendCandidateEmail(candidate: CombinedCandidateResult): Promise<DeliveryResult>;
    /**
     * Dispatches a batch of candidates sequentially with throttling
     */
    sendBatch(candidates: CombinedCandidateResult[], onProgress?: (result: DeliveryResult, index: number, total: number) => void): Promise<DeliveryBatchReport>;
}
declare const _default: mailServiceClass;
export default _default;
//# sourceMappingURL=mail.service.d.ts.map