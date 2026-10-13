import enrichmentService from "./enrichment.service.js";
import phase3 from "../phase-3/phase-3.js";
/**
 * Phase 2 Coordinator (Combined Phase 2 & Phase 3)
 *
 * Responsibilities:
 * 1. Takes candidate username or Phase 1 discovered users.
 * 2. Enriches user profile via GitHub API (STEP 1).
 * 3. Enforces contact checks (email OR twitter) (STEP 2).
 * 4. Checks bio keywords (founder, developer, hr, etc.) (STEP 3).
 * 5. Passes candidate into Phase 3 Jev AI Intelligence (LLM Classification + Email Writer) (STEP 4).
 * 6. Constructs and returns the final unified candidate record.
 */
class phase2Class {
    /**
     * Processes a single username through the combined Phase 2 + Phase 3 pipeline
     */
    async processUser(username) {
        try {
            console.log(`[Phase 2/3] Processing user: @${username}`);
            // STEP 1 - 3: Fetch, contact check, and bio heuristic check
            const enrichmentResult = await enrichmentService.enrichUser(username);
            if (!enrichmentResult.passed || !enrichmentResult.candidate) {
                console.log(`[Phase 2/3] User @${username} skipped: ${enrichmentResult.reason}`);
                return null;
            }
            const candidate = enrichmentResult.candidate;
            // STEP 4 (Combined Phase 3): Jev AI Classification and Personalized Email Writer
            console.log(`[Phase 2/3] Candidate @${username} passed pre-filtering. Invoking Jev AI intelligence...`);
            const aiResult = await phase3.evaluateCandidate(candidate);
            if (!aiResult) {
                console.warn(`[Phase 2/3] AI evaluation returned empty for @${username}`);
                return null;
            }
            // Filter only target roles: "founder" or "hr"
            if (aiResult.classification.role !== "founder" && aiResult.classification.role !== "hr") {
                console.log(`[Phase 2/3] Candidate @${username} classified as '${aiResult.classification.role}'. Skipping outreach.`);
                return null;
            }
            // Construct target architecture record
            const combinedRecord = {
                username: candidate.username,
                email: candidate.email,
                sources: {
                    platform: "github",
                    url: candidate.html_url || `https://github.com/${candidate.username}`,
                    collectedAt: new Date().toISOString()
                },
                role: aiResult.classification.role,
                hiring: {
                    status: aiResult.classification.isHiring,
                    collectedAt: new Date().toISOString(),
                    ...(candidate.html_url ? { url: candidate.html_url } : {})
                },
                hiringRole: aiResult.classification.hiringRole ?? null,
                enrichedProfile: candidate,
                ...(aiResult.mail ? { mail: aiResult.mail } : {})
            };
            console.log(`[Phase 2/3] Successfully processed lead: @${username} (${combinedRecord.role}, hiring: ${combinedRecord.hiring.status})`);
            return combinedRecord;
        }
        catch (error) {
            console.error(`[Phase 2/3] Error processing user @${username}: ${error.message}`);
            return null;
        }
    }
    /**
     * Processes an array of discovered users from Phase 1
     */
    async processDiscoveredUsers(users) {
        const results = [];
        for (const user of users) {
            const record = await this.processUser(user.login);
            if (record) {
                results.push(record);
            }
        }
        return results;
    }
    /**
     * Processes a list of raw usernames
     */
    async processUsernames(usernames) {
        const results = [];
        for (const username of usernames) {
            const record = await this.processUser(username);
            if (record) {
                results.push(record);
            }
        }
        return results;
    }
}
export default new phase2Class();
//# sourceMappingURL=phase-2.js.map