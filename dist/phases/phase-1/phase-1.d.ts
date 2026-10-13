import type { DiscoveryPageResult } from "./discovery.service.js";
declare class phase1Class {
    /**
     * Fetches a specific page of GitHub users for the given query.
     * Used by the retry loop in index.ts when Phase 2 yields 0 leads.
     */
    getUserPage(query: string, page: number): Promise<DiscoveryPageResult>;
    /**
     * Convenience wrapper — fetches the default starting page.
     */
    getUser(query: string): Promise<DiscoveryPageResult>;
}
declare const _default: phase1Class;
export default _default;
//# sourceMappingURL=phase-1.d.ts.map