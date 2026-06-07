# IRONLOG-PHYSICAL-VOICE-PROOF-BLOCKED

**Status:** `release-copy-guardrail-patched-device-proof-blocked`
**Date:** 2026-06-07
**Bug:** BUG-059 (original), BUG-097 (voice monetization model)

## Blocker

Voice logging feature is **integration-complete** but **physically unproven on iPhone hardware**.

The entire code path exists:
- `VoiceLogService.swift` — speech recognition + TTS readback
- `VoiceLogParser.swift` — gym shorthand parsing (tested, 11 unit tests passing)
- `VoiceLogView.swift` — full-screen voice sheet UI
- `InlineVoiceFillerView.swift` — compact inline voice filler for AddPRSheet
- `IronLogProGate.voiceLogging` — correctly gated as FreeFeature, never paywalled
- `releaseClaimProofGated` guard active — prevents marketing claims before physical proof

## What Needs to Happen

A **physical iPhone** (not MacBook simulator) must demonstrate the full voice-to-saved-record flow:

1. Grant microphone + Speech recognition permissions on iPhone
2. Open voice sheet from Dashboard
3. Speak a gym shorthand phrase (e.g., "Bench press 185 for 5")
4. See parsed result card with movement name + reps
5. Confirm → record saved
6. Verify record appears in History

**Proof artifact:** Video or screenshot of the above flow on a physical iPhone.

## Why This Matters

- Feature gate `releaseClaimProofGated` is set for `.voiceLogging`
- `IronLogProGate.swift` correctly prevents marketing claims without physical proof
- Website still says "Voice logging (roadmap)" — correct until proof exists
- Once physical proof exists: update website, App Store screenshots, release notes

## References

- `fairway/ios/Fairway/Services/VoiceLogService.swift`
- `fairway/ios/Fairway/Services/IronLogProGate.swift` (line 43: `case voiceLogging`, line 59-63: `releaseClaimProofGated`)
- `fairway/FEATURES.md` (voice status: "rehearsal-partial + research-gated")
- `fairway/bugs.md` (BUG-059, BUG-097)
