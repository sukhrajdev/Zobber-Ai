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
export declare const githubRateLimiter: RateLimiter;
/**
 * AI / LLM rate limiter.
 *
 * OpenRouter enforces per-model RPM (requests per minute) limits.
 * Jev-1.13 and GPT-4o-mini both allow ~60 RPM on free/standard tiers.
 *
 * Set conservatively at 50 req/min to avoid 429s from OpenRouter.
 */
export declare const aiRateLimiter: RateLimiter;
export { default as RateLimiter } from "./ratelimiter.js";
export type { RateLimiterConfig, RateLimitRequestInfo } from "./ratelimiter.types.js";
//# sourceMappingURL=index.d.ts.map