# Third-party notices and rule provenance

TubeQuiet is licensed under GPL-3.0-or-later. Copyright (C) 2026 TubeQuiet contributors.

The YouTube field names, endpoint targeting approach and cosmetic selector strategy were informed by uBlock Origin / uBlock Origin Lite, Copyright (C) Raymond Hill and contributors, GPL-3.0-or-later:
- https://github.com/uBlockOrigin/uBOL-home
- Reference commit: 9e3decacd19a5e16d67083cb76fabe1f8c5c3f29
- Reference package: chromium/rulesets/scripting/scriptlet/main/ublock-filters.js
- uBlock source commit: 7845ccde2967e4cac17d2d6a3d880c8ea50130d3
- https://github.com/gorhill/uBlock

TubeQuiet originally implemented a small, separately written runtime. It does not bundle the uBlock engine, its logos, a complete filter-list database, or remote executable code. It retains GPL-compatible distribution and includes the full license. It is not endorsed by the upstream project.

All executable JavaScript in the extension directory is readable preferred-form source; no minification, compilation or dependency installation is needed to load it. The release also includes a corresponding-source ZIP with tests, documentation and packaging scripts. Redistributors must retain this notice and GPL rights. A private development repository does not replace the source obligations when distributing a GPL-covered release.

YouTube is a trademark of Google LLC. TubeQuiet is an independent project.

## 0.2.0 upstream runtime import

YouTube scriptlet bindings and readable helpers are adapted directly from uBOL 2026.914.1325 at the reference commit above (Raymond Hill and contributors, GPL-3.0-or-later). scripts/import-ubol.mjs reproduces the scoped import. Only youtube.com and www.youtube.com bindings are retained; wildcard, entity, ancestor and regex domain bindings are disabled. The previous handwritten sanitizer is retained as reference and is no longer injected. The ad-status replacement is also imported from that package. This release bundles upstream scriptlet helpers, but not the complete uBlock engine or filter database.
