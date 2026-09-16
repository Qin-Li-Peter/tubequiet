import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { SCRIPT } from '../extension/config.js';
import { execFileSync } from 'node:child_process';
const dir = path.resolve('extension');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json')));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.version, JSON.parse(fs.readFileSync('package.json')).version);
assert.deepEqual([...manifest.permissions].sort(), ['declarativeNetRequest', 'scripting', 'storage']);
assert.equal(manifest.host_permissions.length, 3);
for (const host of manifest.host_permissions) assert.match(host, /^https:\/\/(www\.|m\.)?youtube\.com\/\*$/);
const files = fs.readdirSync(dir, { recursive: true }).filter(f => !f.split(path.sep).includes('_metadata') && fs.statSync(path.join(dir, f)).isFile());
for (const f of files.filter(f => f.endsWith('.js'))) execFileSync(process.execPath, ['--check', path.join(dir, f)]);
for (const f of files.filter(f => f.endsWith('.json'))) JSON.parse(fs.readFileSync(path.join(dir, f)));
const required = [manifest.options_page, ...SCRIPT.js, manifest.background.service_worker, manifest.action.default_popup, ...Object.values(manifest.icons), 'LICENSE.txt', 'THIRD_PARTY_NOTICES.md', ...manifest.content_scripts.flatMap(s => [...s.js, ...s.css]), ...manifest.declarative_net_request.rule_resources.map(r => r.path)];
for (const f of required) assert.ok(fs.existsSync(path.join(dir, f)), `Missing ${f}`);
const rules = JSON.parse(fs.readFileSync(path.join(dir, 'rules/youtube.json')));
assert.equal(new Set(rules.map(r => r.id)).size, rules.length);
for (const rule of rules) {
  assert.equal(rule.action.type, 'block');
  assert.ok(rule.condition.initiatorDomains.every(h => ['www.youtube.com','m.youtube.com','youtube.com'].includes(h)));
  assert.ok(!rule.condition.requestDomains?.includes('googlevideo.com'));
}
for (const file of files.filter(f => /\.(js|html)$/.test(f))) {
  const text = fs.readFileSync(path.join(dir, file), 'utf8');
  assert.ok(!/\beval\s*\(|new Function\s*\(|<script[^>]+src=["']https?:/.test(text), `Remote/dynamic code: ${file}`);
}
console.log(`Manifest, ${rules.length} scoped network rules, ${files.length} package files and JS syntax verified.`);
