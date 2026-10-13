import type { z } from "zod";
import type { GitHubUserDetailsSchema, EnrichedCandidateSchema } from "./enrichment.schema.js";

/**
 * Raw GitHub user payload returned from GET https://api.github.com/users/${username}
 */
export type RawGitHubUserDetails = z.infer<typeof GitHubUserDetailsSchema>;

/**
 * Standardized Phase 2 candidate profile
 */
export type EnrichedCandidate = z.infer<typeof EnrichedCandidateSchema>;

/**
 * Result of the Phase 2 pre-filter checks (contact channel + bio keywords)
 */
export interface PreFilterResult {
  passed: boolean;
  reason?: string;
  candidate?: EnrichedCandidate;
}

/**
 * Combined Candidate model (Phase 2 + Phase 3 output)
 * Aligns directly with the system architecture schema
 */
export interface CombinedCandidateResult {
  username: string;
  email: string | null;
  sources: {
    platform: "github" | "linkedin";
    url: string;
    collectedAt: string;
  };
  role: "founder" | "hr";
  hiring: {
    status: boolean;
    url?: string | undefined;
    collectedAt: string;
  };
  hiringRole: string | null;
  mail?: {
    subject: string;
    body: string;
  } | undefined;
  enrichedProfile: EnrichedCandidate;
}
