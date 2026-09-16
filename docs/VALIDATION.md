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
