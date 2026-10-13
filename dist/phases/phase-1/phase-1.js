import discoveryClass from "./discovery.service.js";
/** Default starting page for discovery */
const DEFAULT_START_PAGE = 1;
class phase1Class {
    /**
     * Fetches a specific page of GitHub users for the given query.
     * Used by the retry loop in index.ts when Phase 2 yields 0 leads.
     */
    async getUserPage(query, page) {
        try {
            console.log(`[Phase 1] Fetching page ${page} for query: "${query}"...`);
            const result = await discoveryClass.fetchUsers(query, page);
            console.log(`[Phase 1] Page ${page}: ${result.users.length} user(s) found (total on GitHub: ${result.totalCount}, hasMore: ${result.hasMore})`);
            return result;
        }
        catch (err) {
            console.error(`[Phase 1] Error on page ${page}: ${err.message}`);
            throw new Error(`Phase 1 getUserPage failed: ${err.message}`);
        }
    }
    /**
     * Convenience wrapper — fetches the default starting page.
     */
    async getUser(query) {
        return this.getUserPage(query, DEFAULT_START_PAGE);
    }
}
export default new phase1Class();
//# sourceMappingURL=phase-1.js.map