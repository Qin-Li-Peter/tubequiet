const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const coreSource = fs.readFileSync(path.join(root, 'extension/core/sanitize.js'), 'utf8');
const pageSource = fs.readFileSync(path.join(root, 'extension/content/page.js'), 'utf8');
const ctx = vm.createContext({ module: { exports: {} }, URL });
vm.runInContext(coreSource, ctx);
const { sanitize, isPlayerEndpoint } = ctx.module.exports;

test('removes player ad fields while preserving video, captions, playability and streams', () => {
  const data = { videoDetails: { videoId: 'demo' }, streamingData: { formats: [{ url: 'https://video.test/content' }] },
    playabilityStatus: { status: 'OK' }, captions: { tracks: ['English'] }, adPlacements: [{}], adSlots: [{}], playerAds: [{}] };
  assert.equal(sanitize(data).removed, 3);
  assert.equal(data.streamingData.formats[0].url, 'https://video.test/content');
  assert.equal(data.captions.tracks[0], 'English');
  assert.equal(data.playabilityStatus.status, 'OK');
});
test('nested playlist playerResponse is supported', () => {
  const data = [{ playerResponse: { adSlots: [1], captions: 'keep' } }];
  assert.equal(sanitize(data).removed, 1); assert.equal(data[0].playerResponse.captions, 'keep');
});
test('unrelated adSlots property and creator sponsorship text are untouched', () => {
  const data = { adSlots: 'a property in a comment example', description: 'Sponsored by someone', ads: [1] };
  assert.equal(sanitize(data).removed, 0); assert.equal(data.adSlots, 'a property in a comment example');
});
test('Shorts removes only explicit true flags, preserving false and absent flags', () => {
  const entry = isAd => ({ command: { reelWatchEndpoint: { adClientParams: { isAd } } } });
  const data = { entries: [entry(true), entry(false), entry('true'), entry(undefined), { video: 'ordinary' }] };
  assert.equal(sanitize(data).removed, 2); assert.equal(data.entries.length, 3);
});
test('cycles, frozen values, primitives and bounded traversal do not hang', () => {
  const cyclic = {}; cyclic.self = cyclic;
  assert.equal(sanitize(cyclic).removed, 0);
  assert.equal(sanitize(Object.freeze({ videoDetails: {}, adSlots: [] })).removed, 0);
  for (const value of [null, 42, 'hello', false]) assert.equal(sanitize(value).value, value);
  assert.equal(sanitize({ playerResponse: { adSlots: [] } }, { limit: 1 }).removed, 0);
});
test('recognized YouTube endpoints only; lookalikes, studio, media and arbitrary APIs excluded', () => {
  for (const url of ['/youtubei/v1/player?key=demo', '/youtubei/v1/next', '/youtubei/v1/reel/reel_watch_sequence']) assert.ok(isPlayerEndpoint(url, 'https://www.youtube.com/watch'));
  for (const url of ['https://youtube.com.evil.test/youtubei/v1/player', 'https://studio.youtube.com/youtubei/v1/player', 'https://music.youtube.com/youtubei/v1/player', 'http://youtube.com/youtubei/v1/player', '/youtubei/v1/account', 'https://r1.googlevideo.com/videoplayback', 'bad:invalid']) assert.equal(isPlayerEndpoint(url, 'https://www.youtube.com/'), false);
});

