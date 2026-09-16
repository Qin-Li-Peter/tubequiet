/* SPDX-License-Identifier: GPL-3.0-or-later */
(() => {
  'use strict';
  if (globalThis.__tubeQuietInstalled) return;
  const core = globalThis.__tubeQuietCore;
  if (!core) return;
  Object.defineProperty(globalThis, '__tubeQuietInstalled', { value: true });
  const parse = JSON.parse;
  const stringify = JSON.stringify;
  const apply = Reflect.apply;
  const MAX_TEXT = 2 * 1024 * 1024;
  const marker = /"(?:adPlacements|adSlots|playerAds|adClientParams)"/;
  const clean = (value, trustedPlayer = false) => {
    try { return core.sanitize(value, { trustedPlayer }).value; } catch { return value; }
  };

  // Capture the initial response before YouTube consumes it. Respect existing
  // accessor/non-configurable properties instead of breaking another extension.
  const trap = key => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
      if (descriptor && (!descriptor.configurable || descriptor.get || descriptor.set || descriptor.writable === false)) return;
      let value = clean(descriptor?.value, key === 'ytInitialPlayerResponse');
      Object.defineProperty(globalThis, key, {
        configurable: true, enumerable: descriptor?.enumerable ?? true,
        get: () => value,
        set: next => { value = clean(next, key === 'ytInitialPlayerResponse'); },
      });
    } catch { /* A page may already own a non-configurable property. */ }
  };
  trap('ytInitialPlayerResponse');
  trap('ytInitialData');

  JSON.parse = new Proxy(parse, {
    apply(target, receiver, args) {
      const value = apply(target, receiver, args); // Preserve syntax errors/reviver semantics.
      const text = args[0];
      return typeof text === 'string' && text.length <= MAX_TEXT && marker.test(text) ? clean(value) : value;
    },
  });

  if (typeof globalThis.fetch === 'function') {
    globalThis.fetch = new Proxy(globalThis.fetch, {
      async apply(target, receiver, args) {
        const response = await apply(target, receiver, args); // Network failures propagate normally.
        const input = args[0];
        const url = typeof input === 'string' || input instanceof URL ? String(input) : input?.url;
        if (!core.isPlayerEndpoint(url, location.href) || !response.ok) return response;
        if (Number(response.headers.get('content-length')) > MAX_TEXT) return response;
        try {
          const text = await response.clone().text();
          if (text.length > MAX_TEXT || !marker.test(text)) return response;
          const data = apply(parse, JSON, [text]);
          const result = core.sanitize(data, { trustedPlayer: /\/player\/?(?:\?|$)/.test(new URL(url, location.href).pathname) });
          if (!result.removed) return response;
          const headers = new Headers(response.headers);
          headers.delete('content-length'); headers.delete('content-encoding');
          const next = new Response(apply(stringify, JSON, [data]), {
            status: response.status, statusText: response.statusText, headers,
          });
          for (const key of ['url', 'type', 'redirected']) Object.defineProperty(next, key, { value: response[key] });
          return next;
        } catch { return response; }
      },
    });
  }

  // Getter interception runs before ANY page read, regardless of listener order.
  // State is per XHR and reset by open(), so reusing an XHR never replays old data.
  if (typeof XMLHttpRequest !== 'undefined') {
    const proto = XMLHttpRequest.prototype;
    const open = proto.open;
    const textDescriptor = Object.getOwnPropertyDescriptor(proto, 'responseText');
    const responseDescriptor = Object.getOwnPropertyDescriptor(proto, 'response');
    const states = new WeakMap();
    function transform(xhr, raw) {
      const state = states.get(xhr);
      if (!state?.target || xhr.readyState !== 4) return raw;
      if (state.hasCache && state.raw === raw) return state.value;
      let value = raw;
      try {
        if (typeof raw === 'string' && raw.length <= MAX_TEXT && marker.test(raw)) {
          const data = apply(parse, JSON, [raw]);
          const result = core.sanitize(data, { trustedPlayer: state.player });
          if (result.removed) value = apply(stringify, JSON, [data]);
        } else if (xhr.responseType === 'json' && raw && typeof raw === 'object') value = clean(raw, state.player);
      } catch { /* Keep invalid JSON, streaming, blobs, and failures unchanged. */ }
      state.hasCache = true; state.raw = raw; state.value = value;
      return value;
    }
    proto.open = new Proxy(open, {
      apply(target, receiver, args) {
        const result = apply(target, receiver, args);
        const url = String(args[1]);
        states.set(receiver, { target: core.isPlayerEndpoint(url, location.href), player: /\/player\/?(?:\?|$)/.test(url) });
        return result;
      },
    });
    for (const [name, desc] of [['responseText', textDescriptor], ['response', responseDescriptor]]) {
      if (!desc?.get || !desc.configurable) continue;
      Object.defineProperty(proto, name, {
        ...desc, get() { return transform(this, apply(desc.get, this, [])); },
      });
    }
  }
})();
