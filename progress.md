# ironlog.co — progress

Per `~/.claude/CLAUDE.md` per-project doctrine. Current state + done/pending so any agent picks up cold without re-investigating.

## Stack

- **Static HTML/CSS** for `/`, `/privacy/`, `/terms/`, `/support/`
- **Cloudflare Pages** auto-deploy on push to `lightcloud00/ironlog-media:main`
- **Cloudflare Pages Function** at `functions/api/contact.ts` (TypeScript) backed by KV namespace binding `LEADS` for contact-form lead capture
- **Routing:** `_routes.json` forces CF Pages function activation
- **Email obfuscation:** Cloudflare auto-rewrites `mailto:` links at the edge (not a content drift)

## Live state (as of 2026-05-14)

- `https://ironlog.co/` → HTTP 200, `Free-first today. No purchase prompt in review.` hero copy
- `/privacy/`, `/terms/`, `/support/` → HTTP 200, all four routes synced with local repo
- Last deploy: commit `50201d7` (May 13, 2026) — free-first review copy aligned

## Done

- ✅ Free-first review copy aligned with Fairway app (commit `50201d7`, deployed live)
- ✅ Apple EULA link added to footer + Section 4 of terms (commit `82864b8`)
- ✅ Paid v2 legal and pricing copy aligned (commit `45317dc`)
- ✅ Contact preflight headers restored (commit `d24cdc1`)
- ✅ KV-backed contact function active (commit `158367c`)
- ✅ HealthKit privacy section removed to match actual app code (commit `27bef17`)
- ✅ GH Issues #1 and #2 (April 10) verified resolved by prior commits (2026-05-14)

## Pending

_None blocking._

### Future Pro relaunch checklist (when IronLog Pro returns)

- Update site pricing section with actual monthly/annual prices
- Update terms/privacy to reflect active subscription terms
- Add restore/manage purchase copy where appropriate
- Verify ASC metadata matches site copy before re-submission

## Notes

- The IronLog iOS app source lives at [`/Users/gus/Desktop/fairway`](file:///Users/gus/Desktop/fairway), historically owned by Codex (parked through 2026-05-19 quota refresh as of this writing).
- Pro product IDs in Fairway: `com.gusdigitalsolutions.ironlog.pro.monthly` + `com.gusdigitalsolutions.ironlog.pro.annual` — currently suppressed via `freeFirstSubmission = true` flag.
- Cloudflare API token for CF Pages deploys: CredVault key `cloudworkersapikeygusdigitalpaid` (per memory `credvault-cf-tokens-service-type-unknown.md`). Auto-deploy on push doesn't require it; only manual `wrangler pages deploy` does.
- Pages auto-deploy webhook: triggered by GitHub push to `lightcloud00/ironlog-media:main`.
