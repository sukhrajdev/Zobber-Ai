import type { RawGitHubUserDetails, EnrichedCandidate, PreFilterResult } from "./enrichment.types.js";
/**
 * EnrichmentService handles Phase 2 logic:
 * 1. Fetch detailed user profile from GitHub API
 * 2. Validate availability of email or twitter username
 * 3. Verify bio existence and heuristic keyword matching (founder, developer, hr, etc.)
 * 4. Normalize candidate into standardized EnrichedCandidate model
 */
declare class enrichmentClass {
    readonly defaultKeywords: string[];
    /**
     * STEP 1: Fetch user details from GitHub REST API
     */
    fetchUserDetails(username: string): Promise<RawGitHubUserDetails | null>;
    /**
     * STEP 2: Check if email or twitter username exists
     */
    hasValidContact(user: RawGitHubUserDetails): boolean;
    /**
     * STEP 3: Check if bio has content and matches target keywords
     */
    hasMatchingBioKeywords(bio: string | null | undefined, keywords?: string[]): boolean;
    /**
     * Normalizes raw GitHub user payload into the wanted Phase 2 result
     */
    normalizeCandidate(user: RawGitHubUserDetails): EnrichedCandidate;
    /**
     * Runs Step 2 & Step 3 filter checks and constructs normalized candidate
     */
    filterAndEnrich(user: RawGitHubUserDetails, keywords?: string[]): PreFilterResult;
    /**
     * Complete Phase 2 entrypoint for a single username
     */
    enrichUser(username: string, keywords?: string[]): Promise<PreFilterResult>;
}
declare const _default: enrichmentClass;
export default _default;
//# sourceMappingURL=enrichment.service.d.ts.map