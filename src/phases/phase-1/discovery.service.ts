import type { GithubUserType } from "./discovery.types.js";

/** Structured result returned by fetchUsers */
export interface DiscoveryPageResult {
  users: GithubUserType[];
  /** Total matches GitHub reports (may exceed what we can paginate) */
  totalCount: number;
  /** True if more pages likely exist beyond this one */
  hasMore: boolean;
  /** The page number that was fetched */
  page: number;
}

const PER_PAGE = 30;

/**
 * How many times to retry when GitHub responds with 429.
 * Attempt 1 → wait 5s, Attempt 2 → wait 10s, Attempt 3 → wait 15s …
 */
const MAX_RETRIES = 5;

/** Base delay added per retry attempt (milliseconds). */
const RETRY_BASE_DELAY_MS = 5_000;

class discoveryClass {
  // ─── Private helpers ───────────────────────────────────────────────────────

  /** Pauses execution for the given number of milliseconds. */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calculates wait time for a given attempt number (incremental backoff).
   * Attempt 1 → 5 000 ms
   * Attempt 2 → 10 000 ms
   * Attempt 3 → 15 000 ms  … and so on.
   */
  private retryDelay(attempt: number): number {
    return RETRY_BASE_DELAY_MS * attempt;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Fetches one page of GitHub users for the given query.
   *
   * Rate-limit handling (429 Too Many Requests):
   *   Retry 1 → wait 5s  → try again
   *   Retry 2 → wait 10s → try again
   *   Retry 3 → wait 15s → try again
   *   … up to MAX_RETRIES. After that, throws.
   *
   * Any other non-ok status code throws immediately without retrying.
   */
  async fetchUsers(query: string, page: number): Promise<DiscoveryPageResult> {
    const url =
      `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;

    let attempt = 0;

    while (true) {
      try {
        const response = await fetch(url);

        // ── 429: Too Many Requests — wait and retry ────────────────────────
        if (response.status === 429) {
          attempt++;

          if (attempt > MAX_RETRIES) {
            throw new Error(
              `GitHub rate limit hit. Exhausted all ${MAX_RETRIES} retries. Please wait and try again later.`
            );
          }

          const waitMs = this.retryDelay(attempt);
          const waitSec = waitMs / 1000;

          console.warn(
            `[Discovery] ⚠️  GitHub returned 429 (Too Many Requests). ` +
            `Retry ${attempt}/${MAX_RETRIES} — waiting ${waitSec}s before retrying page ${page}...`
          );

          await this.sleep(waitMs);
          continue; // retry the same fetch
        }

        // ── Any other non-ok status — throw immediately ────────────────────
        if (!response.ok) {
          throw new Error(
            `GitHub API returned ${response.status}: ${response.statusText}`
          );
        }

        // ── Success — parse and return ─────────────────────────────────────
        const rawUsers = await response.json();

        const totalCount: number = rawUsers.total_count ?? 0;
        const items: GithubUserType[] = rawUsers.items ?? [];

        // De-duplicate within the page by user ID and exclude site admins
        const seenIds = new Set<number>();
        const users = items.filter((user: GithubUserType) => {
          const isValid = !user.site_admin;
          const isUnique = !seenIds.has(user.id);

          if (isValid && isUnique) {
            seenIds.add(user.id);
            return true;
          }

          return false;
        });

        // GitHub caps pagination at 1000 results (page * PER_PAGE)
        const hasMore =
          items.length === PER_PAGE &&
          page * PER_PAGE < Math.min(totalCount, 1000);

        if (attempt > 0) {
          console.log(`[Discovery] ✅ Retry ${attempt} succeeded for page ${page}.`);
        }

        return { users, totalCount, hasMore, page };

      } catch (error: any) {
        throw new Error(`Discovery fetchUsers failed: ${error.message}`);
      }
    }
  }
}

export default new discoveryClass();

