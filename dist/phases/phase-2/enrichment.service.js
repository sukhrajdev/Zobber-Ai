import { GitHubUserDetailsSchema } from "./enrichment.schema.js";
/**
 * EnrichmentService handles Phase 2 logic:
 * 1. Fetch detailed user profile from GitHub API
 * 2. Validate availability of email or twitter username
 * 3. Verify bio existence and heuristic keyword matching (founder, developer, hr, etc.)
 * 4. Normalize candidate into standardized EnrichedCandidate model
 */
class enrichmentClass {
    defaultKeywords = [
        "founder",
        "co-founder",
        "cofounder",
        "ceo",
        "cto",
        "developer",
        "engineer",
        "recruiter",
        "hr",
        "talent",
        "hiring",
        "head of people",
        "tech lead"
    ];
    /**
     * STEP 1: Fetch user details from GitHub REST API
     */
    async fetchUserDetails(username) {
        try {
            const headers = {
                "Accept": "application/vnd.github+json",
                "User-Agent": "Zobber-AI-Bot"
            };
            if (process.env.GITHUB_TOKEN) {
                headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
            }
            const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                headers
            });
            if (response.status === 404) {
                console.warn(`[Phase 2] GitHub user not found: ${username}`);
                return null;
            }
            if (response.status === 403) {
                console.warn(`[Phase 2] GitHub API rate limit reached while fetching: ${username}`);
                return null;
            }
            if (!response.ok) {
                console.warn(`[Phase 2] Request failed for ${username} with status ${response.status}`);
                return null;
            }
            const rawJson = await response.json();
            const parsed = GitHubUserDetailsSchema.safeParse(rawJson);
            if (!parsed.success) {
                console.warn(`[Phase 2] Failed to validate schema for ${username}:`, parsed.error.format());
                return null;
            }
            return parsed.data;
        }
        catch (error) {
            console.error(`[Phase 2] Network error fetching ${username}: ${error.message}`);
            return null;
        }
    }
    /**
     * STEP 2: Check if email or twitter username exists
     */
    hasValidContact(user) {
        const hasEmail = Boolean(user.email && user.email.trim().length > 0);
        const hasTwitter = Boolean(user.twitter_username && user.twitter_username.trim().length > 0);
        return hasEmail || hasTwitter;
    }
    /**
     * STEP 3: Check if bio has content and matches target keywords
     */
    hasMatchingBioKeywords(bio, keywords = this.defaultKeywords) {
        if (!bio || bio.trim().length === 0) {
            return false;
        }
        const normalizedBio = bio.toLowerCase();
        return keywords.some((keyword) => normalizedBio.includes(keyword.toLowerCase()));
    }
    /**
     * Normalizes raw GitHub user payload into the wanted Phase 2 result
     */
    normalizeCandidate(user) {
        return {
            username: user.login,
            name: user.name && user.name.trim().length > 0 ? user.name.trim() : user.login,
            company: user.company ? user.company.replace(/^@/, "").trim() : null,
            location: user.location ? user.location.trim() : null,
            email: user.email ? user.email.trim() : null,
            hireable: user.hireable ?? null,
            bio: user.bio ? user.bio.trim() : "",
            twitter_username: user.twitter_username ? user.twitter_username.trim() : null,
            followers: user.followers ?? 0,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            blog: user.blog ? user.blog.trim() : null,
            public_repos: user.public_repos
        };
    }
    /**
     * Runs Step 2 & Step 3 filter checks and constructs normalized candidate
     */
    filterAndEnrich(user, keywords = this.defaultKeywords) {
        // Step 2: Contact verification
        if (!this.hasValidContact(user)) {
            return {
                passed: false,
                reason: `User @${user.login} does not have a public email or Twitter username.`
            };
        }
        // Step 3: Bio keyword heuristic
        if (!this.hasMatchingBioKeywords(user.bio, keywords)) {
            return {
                passed: false,
                reason: `User @${user.login} bio is empty or does not match any role keywords.`
            };
        }
        // Passed pre-filtering
        const candidate = this.normalizeCandidate(user);
        return {
            passed: true,
            candidate
        };
    }
    /**
     * Complete Phase 2 entrypoint for a single username
     */
    async enrichUser(username, keywords = this.defaultKeywords) {
        const rawUser = await this.fetchUserDetails(username);
        if (!rawUser) {
            return {
                passed: false,
                reason: `Could not retrieve user data for @${username}`
            };
        }
        return this.filterAndEnrich(rawUser, keywords);
    }
}
export default new enrichmentClass();
//# sourceMappingURL=enrichment.service.js.map