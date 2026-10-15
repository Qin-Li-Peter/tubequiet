// SPDX-License-Identifier: GPL-3.0-or-later
export const MATCHES = ['https://www.youtube.com/*', 'https://m.youtube.com/*', 'https://youtube.com/*'];
export const SCRIPT = { id: 'tubequiet-page-v1', matches: MATCHES,
  js: ['vendor/ubol-youtube.js'], runAt: 'document_start', world: 'MAIN',
  allFrames: true, persistAcrossSessions: true };
export const RULESET = 'youtube_ads';
export const RULE_REVISION = '2026-10-15.ubol-2026.914.1325';
