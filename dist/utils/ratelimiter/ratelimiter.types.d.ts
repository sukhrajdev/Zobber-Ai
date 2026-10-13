import type { Request, Response } from "express";
/**
 * Configuration options for the RateLimiter.
 * Mirrors the core express-rate-limit Options shape
 * so swapping the underlying store/strategy is painless later.
 */
export interface RateLimiterConfig {
    /**
     * Time window in milliseconds.
     * Example: 60_000 = 1 minute window
     */
    windowMs: number;
    /**
     * Maximum number of requests allowed per IP within the window.
     */
    maxRequests: number;
    /**
     * HTTP status code to return when a client is rate-limited.
     * @default 429
     */
    statusCode?: number;
    /**
     * Message returned to the client when they are rate-limited.
     * @default "Too many requests, please try again later."
     */
    message?: string;
    /**
     * If true, the rate-limit headers are added to every response.
     * Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
     * @default true
     */
    standardHeaders?: boolean;
    /**
     * Optional custom key generator to identify a client.
     * Defaults to req.ip.
     */
    keyGenerator?: (req: Request, res: Response) => string;
    /**
     * Optional handler called when a request is blocked.
     * If provided, the default 429 response is suppressed — you control the response.
     */
    handler?: (req: Request, res: Response) => void;
    /**
     * Optional function called on every request (blocked or allowed).
     * Useful for logging, metrics, or analytics.
     */
    onRequest?: (req: Request, res: Response, info: RateLimitRequestInfo) => void;
}
/**
 * Metadata passed to the onRequest callback for observability.
 */
export interface RateLimitRequestInfo {
    /** Client key (usually the IP address) */
    key: string;
    /** Number of requests made in the current window */
    current: number;
    /** Maximum allowed requests per window */
    limit: number;
    /** Remaining requests allowed in the current window */
    remaining: number;
    /** Timestamp (ms) when the current window resets */
    resetAt: number;
    /** Whether this request was blocked */
    blocked: boolean;
}
//# sourceMappingURL=ratelimiter.types.d.ts.map