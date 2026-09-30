import z, { boolean, number, string } from "zod";
import { httpUrl } from "zod/mini";
const userType = z.enum(["User", "Organization"]);
export const GitHubUserSchema = z.object({
    login: string(),
    id: number(),
    node_id: string(),
    avatar_url: httpUrl(),
    gravatar_id: string().optional(),
    url: httpUrl(),
    html_url: httpUrl(),
    followers_url: httpUrl(),
    following_url: httpUrl(),
    gists_url: string(),
    starred_url: string(),
    subscriptions_url: string(),
    organizations_url: string(),
    repos_url: string(),
    events_url: string(),
    received_events_url: string(),
    type: userType,
    user_view_type: string().optional(),
    site_admin: boolean(),
    score: number(),
});
//# sourceMappingURL=discovery.schema.js.map