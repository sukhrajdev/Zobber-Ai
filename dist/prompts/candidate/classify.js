/**
 * Standard Jev question suite for candidate profiling
 */
export const CANDIDATE_JEV_QUESTIONS = {
    target_role: {
        type: "choice",
        instructions: "What is this individual's primary professional role based on their profile?",
        criteria: {
            founder: "Founder, Co-Founder, CEO, CTO, Chief Executive, or executive leader",
            hr: "Recruiter, Talent Acquisition, HR Manager, Head of People, People Ops",
            other: "Individual contributor software developer, designer, student, or unrelated"
        }
    },
    is_hiring: {
        type: "noul",
        instructions: "Does this individual or their organization show active hiring intent or team expansion signals?",
        criteria: {
            true: "Bio or company explicitly states hiring, looking for engineers, expanding team, or open roles",
            false: "No hiring signals mentioned, or seeking employment themselves"
        }
    },
    decision_authority: {
        type: "score",
        instructions: "What level of hiring and organizational decision-making authority does this individual hold?",
        criteria: [
            "No authority (student, intern, or entry-level)",
            "Peer contributor (engineer or designer without direct hiring scope)",
            "Direct hiring influence (recruiter, hiring manager, or team lead)",
            "Final hiring authority (founder, CEO, CTO, or C-level executive)"
        ]
    }
};
/**
 * Prepares the clean structured state payload sent to Jev
 */
export function buildCandidateState(candidate) {
    return {
        name: candidate.name,
        username: candidate.username,
        company: candidate.company ?? "Not specified",
        bio: candidate.bio,
        hireable: candidate.hireable,
        location: candidate.location ?? "Not specified",
        followers: candidate.followers,
        blog: candidate.blog ?? "None",
        public_repos: candidate.public_repos ?? 0
    };
}
//# sourceMappingURL=classify.js.map