import type { CombinedCandidateResult } from "../phase-2/enrichment.types.js";
import type { DeliveryResult, DeliveryBatchReport } from "./mail.types.js";
/**
 * Phase 4 Coordinator (Mail Outreach Execution)
 *
 * Responsibilities:
 * 1. STEP 1: Sending emails one-by-one & filling information in mail templates
 * 2. STEP 2: Verifying delivery success status for each recipient
 * 3. STEP 3: Formatting execution metrics and presenting to the user
 * 4. STEP 4: Providing feedback summary and operational logs
 */
declare class phase4Class {
    /**
     * STEP 1 & 2: Sends outreach emails to all qualified candidates
     */
    sendOutreach(candidates: CombinedCandidateResult[]): Promise<DeliveryBatchReport>;
    /**
     * Dispatches an outreach email to a single candidate
     */
    sendSingle(candidate: CombinedCandidateResult): Promise<DeliveryResult>;
    /**
     * STEP 3: Formats and displays the delivery report
     */
    displaySummary(report: DeliveryBatchReport): void;
    /**
     * STEP 4: Logs feedback prompt and outcome confirmation
     */
    concludeCampaign(report: DeliveryBatchReport): void;
}
declare const _default: phase4Class;
export default _default;
//# sourceMappingURL=phase-4.d.ts.map