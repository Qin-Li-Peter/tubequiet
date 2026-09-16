# Validation — 2026-09-17

Version: 0.1.0. Development build; not submitted to Chrome Web Store.

## Automated checks

18 Node tests pass locally and in GitHub Actions: field filtering, ordinary content preservation, Shorts true/false flags, cyclic/frozen/bounded data, endpoint host checks, early initial-response hooks, JSON errors/revivers, fetch response handling and failures, XHR timing/reuse/types, duplicate injection, background enable/disable, rollback, serialization and sender validation.

Static checks validate MV3 manifest, file references, JavaScript syntax, scoped permissions and DNR rule shape. These do not substitute for Chrome's own runtime or real ad-inventory testing.

## Live Chrome evidence

A separate existing profile without uBlock was used. The user's existing uBlock installation in their usual profile was not modified.

- Unpacked extension loaded successfully at version 0.1.0; no Errors button on its card.
- Popup showed Protection enabled and a valid rules revision.
- Pause saved successfully; reopening the popup showed Protection paused.
- In the paused state, a real YouTube watch page displayed a Base44 pre-roll with Sponsored and Skip controls, plus a companion advertisement. This establishes that the test profile receives ads.
- Enabled playback comparison: not completed. Native Chrome control repeatedly stopped because the foreground window changed while the user was working. No enabled-state ad-removal claim is made. Last confirmed setting was Protection paused; inspect the popup before resuming tests.

## Release gate

Do not present this development release as broadly verified yet. Complete and record:

- Enabled playback comparison on the same video and additional ad-supported videos.
- SPA navigation between videos, back/forward, playlist next item, Shorts, captions, seeking, fullscreen.
- Mid-roll and long-play sessions; both signed-in and signed-out cases if available.
- Protection pause/resume followed by reload, browser restart persistence, unavailable/restricted video preservation.
- Check the extension Errors panel after browsing. Disable other blockers during comparisons.
- At least one real, privacy-safe store screenshot; hosted privacy policy with publisher contact; final store disclosures.

A single ad-free load does not prove a block: ad inventory is randomized. Record both positive and negative outcomes without claiming 100% removal. No server-side ad coverage or anti-adblock-bypass guarantee.