function harness(body, status = 200) {
  class XHR {
    open(method, url) { this.readyState = 1; this.raw = ''; this.responseType = ''; }
    get responseText() { if (this.responseType && this.responseType !== 'text') throw new Error('InvalidStateError'); return this.raw; }
    get response() { return this.raw; }
  }
  const response = new Response(body, { status, headers: { 'content-type': 'application/json', 'content-length': String(body?.length || 0) } });
  const context = vm.createContext({ URL, Response, Headers, Request, XMLHttpRequest: XHR,
    location: { href: 'https://www.youtube.com/watch?v=demo' }, fetch: async () => response });
  vm.runInContext(coreSource, context); vm.runInContext(pageSource, context);
  return { context, response, XHR };
}
test('initial player assignment is filtered synchronously and repeat assignment works', () => {
  const { context } = harness('{}');
  vm.runInContext('ytInitialPlayerResponse = {adSlots: [1], videoDetails: {videoId:"one"}}', context);
  assert.equal(context.ytInitialPlayerResponse.adSlots, undefined);
  vm.runInContext('ytInitialPlayerResponse = {adSlots: [2], videoDetails: {videoId:"two"}}', context);
  assert.equal(context.ytInitialPlayerResponse.videoDetails.videoId, 'two');
});
test('JSON parse preserves reviver and syntax errors', () => {
  const { context } = harness('{}');
  assert.equal(vm.runInContext('JSON.parse("{\\"n\\":2}",(k,v)=>k==="n"?v*2:v).n', context), 4);
  assert.throws(() => vm.runInContext('JSON.parse("bad")', context));
  assert.equal(vm.runInContext('JSON.parse("{\\"videoDetails\\":{},\\"adSlots\\":[1]}").adSlots', context), undefined);
});
test('fetch sanitizes matching responses and preserves status, body consumption and headers', async () => {
  const { context } = harness('{"videoDetails":{"videoId":"a"},"adSlots":[1]}');
  const result = await context.fetch('/youtubei/v1/player');
  assert.equal(result.status, 200); assert.equal(result.bodyUsed, false);
  assert.equal(result.headers.get('content-length'), null);
  assert.equal((await result.clone().json()).videoDetails.videoId, 'a');
  assert.equal((await result.json()).adSlots, undefined); assert.equal(result.bodyUsed, true);
});
test('fetch leaves non-matching endpoints, invalid JSON and errors unchanged', async () => {
  for (const [body, url, status] of [['{"adSlots":[1]}', 'https://example.com/youtubei/v1/player', 200], ['broken', '/youtubei/v1/player', 200], ['{"adSlots":[1]}', '/youtubei/v1/player', 403]]) {
    const { context, response } = harness(body, status); assert.equal(await context.fetch(url), response);
  }
});
test('fetch Request and URL inputs work, rejected requests stay rejected', async () => {
  for (const input of [new Request('https://www.youtube.com/youtubei/v1/player'), new URL('https://www.youtube.com/youtubei/v1/player')]) {
    const { context } = harness('{"adSlots":[1]}'); assert.equal((await (await context.fetch(input)).json()).adSlots, undefined);
  }
  const context = vm.createContext({ URL, location: { href: 'https://www.youtube.com/' }, fetch: async () => { throw new Error('offline'); } });
  vm.runInContext(coreSource, context); vm.runInContext(pageSource, context);
  await assert.rejects(context.fetch('/youtubei/v1/player'), /offline/);
});
test('XHR getters filter before page listeners and reset on reuse', () => {
  const { XHR } = harness('{}'); const xhr = new XHR();
  xhr.open('POST', '/youtubei/v1/player'); xhr.raw = '{"adSlots":[1],"videoDetails":{"videoId":"one"}}'; xhr.readyState = 4;
  assert.equal(JSON.parse(xhr.responseText).adSlots, undefined);
  assert.equal(JSON.parse(xhr.response).videoDetails.videoId, 'one');
  xhr.open('POST', '/youtubei/v1/account'); xhr.raw = '{"adSlots":[2]}'; xhr.readyState = 4;
  assert.deepEqual(JSON.parse(xhr.responseText).adSlots, [2]);
});
test('XHR json, blob and partial responses preserve native behavior', () => {
  const { XHR } = harness('{}'); const xhr = new XHR(); xhr.open('GET', '/youtubei/v1/player');
  xhr.raw = '{"adSlots":'; xhr.readyState = 3; assert.equal(xhr.responseText, '{"adSlots":');
  xhr.responseType = 'json'; xhr.raw = { adSlots: [1], videoDetails: {} }; xhr.readyState = 4;
  assert.equal(xhr.response.adSlots, undefined); assert.throws(() => xhr.responseText, /InvalidStateError/);
  xhr.open('GET', '/youtubei/v1/player'); xhr.responseType = 'blob'; xhr.raw = new Blob(['adSlots']); xhr.readyState = 4;
  assert.ok(xhr.response instanceof Blob);
});
test('injection is idempotent and existing page accessors are respected', () => {
  const { context } = harness('{}'); const first = context.fetch;
  vm.runInContext(pageSource, context); assert.equal(context.fetch, first);
  const other = vm.createContext({ URL, location: { href: 'https://www.youtube.com/' } });
  vm.runInContext('Object.defineProperty(globalThis,"ytInitialPlayerResponse",{get:()=>123,configurable:false})', other);
  vm.runInContext(coreSource, other); vm.runInContext(pageSource, other);
  assert.equal(other.ytInitialPlayerResponse, 123);
});
