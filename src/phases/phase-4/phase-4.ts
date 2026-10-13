import mailService from "./mail.service.js";
import mailClient from "../../integrations/mail/mail.client.js";
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
class phase4Class {
  /**
   * STEP 1 & 2: Sends outreach emails to all qualified candidates
   */
  public async sendOutreach(candidates: CombinedCandidateResult[]): Promise<DeliveryBatchReport> {
    console.log(`\n==================================================`);
    console.log(`🚀 [Phase 4] Initiating Cold Outreach Campaign`);
    console.log(`👥 Total Qualified Leads in Queue: ${candidates.length}`);
    console.log(`==================================================\n`);

    if (candidates.length === 0) {
      console.log(`[Phase 4] No candidates provided for outreach.`);
      return {
        totalProcessed: 0,
        successfulCount: 0,
        failedCount: 0,
        skippedCount: 0,
        results: [],
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      };
    }

    // Check transporter readiness
    if (!mailClient.isConfigured()) {
      console.warn(`[Phase 4] Warning: SMTP transporter is not configured.`);
      console.warn(`[Phase 4] Ensure SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_FROM are set in your .env file.`);
    } else {
      try {
        console.log(`[Phase 4] Verifying SMTP connection with mail server...`);
        await mailClient.verifyConnection();
        console.log(`[Phase 4] ✅ SMTP connection verified successfully.`);
      } catch (connError: any) {
        console.error(`[Phase 4] ❌ SMTP Connection failed: ${connError.message}`);
      }
    }

    // Execute Step 1 & 2
    const batchReport = await mailService.sendBatch(candidates, (result, index, total) => {
      const statusIcon = result.status === "SENT" ? "✅" : result.status === "FAILED" ? "❌" : "⏭️";
      console.log(`   ${statusIcon} [${index + 1}/${total}] @${result.username} (${result.recipientEmail}) -> ${result.status}`);
    });

    // STEP 3: Format result and show to user
    this.displaySummary(batchReport);

    // STEP 4: Ask for feedback / campaign conclusion
    this.concludeCampaign(batchReport);

    return batchReport;
  }

  /**
   * Dispatches an outreach email to a single candidate
   */
  public async sendSingle(candidate: CombinedCandidateResult): Promise<DeliveryResult> {
    console.log(`[Phase 4] Dispatching single outreach email for @${candidate.username}...`);
    const result = await mailService.sendCandidateEmail(candidate);
    const icon = result.status === "SENT" ? "✅" : result.status === "FAILED" ? "❌" : "⏭️";
    console.log(`[Phase 4] ${icon} Delivery status for @${candidate.username}: ${result.status}`);
    return result;
  }

  /**
   * STEP 3: Formats and displays the delivery report
   */
  public displaySummary(report: DeliveryBatchReport): void {
    console.log(`\n==================================================`);
    console.log(`📊 [Phase 4] CAMPAIGN OUTREACH SUMMARY REPORT`);
    console.log(`==================================================`);
    console.log(`Total Candidates Processed : ${report.totalProcessed}`);
    console.log(`✅ Successfully Dispatched  : ${report.successfulCount}`);
    console.log(`❌ Failed Deliveries       : ${report.failedCount}`);
    console.log(`⏭️ Skipped (No Email/Mail)  : ${report.skippedCount}`);
    console.log(`Started At                 : ${report.startTime}`);
    console.log(`Completed At               : ${report.endTime}`);
    console.log(`--------------------------------------------------`);

    if (report.results.length > 0) {
      console.log(`Recipient Breakdown:`);
      for (const res of report.results) {
        const detail = res.error ? ` (Reason: ${res.error})` : res.messageId ? ` (ID: ${res.messageId})` : "";
        console.log(` - @${res.username.padEnd(16)} | ${res.recipientEmail.padEnd(25)} | [${res.status}]${detail}`);
      }
    }
    console.log(`==================================================\n`);
  }

  /**
   * STEP 4: Logs feedback prompt and outcome confirmation
   */
  public concludeCampaign(report: DeliveryBatchReport): void {
    if (report.successfulCount > 0) {
      console.log(`🎉 [Phase 4] Outreach successfully completed! All qualified leads have been contacted.`);
    } else if (report.totalProcessed > 0 && report.successfulCount === 0) {
      console.log(`⚠️ [Phase 4] Campaign ended with 0 successful deliveries. Please check SMTP configuration or candidate email availability.`);
    }
    console.log(`💡 [Phase 4 Feedback]: Please review delivery metrics above. You can adjust EMAIL_THROTTLE_MS or prompt templates as needed.\n`);
  }
}

export default new phase4Class();
