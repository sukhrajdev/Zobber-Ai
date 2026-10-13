import "dotenv/config";
import phase1 from "./phases/phase-1/phase-1.js";
import phase2 from "./phases/phase-2/phase-2.js";
import phase4 from "./phases/phase-4/phase-4.js";
/**
 * Zobber AI — Main Pipeline Entry Point
 *
 * Execution order:
 *   Phase 1  → Discover GitHub users by keyword (with page-retry)
 *   Phase 2/3 → Enrich profiles, Jev AI classify, generate personalised email
 *   Phase 4  → Dispatch cold outreach emails + report
 *
 * Auto-retry: if Phase 2 finds 0 qualified leads on page N,
 *             it automatically fetches page N+1 and tries again.
 */
async function run() {
    // ─── Banner ────────────────────────────────────────────────────────────────
    console.log("==================================================");
    console.log("🤖  Zobber AI — Automated Outreach Pipeline");
    console.log("==================================================\n");
    // ─── Resolve search query ──────────────────────────────────────────────────
    // Priority: CLI arg → SEARCH_QUERY env var → default "founder"
    const searchQuery = process.argv[2] ?? process.env.SEARCH_QUERY ?? "founder";
    console.log(`🔍 Search Query : "${searchQuery}"`);
    console.log(`📅 Started At   : ${new Date().toISOString()}\n`);
    // ─── Phase 1 + 2/3: Discovery with page-retry loop ─────────────────────────
    console.log("--------------------------------------------------");
    console.log("📡 [Phase 1] Starting GitHub User Discovery...");
    console.log("--------------------------------------------------");
    let qualifiedLeads = [];
    let currentPage = 1;
    let hasMore = true;
    while (hasMore && qualifiedLeads.length === 0) {
        // — Phase 1: fetch one page of raw GitHub users —
        let pageResult;
        try {
            pageResult = await phase1.getUserPage(searchQuery, currentPage);
        }
        catch (err) {
            console.error(`❌ [Phase 1] Discovery failed on page ${currentPage}: ${err.message}`);
            process.exit(1);
        }
        hasMore = pageResult.hasMore;
        if (pageResult.users.length === 0) {
            console.log(`⚠️  [Phase 1] Page ${currentPage} returned 0 users. ${hasMore ? `Trying page ${currentPage + 1}...` : "No more pages available."}`);
            currentPage++;
            continue;
        }
        console.log(`\n✅ [Phase 1] Page ${currentPage}: ${pageResult.users.length} raw user(s) discovered.\n`);
        // — Phase 2+3: Enrich → Jev classify → generate email —
        console.log("--------------------------------------------------");
        console.log(`🧠 [Phase 2/3] Processing page ${currentPage} — enriching & classifying via Jev AI...`);
        console.log("--------------------------------------------------\n");
        try {
            qualifiedLeads = await phase2.processDiscoveredUsers(pageResult.users);
        }
        catch (err) {
            console.error(`❌ [Phase 2/3] Pipeline error on page ${currentPage}: ${err.message}`);
            process.exit(1);
        }
        if (qualifiedLeads.length === 0) {
            if (hasMore) {
                console.log(`\n⚠️  [Phase 2/3] 0 qualified leads on page ${currentPage}. Automatically retrying with page ${currentPage + 1}...\n`);
                currentPage++;
            }
            else {
                console.log(`\n⚠️  [Phase 2/3] 0 qualified leads on page ${currentPage} and no more pages available.`);
            }
        }
    }
    // ─── Guard: nothing found across all pages tried ──────────────────────────
    if (qualifiedLeads.length === 0) {
        console.log("\n❌ No qualified leads found after exhausting available pages.");
        console.log("💡 Tip: Try a broader search query (e.g. \"cto\", \"head of hr\", \"engineering manager\").");
        process.exit(0);
    }
    console.log(`\n✅ [Phase 2/3] ${qualifiedLeads.length} qualified lead(s) ready for outreach (found on page ${currentPage}).\n`);
    // ─── Phase 4: Cold Email Dispatch ─────────────────────────────────────────
    console.log("--------------------------------------------------");
    console.log("📬 [Phase 4] Starting cold email outreach campaign...");
    console.log("--------------------------------------------------\n");
    let report;
    try {
        report = await phase4.sendOutreach(qualifiedLeads);
    }
    catch (err) {
        console.error(`❌ [Phase 4] Email dispatch error: ${err.message}`);
        process.exit(1);
    }
    // ─── Done ──────────────────────────────────────────────────────────────────
    console.log("==================================================");
    console.log("🏁  Zobber AI Pipeline Complete");
    console.log(`📊 Sent: ${report.successfulCount} | Failed: ${report.failedCount} | Skipped: ${report.skippedCount}`);
    console.log(`📅 Finished At : ${new Date().toISOString()}`);
    console.log("==================================================\n");
}
// ─── Bootstrap ──────────────────────────────────────────────────────────────
run().catch((err) => {
    console.error("💥 Unhandled fatal error:", err.message ?? err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map