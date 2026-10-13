import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type {
  RateLimiterConfig,
  RateLimitRequestInfo,
} from "./ratelimiter.types.js";

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
class RateLimiter {
  private readonly config: Required<
    Omit<RateLimiterConfig, "keyGenerator" | "handler" | "onRequest">
  > & Pick<RateLimiterConfig, "keyGenerator" | "handler" | "onRequest">;

  constructor(config: RateLimiterConfig) {
    // Apply defaults
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      statusCode: config.statusCode ?? 429,
      message:
        config.message ??
        "Too many requests, please try again later.",
      standardHeaders: config.standardHeaders ?? true,
      ...(config.keyGenerator === undefined
        ? {}
        : { keyGenerator: config.keyGenerator }),
      ...(config.handler === undefined ? {} : { handler: config.handler }),
      ...(config.onRequest === undefined
        ? {}
        : { onRequest: config.onRequest }),
    };
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Resolves the client key from the request.
   * Falls back to req.ip if no custom keyGenerator is provided.
   */
  private resolveKey(req: Request, res: Response): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req, res);
    }
    return req.ip ?? "unknown";
  }

  /**
   * Builds the RateLimitRequestInfo object for the onRequest hook.
   */
  private buildRequestInfo(
    key: string,
    current: number,
    resetAt: number,
    blocked: boolean
  ): RateLimitRequestInfo {
    return {
      key,
      current,
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - current),
      resetAt,
      blocked,
    };
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Returns a configured Express middleware function.
   *
   * Attach to any Express router or app:
   *   app.use(rateLimiter.middleware())
   *   router.get("/search", rateLimiter.middleware(), searchHandler)
   */
  public middleware(): RequestHandler {
    const { windowMs, maxRequests, statusCode, message, standardHeaders } =
      this.config;

    const limiter = rateLimit({
      windowMs,
      limit: maxRequests,
      standardHeaders,
      legacyHeaders: false,

      // Custom key generator (uses class method for consistency)
      keyGenerator: (req: Request, res: Response): string =>
        this.resolveKey(req, res),

      // Custom handler for blocked requests
      handler: (req: Request, res: Response): void => {
        const key = this.resolveKey(req, res);

        // Fire onRequest hook if provided (blocked = true)
        if (this.config.onRequest) {
          const info = this.buildRequestInfo(
            key,
            maxRequests + 1, // exceeded by 1
            Date.now() + windowMs,
            true
          );
          this.config.onRequest(req, res, info);
        }

        // Delegate to custom handler if provided
        if (this.config.handler) {
          this.config.handler(req, res);
          return;
        }

        // Default 429 JSON response
        res.status(statusCode).json({
          success: false,
          statusCode,
          message,
          retryAfter: Math.ceil(windowMs / 1000),
        });
      },
    });

    // Wrap the limiter to fire onRequest hook on allowed requests too
    return (req: Request, res: Response, next: NextFunction): void => {
      if (this.config.onRequest) {
        // Intercept the response to capture rate-limit headers after limiter runs
        const originalSend = res.json.bind(res);
        res.json = (body: any) => {
          const key = this.resolveKey(req, res);
          const remaining = parseInt(
            res.getHeader("RateLimit-Remaining") as string ?? "0",
            10
          );
          const current = maxRequests - remaining;
          const resetHeader = res.getHeader("RateLimit-Reset");
          const resetAt = resetHeader
            ? parseInt(resetHeader as string, 10) * 1000
            : Date.now() + windowMs;

          const info = this.buildRequestInfo(key, current, resetAt, false);
          this.config.onRequest!(req, res, info);

          return originalSend(body);
        };
      }

      limiter(req, res, next);
    };
  }

  /**
   * Returns a summary of the current configuration.
   * Useful for logging at startup.
   */
  public describe(): string {
    const { windowMs, maxRequests, statusCode } = this.config;
    return `RateLimiter [max=${maxRequests} req / ${windowMs}ms window, status=${statusCode}]`;
  }
}

export default RateLimiter;
