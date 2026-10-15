# Changelog

## 0.2.0 — 2026-10-15

Improve handling of YouTube anti-adblock checks using the pinned uBlock Origin Lite 2026.914.1325 implementation.

- Replace the injected handwritten sanitizer with locally bundled, YouTube-scoped upstream scriptlet bindings for request/response processing, targeted experiment flags and iframe API reuse.
- Redirect the DoubleClick ad-status script to a bundled replacement at a higher priority than the general block rule. Declare only the required replacement resource for YouTube initiators.
- Add scoped ad-break, mid-roll and Googlesyndication request rules; eight network rules in total.
- Keep the compact English popup and local pause setting. No remote executable code or automatic upstream update is added.
- Include a reproducible upstream importer and GPL attribution. Retain the old sanitizer and tests as historical reference; they are no longer the injected runtime.

Validation: 27 automated tests, manifest/resource/syntax checks and packaging pass. In Chrome profile `li`, with uBOL and TubeQuiet 0.1.1 disabled, three sampled videos loaded without a visible anti-adblock prompt; in-page navigation and a full refresh were exercised. One refreshed sample advanced from 0:11 to 0:36. No TubeQuiet extension error indicator was shown. This does not guarantee detection avoidance for all accounts or future YouTube changes. See [validation](docs/VALIDATION.md).
