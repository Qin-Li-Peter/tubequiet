# Third-party notices and rule provenance

TubeQuiet is licensed under GPL-3.0-or-later. Copyright (C) 2026 TubeQuiet contributors.

The YouTube field names, endpoint targeting approach and cosmetic selector strategy were informed by uBlock Origin / uBlock Origin Lite, Copyright (C) Raymond Hill and contributors, GPL-3.0-or-later:
- https://github.com/uBlockOrigin/uBOL-home
- Reference commit: 9e3decacd19a5e16d67083cb76fabe1f8c5c3f29
- Reference package: chromium/rulesets/scripting/scriptlet/main/ublock-filters.js
- uBlock source commit: 7845ccde2967e4cac17d2d6a3d880c8ea50130d3
- https://github.com/gorhill/uBlock

TubeQuiet implements a small, separately written runtime. It does not bundle the uBlock engine, its logos, a complete filter-list database, or remote executable code. It retains GPL-compatible distribution and includes the full license. It is not endorsed by the upstream project.

All executable JavaScript in the extension directory is readable preferred-form source; no minification, compilation or dependency installation is needed to load it. The release also includes a corresponding-source ZIP with tests, documentation and packaging scripts. Redistributors must retain this notice and GPL rights. A private development repository does not replace the source obligations when distributing a GPL-covered release.

YouTube is a trademark of Google LLC. TubeQuiet is an independent project.
