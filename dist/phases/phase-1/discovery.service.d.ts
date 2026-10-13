import type { GithubUserType } from "./discovery.types.js";
/** Structured result returned by fetchUsers */
export interface DiscoveryPageResult {
    users: GithubUserType[];
    /** Total matches GitHub reports (may exceed what we can paginate) */
    totalCount: number;
    /** True if more pages likely exist beyond this one */
    hasMore: boolean;
    /** The page number that was fetched */
    page: number;
}
declare class discoveryClass {
    fetchUsers(query: string, page: number): Promise<DiscoveryPageResult>;
}
declare const _default: discoveryClass;
export default _default;
//# sourceMappingURL=discovery.service.d.ts.map