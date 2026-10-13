const PER_PAGE = 30;
class discoveryClass {
    async fetchUsers(query, page) {
        try {
            const url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
            }
            const rawUsers = await response.json();
            const totalCount = rawUsers.total_count ?? 0;
            const items = rawUsers.items ?? [];
            // De-duplicate within the page by user ID and exclude site admins
            const seenIds = new Set();
            const users = items.filter((user) => {
                const isValid = !user.site_admin;
                const isUnique = !seenIds.has(user.id);
                if (isValid && isUnique) {
                    seenIds.add(user.id);
                    return true;
                }
                return false;
            });
            // GitHub caps pagination at 1000 results (page * PER_PAGE)
            const hasMore = items.length === PER_PAGE && page * PER_PAGE < Math.min(totalCount, 1000);
            return { users, totalCount, hasMore, page };
        }
        catch (error) {
            throw new Error(`Discovery fetchUsers failed: ${error.message}`);
        }
    }
}
export default new discoveryClass();
//# sourceMappingURL=discovery.service.js.map