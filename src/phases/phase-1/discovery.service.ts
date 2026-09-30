import type { GithubUserType } from "./discovery.types.js";

class discoveryClass {
    async fetchUsers(query:string,page:number | 1) {
        try {
            const per_page: number = 30;
            let data = await fetch(`https://api.github.com/search/users?q=${query}&per_page=${per_page}&page=${page}`)

            if (!data.ok) {
                return "Request is not Successful!!!"
            }

            let rawUsers = await data.json();

            if (Object.keys(rawUsers).length == 0) {
                return "user's Doesn't have."
            }
            
            let previousIds = new Set<number>([]) 
            
            
            let users = rawUsers.items.filter((user: GithubUserType) => {
                const isVaild =  !user.site_admin;
                const isUnique = !previousIds.has(user.id) 

                if (isVaild && isUnique) {
                    previousIds.add(user.id);
                    return true
                } 

                return false
            })

            return users

        } catch (error:any) {
            throw new Error(`Error:${error.message}`)
        }
    }
}

export default new discoveryClass()