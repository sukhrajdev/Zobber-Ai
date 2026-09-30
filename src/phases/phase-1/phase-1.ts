import discoveryClass from "./discovery.service.js";

class phase1Class{
    readonly pages = 10;
    async getUser(query:string) {
        try {
            const userData = await discoveryClass.fetchUsers(query,this.pages);
            return userData
            
        } catch (err: any) {
            console.log(err.message)
            throw Error(`Error occured in getting Raw Users:- ${err.message}`)
        }
    }
}

export default new phase1Class()