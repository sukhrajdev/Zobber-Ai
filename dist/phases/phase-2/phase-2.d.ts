import type { GithubUserType } from "../phase-1/discovery.types.js";
import type { CombinedCandidateResult } from "./enrichment.types.js";
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
declare class phase2Class {
    /**
     * Processes a single username through the combined Phase 2 + Phase 3 pipeline
     */
    processUser(username: string): Promise<CombinedCandidateResult | null>;
    /**
     * Processes an array of discovered users from Phase 1
     */
    processDiscoveredUsers(users: GithubUserType[]): Promise<CombinedCandidateResult[]>;
    /**
     * Processes a list of raw usernames
     */
    processUsernames(usernames: string[]): Promise<CombinedCandidateResult[]>;
}
declare const _default: phase2Class;
export default _default;
//# sourceMappingURL=phase-2.d.ts.map