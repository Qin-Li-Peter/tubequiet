/* SPDX-License-Identifier: GPL-3.0-or-later
 * TubeQuiet contributors. See THIRD_PARTY_NOTICES.md for rule provenance.
 * No network access, timers, DOM access, or Chrome APIs in this module.
 */
(() => {
  'use strict';
  const AD_KEYS = ['adPlacements', 'adSlots', 'playerAds'];
  const HOSTS = new Set(['www.youtube.com', 'm.youtube.com', 'youtube.com']);
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const object = v => v !== null && typeof v === 'object';

  function isPlayerEndpoint(input, base) {
    try {
      const url = new URL(input, base);
      return url.protocol === 'https:' && HOSTS.has(url.hostname) &&
        /^\/youtubei\/v1\/(player|next|reel\/reel_watch_sequence)\/?$/.test(url.pathname);
    } catch { return false; }
  }

  // Bounded, iterative traversal. Only recognized player objects and explicit
  // Shorts ad entries are changed; ordinary video cards/text/streams survive.
  function sanitize(root, { trustedPlayer = false, limit = 12000 } = {}) {
    if (!object(root)) return { value: root, removed: 0 };
    const stack = [{ node: root, player: trustedPlayer }];
    const seen = new WeakSet();
    let removed = 0, visited = 0;
    while (stack.length && visited++ < limit) {
      const { node, player } = stack.pop();
      if (!object(node) || seen.has(node)) continue;
      seen.add(node);
      const recognized = player || own(node, 'videoDetails') || own(node, 'playabilityStatus') || own(node, 'streamingData');
      if (recognized) {
        for (const key of AD_KEYS) {
          try { if (own(node, key) && Reflect.deleteProperty(node, key)) removed++; } catch { /* Frozen object: fail open. */ }
        }
      }
      if (Array.isArray(node.entries)) {
        // Presence alone is insufficient: false must never remove normal Shorts.
        const keep = node.entries.filter(entry => {
          const value = entry?.command?.reelWatchEndpoint?.adClientParams?.isAd;
          return value !== true && value !== 'true';
        });
        if (keep.length !== node.entries.length) {
          try { const n = node.entries.length - keep.length; node.entries = keep; removed += n; } catch { /* fail open */ }
        }
      }
      for (const key of Object.keys(node)) {
        // Avoid invoking accessors on page-owned objects.
        const desc = Object.getOwnPropertyDescriptor(node, key);
        if (desc && 'value' in desc && object(desc.value)) {
          stack.push({ node: desc.value, player: key === 'playerResponse' });
        }
      }
    }
    return { value: root, removed };
  }

  const api = Object.freeze({ sanitize, isPlayerEndpoint });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.defineProperty(globalThis, '__tubeQuietCore', { value: api, configurable: true });
})();
