/**
 * MailTemplateInterpolator handles dynamic variable substitution
 * inside email subject lines and body text.
 */
export class MailTemplateInterpolator {
    /**
     * Replaces placeholders ({name}, {company}, {role}, etc.) with lead data
     */
    interpolate(template, candidate) {
        if (!template)
            return "";
        const name = candidate.enrichedProfile?.name || candidate.username;
        const company = candidate.enrichedProfile?.company || "your team";
        const role = candidate.role === "founder" ? "Founder" : "Talent Leader";
        const hiringRole = candidate.hiringRole || "engineering roles";
        const username = candidate.username;
        const email = candidate.email || "";
        const replacements = {
            "{name}": name,
            "{NAME}": name,
            "{{name}}": name,
            "{username}": username,
            "{company}": company,
            "{COMPANY}": company,
            "{{company}}": company,
            "{role}": role,
            "{{role}}": role,
            "{hiringRole}": hiringRole,
            "{{hiringRole}}": hiringRole,
            "{email}": email,
            "{{email}}": email
        };
        let result = template;
        for (const [placeholder, value] of Object.entries(replacements)) {
            result = result.split(placeholder).join(value);
        }
        return result;
    }
    /**
     * Interpolates both subject line and body text for a candidate
     */
    interpolateSubjectAndBody(subject, body, candidate) {
        return {
            subject: this.interpolate(subject, candidate),
            body: this.interpolate(body, candidate)
        };
    }
}
export default new MailTemplateInterpolator();
//# sourceMappingURL=index.js.map