// Import only YouTube bindings; retain upstream's readable scriptlet helpers.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.argv[2];
assert.ok(root, 'Usage: node scripts/import-ubol.mjs /path/to/uBOL-home');
let source = fs.readFileSync(path.join(root, 'chromium/rulesets/scripting/scriptlet/main/ublock-filters.js'), 'utf8');
function read(name) {
  const re = new RegExp('const \\$' + name + '\\$ = /\\*.*?\\*/ (.*);');
  return JSON.parse(source.match(re)[1]);
}
function replace(name, value) {
  const re = new RegExp('(const \\$' + name + '\\$ = /\\*.*?\\*/ ).*;');
  source = source.replace(re, (_, prefix) => prefix + JSON.stringify(value) + ';');
}
const hosts = read('scriptletHostnames'), refs = read('scriptletArglistRefs').split(';');
const selected = ['youtube.com', 'www.youtube.com'];
replace('scriptletHostnames', selected);
replace('scriptletArglistRefs', selected.map(h => refs[hosts.indexOf(h)]).join(';'));
source = source.replace('const $hasEntities$ = true;', 'const $hasEntities$ = false;')
 .replace('const $hasAncestors$ = true;', 'const $hasAncestors$ = false;')
 .replace('const $hasRegexes$ = true;', 'const $hasRegexes$ = false;');
replace('scriptletFromRegexes', []);
// Negative references are upstream exception entries (~index); apply them before emitting bindings.
// Drop unreferenced filter arguments and remap the remaining references.
const args = read('scriptletArgs'), lists = read('scriptletArglists').split(';');
const hostRefs = selected.map(h => refs[hosts.indexOf(h)].split(',').filter(Boolean).map(Number));
const used = [...new Set(hostRefs.flat().filter(i => i > 0))];
assert.ok(used.every(i => i > 0));
assert.ok(selected.every(h => hosts.includes(h)), 'Upstream host table changed; review importer');
const argMap = new Map(), compactArgs = [], compactLists = [''];
for (const index of used) {
 const [fn, ...indices] = lists[index].split(',').map(Number);
 compactLists.push([fn, ...indices.map(i => {
  if (!argMap.has(i)) { argMap.set(i, compactArgs.length); compactArgs.push(args[i]); }
  return argMap.get(i);
 })].join(','));
}
replace('scriptletArgs', compactArgs);
replace('scriptletArglists', compactLists.join(';'));
replace('scriptletArglistRefs', hostRefs.map(rr => rr.filter(i => i > 0 && !rr.includes(~i)).map(i => used.indexOf(i)+1).join(',')).join(';'));
source = '// YouTube-only bindings imported by scripts/import-ubol.mjs. See THIRD_PARTY_NOTICES.md.\n' + source;
fs.mkdirSync('extension/vendor', { recursive: true });
fs.writeFileSync('extension/vendor/ubol-youtube.js', source);
fs.mkdirSync('extension/web_accessible_resources', { recursive: true });
fs.copyFileSync(path.join(root, 'chromium/web_accessible_resources/doubleclick_instream_ad_status.js'), 'extension/web_accessible_resources/ad-status.js');
console.log(`Imported ${used.length} YouTube scriptlet bindings; no wildcard or unrelated-site bindings.`);
