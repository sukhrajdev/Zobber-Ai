import discoveryClass from "./discovery.service.js";
class phase1Class {
    pages = 10;
    async getUser(query) {
        try {
            const userData = await discoveryClass.fetchUsers(query, this.pages);
            return userData;
        }
        catch (err) {
            console.log(err.message);
            throw Error(`Error occured in getting Raw Users:- ${err.message}`);
        }
    }
}
export default new phase1Class();
//# sourceMappingURL=phase-1.js.map