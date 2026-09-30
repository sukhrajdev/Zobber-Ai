class discoveryClass {
    async fetchUsers(query, page) {
        try {
            const per_page = 30;
            let data = await fetch(`https://api.github.com/search/users?q=${query}&per_page=${per_page}&page=${page}`);
            if (!data.ok) {
                return "Request is not Successful!!!";
            }
            let rawUsers = await data.json();
            if (Object.keys(rawUsers).length == 0) {
                return "user's Doesn't have.";
            }
            console.log(rawUsers);
            let previousIds = new Set([]);
            let users = rawUsers.items.filter((user) => {
                const isVaild = !user.site_admin;
                const isUnique = !previousIds.has(user.id);
                if (isVaild && isUnique) {
                    previousIds.add(user.id);
                    return true;
                }
                return false;
            });
            return users;
        }
        catch (error) {
            throw new Error(`Error:${error.message}`);
        }
    }
}
export default new discoveryClass();
//# sourceMappingURL=discovery.service.js.map