import z from "zod";
export declare const GitHubUserSchema: z.ZodObject<{
    login: z.ZodString;
    id: z.ZodNumber;
    node_id: z.ZodString;
    avatar_url: import("zod/mini").ZodMiniURL;
    gravatar_id: z.ZodOptional<z.ZodString>;
    url: import("zod/mini").ZodMiniURL;
    html_url: import("zod/mini").ZodMiniURL;
    followers_url: import("zod/mini").ZodMiniURL;
    following_url: import("zod/mini").ZodMiniURL;
    gists_url: z.ZodString;
    starred_url: z.ZodString;
    subscriptions_url: z.ZodString;
    organizations_url: z.ZodString;
    repos_url: z.ZodString;
    events_url: z.ZodString;
    received_events_url: z.ZodString;
    type: z.ZodEnum<{
        Organization: "Organization";
        User: "User";
    }>;
    user_view_type: z.ZodOptional<z.ZodString>;
    site_admin: z.ZodBoolean;
    score: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=discovery.schema.d.ts.map