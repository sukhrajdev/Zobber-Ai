import { z } from "zod";

/**
 * Zod schema validating the raw GitHub user profile payload (GET /users/{username})
 */
export const GitHubUserDetailsSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string().optional(),
  avatar_url: z.string().optional(),
  html_url: z.string().optional(),
  name: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  blog: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  hireable: z.boolean().nullable().optional(),
  bio: z.string().nullable().optional(),
  twitter_username: z.string().nullable().optional(),
  public_repos: z.number().optional(),
  public_gists: z.number().optional(),
  followers: z.number().optional().default(0),
  following: z.number().optional().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

/**
 * Standardized Phase 2 Candidate Schema
 * Matches the wanted result specification from the system design
 */
export const EnrichedCandidateSchema = z.object({
  username: z.string(),
  name: z.string(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  hireable: z.boolean().nullable(),
  bio: z.string(),
  twitter_username: z.string().nullable(),
  followers: z.number(),
  avatar_url: z.string().optional(),
  html_url: z.string().optional(),
  blog: z.string().nullable().optional(),
  public_repos: z.number().optional()
});
