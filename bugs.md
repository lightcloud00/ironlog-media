# ironlog.co — bugs

Per `~/.claude/CLAUDE.md` per-project doctrine. Append-only index; one row per bug. Treat live `ironlog.co` as production.

## Open

_None._

## Closed

### 2026-05-14 — GH #1: Sync deployed privacy/terms/support pages back into the repo

- **Filed:** 2026-04-10 by lightcloud00
- **Closed:** 2026-05-14 by claude-code (worktree practical-keller)
- **Status:** Resolved by prior commits before this audit
- **Verification:** Live ↔ repo diff on `index.html`, `privacy/index.html`, `terms/index.html`, `support/index.html` shows only Cloudflare automatic email obfuscation rewrites (`/cdn-cgi/l/email-protection` + `email-decode.min.js` injection). All 4 routes return HTTP 200 and all 4 source files exist in the repo. Reproducibility is intact.
- **Reference:** [GH lightcloud00/ironlog-media#1](https://github.com/lightcloud00/ironlog-media/issues/1)

### 2026-05-14 — GH #2: Align live pricing and feature claims with the actual IronLog app

- **Filed:** 2026-04-10 by lightcloud00
- **Closed:** 2026-05-14 by claude-code
- **Status:** Resolved by prior copy refresh (last alignment commit `50201d7`, May 13 deploy)
- **Verification:**
  - Apple Watch mentions on site: **none** (grep across all 4 routes)
  - RevenueCat mentions on site: **none**
  - Pro-gating language on site: **none** (no "Unlock Pro", "Pro-only", etc.)
  - Subscription references are conservative: "Future Paid Layer / Not enabled", "No subscription terms are active in this review build", "Any future pricing will be disclosed before purchase"
  - Cross-reference Fairway (canonical IronLog iOS source): `freeFirstSubmission = true` flag active in `ios/Fairway/Config.swift:4` and `ios/Fairway/ContentView.swift:178`; paywall presentation gated by `freeFirstSubmission && !usesMockPaywallCatalog`
  - No `Watch*` target directory exists in `ios/` (Fairway has no Apple Watch target)
- **Reference:** [GH lightcloud00/ironlog-media#2](https://github.com/lightcloud00/ironlog-media/issues/2)
