import RateLimiter from "./ratelimiter.js";
/**
 * Pre-configured rate limiter instances.
 *
 * Import whichever limiter you need and attach it to an Express route:
 *
 *   import { githubRateLimiter } from "../utils/ratelimiter/index.js";
 *   app.use("/api/github", githubRateLimiter.middleware());
 *
 *   import { aiRateLimiter } from "../utils/ratelimiter/index.js";
 *   app.use("/api/ai", aiRateLimiter.middleware());
 */
/**
 * GitHub API rate limiter.
 *
 * GitHub's Search API allows:
 *  - Unauthenticated : 10  requests / minute
 *  - Authenticated   : 30  requests / minute
 *
 * This limiter is set conservatively at 25 req/min (authenticated)
 * to leave a small safety buffer.
 */
export const githubRateLimiter = new RateLimiter({
    windowMs: 60_000, // 1 minute
    maxRequests: 25,
    statusCode: 429,
    message: "GitHub API rate limit reached. Please wait before making more search requests.",
    standardHeaders: true,
    onRequest: (_req, _res, info) => {
        if (info.blocked) {
            console.warn(`[RateLimiter:GitHub] 🚫 Blocked key="${info.key}" — ${info.current}/${info.limit} requests used. Resets at ${new Date(info.resetAt).toISOString()}`);
        }
    },
});
/**
 * AI / LLM rate limiter.
 *
 * OpenRouter enforces per-model RPM (requests per minute) limits.
 * Jev-1.13 and GPT-4o-mini both allow ~60 RPM on free/standard tiers.
 *
 * Set conservatively at 50 req/min to avoid 429s from OpenRouter.
 */
export const aiRateLimiter = new RateLimiter({
    windowMs: 60_000, // 1 minute
    maxRequests: 50,
    statusCode: 429,
    message: "AI inference rate limit reached. Please slow down requests to the LLM endpoint.",
    standardHeaders: true,
    onRequest: (_req, _res, info) => {
        if (info.blocked) {
            console.warn(`[RateLimiter:AI] 🚫 Blocked key="${info.key}" — ${info.current}/${info.limit} requests used. Resets at ${new Date(info.resetAt).toISOString()}`);
        }
    },
});
// Re-export the class itself so consumers can create custom instances
export { default as RateLimiter } from "./ratelimiter.js";
//# sourceMappingURL=index.js.map