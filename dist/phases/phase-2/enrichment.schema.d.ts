import { z } from "zod";
/**
 * Zod schema validating the raw GitHub user profile payload (GET /users/{username})
 */
export declare const GitHubUserDetailsSchema: z.ZodObject<{
    login: z.ZodString;
    id: z.ZodNumber;
    node_id: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodString>;
    html_url: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blog: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hireable: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    twitter_username: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    public_repos: z.ZodOptional<z.ZodNumber>;
    public_gists: z.ZodOptional<z.ZodNumber>;
    followers: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    following: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Standardized Phase 2 Candidate Schema
 * Matches the wanted result specification from the system design
 */
export declare const EnrichedCandidateSchema: z.ZodObject<{
    username: z.ZodString;
    name: z.ZodString;
    company: z.ZodNullable<z.ZodString>;
    location: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    hireable: z.ZodNullable<z.ZodBoolean>;
    bio: z.ZodString;
    twitter_username: z.ZodNullable<z.ZodString>;
    followers: z.ZodNumber;
    avatar_url: z.ZodOptional<z.ZodString>;
    html_url: z.ZodOptional<z.ZodString>;
    blog: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    public_repos: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=enrichment.schema.d.ts.map