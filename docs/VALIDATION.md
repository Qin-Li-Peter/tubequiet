# Validation — 2026-10-15

Version: 0.2.0. Local development build, not submitted to the Chrome Web Store.

- `npm test`: 27 tests pass; 23 historical tests plus 4 upstream integration/rule tests. Historical handwritten-filter tests remain reference coverage, not coverage of the deployed replacement.
- Imported runtime tests verify initial player ad removal while retaining video identity, targeted experiment flags, no hooks on unrelated hosts, and ad-status redirect precedence/resource behavior.
- `npm run check` and `npm run package` pass. Eight network rules and all packaged JavaScript are validated.
- Chrome profile `li`: 0.2.0 loaded from the repository's `extension/` folder, ID `mcmiadokfmdpnojgbkokcicjapkmdhej`; popup shows **Ads blocked**. Old TubeQuiet 0.1.1 and uBOL were disabled during the sample.
- Direct load: `watch?v=7xTGNNLPyMI` played ordinary content around 7:03–7:05.
- In-page recommendation navigation: `watch?v=zjkBMFhNj_g&t=9s` played ordinary content with captions and no visible anti-adblock prompt. After a full refresh with the final manifest, playback advanced from 0:11 to 0:36.
- Another channel sample, `watch?v=7qO8-kx3gW8`, loaded ordinary 32:31 content and reached 0:04 without a visible anti-adblock prompt.
- Chrome showed no Errors button for TubeQuiet 0.2.0 after testing. The disabled uBOL installation had an existing error indicator; that is not a TubeQuiet result.
- These observations do not reproduce the original warning in a controlled before/after trial, prove that an ad was offered, or guarantee future/other-account detection outcomes. Long-play mid-rolls, Shorts, playlists, live streams, signed-out use and browser restart are not comprehensively verified.
- Upstream is pinned to uBOL 2026.914.1325 (commit 9e3decacd19a5e16d67083cb76fabe1f8c5c3f29). Future YouTube changes can require refreshed rules and revalidation.

---

## Historical 0.1.1 validation (not evidence for current runtime)

# Validation — 2026-09-17

Version: 0.1.1. Development build, not submitted to Chrome Web Store.

## Automated verification

23 Node tests pass. Coverage includes player/Shorts filtering, unrelated content preservation, endpoint restrictions, initial response hooks, JSON/fetch/XHR behavior, duplicate injection, settings rollback and serialization, sender validation, exact-host tab reload, reload failure reporting, and popup loading/saving/failure states. Manifest, referenced resources, JavaScript syntax and scoped rule checks pass.

## Browser verification

- Chrome profile `wu`, without uBlock; the existing uBlock installation in `li` was not changed.
- Chrome loaded version 0.1.1 successfully. The actual popup has the chosen compact monochrome layout: name, state, switch.
- Switching off showed **Ads allowed**; reopening preserved the setting.
- On `watch?v=CuVo2cM6V6Q`, the off state displayed a Seedance pre-roll and companion advertising. Switching on automatically reloaded the page and exposed the ordinary 37:30 video, with no Sponsored placement in the inspected accessibility tree.
- Following a recommendation to `watch?v=XBu54nfzxAQ` tested YouTube's in-page navigation. The 12:57 regular video played with protection enabled.
- Turning protection off on that second video automatically reloaded it; a Sponsored placement appeared. Turning protection on triggered another reload. The popup subsequently confirmed **Ads blocked**; the regular video reached 1:08 before being paused. No extension Errors button appeared after the tests.
- The real popup source was also exercised in a local browser harness with a stubbed extension API: pointer and Space-key changes both updated the state. This is UI coverage, not independent evidence of ad blocking.

## Limits

These are sampled checks, not a guarantee for every account, region or ad experiment. Ad inventory is nondeterministic. Long-play mid-rolls, live streams, playlists, Shorts, signed-out use and browser restart have not been comprehensively tested. Continue wider testing before store publication. No server-side ad coverage or anti-adblock bypass guarantee.

## Publication prerequisites

Provide publisher contact and a publicly hosted privacy policy, capture a privacy-safe real product screenshot, and complete store disclosures. See PUBLISH.zh-CN.md.
