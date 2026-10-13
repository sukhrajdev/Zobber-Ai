import mailClient from "../../integrations/mail/mail.client.js";
import mailInterpolator from "../../utils/mail/index.js";
import type { CombinedCandidateResult } from "../phase-2/enrichment.types.js";
import type { DeliveryResult, DeliveryBatchReport } from "./mail.types.js";

/**
 * MailService handles Phase 4 business logic:
 * 1. Validating candidate contact channel (public email)
 * 2. Dynamic template variable interpolation
 * 3. Anti-spam sequential throttling with jitter
 * 4. Dispatch verification and telemetry aggregation
 */
class mailServiceClass {
  private baseThrottleMs: number = 3000;

  constructor() {
    if (process.env.EMAIL_THROTTLE_MS) {
      const parsed = parseInt(process.env.EMAIL_THROTTLE_MS, 10);
      if (!isNaN(parsed) && parsed >= 500) {
        this.baseThrottleMs = parsed;
      }
    }
  }

  /**
   * Helper delay introducing anti-spam throttling with randomized jitter
   */
  private async sleepWithJitter(baseMs: number = this.baseThrottleMs): Promise<void> {
    const jitter = Math.floor(Math.random() * 1000); // 0 to 1000ms random jitter
    const totalDelay = baseMs + jitter;
    await new Promise((resolve) => setTimeout(resolve, totalDelay));
  }

  /**
   * Step 1 & 2: Sends a personalized email to an individual candidate
   */
  public async sendCandidateEmail(candidate: CombinedCandidateResult): Promise<DeliveryResult> {
    const username = candidate.username;
    const recipientEmail = candidate.email;

    // Check if recipient email exists
    if (!recipientEmail || recipientEmail.trim().length === 0) {
      return {
        username,
        recipientEmail: "N/A",
        status: "SKIPPED",
        timestamp: new Date().toISOString(),
        error: `Candidate @${username} does not have a verified email address.`
      };
    }

    // Check if mail content exists from Phase 3
    if (!candidate.mail || !candidate.mail.subject || !candidate.mail.body) {
      return {
        username,
        recipientEmail,
        status: "SKIPPED",
        timestamp: new Date().toISOString(),
        error: `No generated outreach email found for candidate @${username}.`
      };
    }

    // Step 1: Interpolate template placeholders
    const { subject, body } = mailInterpolator.interpolateSubjectAndBody(
      candidate.mail.subject,
      candidate.mail.body,
      candidate
    );

    // Step 2: Attempt dispatch and verify result
    try {
      const sendResult = await mailClient.sendMail({
        to: recipientEmail,
        subject,
        text: body
      });

      return {
        username,
        recipientEmail,
        status: "SENT",
        timestamp: new Date().toISOString(),
        ...(sendResult.messageId ? { messageId: sendResult.messageId } : {})
      };
    } catch (error: any) {
      console.error(`[Phase 4] Failed sending to @${username} (${recipientEmail}): ${error.message}`);
      return {
        username,
        recipientEmail,
        status: "FAILED",
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Dispatches a batch of candidates sequentially with throttling
   */
  public async sendBatch(
    candidates: CombinedCandidateResult[],
    onProgress?: (result: DeliveryResult, index: number, total: number) => void
  ): Promise<DeliveryBatchReport> {
    const startTime = new Date().toISOString();
    const results: DeliveryResult[] = [];

    let successfulCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i]!;
      console.log(`[Phase 4] (${i + 1}/${candidates.length}) Dispatching email for @${candidate.username}...`);

      const deliveryResult = await this.sendCandidateEmail(candidate);
      results.push(deliveryResult);

      if (deliveryResult.status === "SENT") {
        successfulCount++;
      } else if (deliveryResult.status === "FAILED") {
        failedCount++;
      } else {
        skippedCount++;
      }

      if (onProgress) {
        onProgress(deliveryResult, i, candidates.length);
      }

      // Apply throttling delay between sequential messages (except for the last recipient)
      if (i < candidates.length - 1 && deliveryResult.status === "SENT") {
        await this.sleepWithJitter();
      }
    }

    const endTime = new Date().toISOString();

    return {
      totalProcessed: candidates.length,
      successfulCount,
      failedCount,
      skippedCount,
      results,
      startTime,
      endTime
    };
  }
}

export default new mailServiceClass();
