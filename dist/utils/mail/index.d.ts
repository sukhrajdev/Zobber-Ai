import type { CombinedCandidateResult } from "../../phases/phase-2/enrichment.types.js";
/**
 * MailTemplateInterpolator handles dynamic variable substitution
 * inside email subject lines and body text.
 */
export declare class MailTemplateInterpolator {
    /**
     * Replaces placeholders ({name}, {company}, {role}, etc.) with lead data
     */
    interpolate(template: string, candidate: CombinedCandidateResult): string;
    /**
     * Interpolates both subject line and body text for a candidate
     */
    interpolateSubjectAndBody(subject: string, body: string, candidate: CombinedCandidateResult): {
        subject: string;
        body: string;
    };
}
declare const _default: MailTemplateInterpolator;
export default _default;
//# sourceMappingURL=index.d.ts.map