import aiService from "./ai.service.js";
/**
 * Phase 3 Coordinator
 * Responsible for orchestrating candidate evaluation via LLM
 */
class phase3Class {
    async evaluateCandidate(candidate) {
        try {
            return await aiService.evaluateCandidate(candidate);
        }
        catch (err) {
            console.error(`[Phase 3] Error during candidate evaluation for @${candidate.username}: ${err.message}`);
            return null;
        }
    }
    async evaluateCandidates(candidates) {
        const results = new Map();
        for (const candidate of candidates) {
            const evalResult = await this.evaluateCandidate(candidate);
            if (evalResult) {
                results.set(candidate.username, evalResult);
            }
        }
        return results;
    }
}
export default new phase3Class();
//# sourceMappingURL=phase-3.js.map