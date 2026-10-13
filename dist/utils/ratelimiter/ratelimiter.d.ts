import type { RequestHandler } from "express";
import type { RateLimiterConfig } from "./ratelimiter.types.js";
/**
 * RateLimiter
 *
 * OOP wrapper around the `express-rate-limit` library.
 *
 * Responsibilities:
 *  - Encapsulates rate-limit configuration in a reusable class
 *  - Exposes a ready-to-use Express middleware via `.middleware()`
 *  - Adds standardised X-RateLimit-* headers to every response
 *  - Supports a custom `handler` for blocked requests (e.g., JSON error body)
 *  - Supports an `onRequest` hook for logging/metrics on every hit
 *  - Designed to be extended later for AI endpoints (just instantiate with different config)
 *
 * Usage:
 *   const githubLimiter = new RateLimiter({ windowMs: 60_000, maxRequests: 30 });
 *   app.use("/api/github", githubLimiter.middleware());
 *
 *   const aiLimiter = new RateLimiter({ windowMs: 60_000, maxRequests: 10 });
 *   app.use("/api/ai", aiLimiter.middleware());
 */
declare class RateLimiter {
    private readonly config;
    constructor(config: RateLimiterConfig);
    /**
     * Resolves the client key from the request.
     * Falls back to req.ip if no custom keyGenerator is provided.
     */
    private resolveKey;
    /**
     * Builds the RateLimitRequestInfo object for the onRequest hook.
     */
    private buildRequestInfo;
    /**
     * Returns a configured Express middleware function.
     *
     * Attach to any Express router or app:
     *   app.use(rateLimiter.middleware())
     *   router.get("/search", rateLimiter.middleware(), searchHandler)
     */
    middleware(): RequestHandler;
    /**
     * Returns a summary of the current configuration.
     * Useful for logging at startup.
     */
    describe(): string;
}
export default RateLimiter;
//# sourceMappingURL=ratelimiter.d.ts.map