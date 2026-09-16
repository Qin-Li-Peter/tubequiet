// SPDX-License-Identifier: GPL-3.0-or-later
import { SCRIPT, RULESET, RULE_REVISION } from './config.js';
let queue = Promise.resolve();
const enqueue = fn => { const result = queue.then(fn); queue = result.catch(() => {}); return result; };
const desired = async () => (await chrome.storage.local.get('enabled')).enabled !== false;

async function configure(enabled) {
  const scripts = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT.id] });
  if (enabled) {
    if (scripts.length) await chrome.scripting.updateContentScripts([SCRIPT]);
    else await chrome.scripting.registerContentScripts([SCRIPT]);
  } else if (scripts.length) await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT.id] });
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled ? [RULESET] : [], disableRulesetIds: enabled ? [] : [RULESET],
  });
  await chrome.action.setBadgeText({ text: enabled ? '' : 'OFF' });
  await chrome.action.setBadgeBackgroundColor({ color: '#576275' });
}

async function state() {
  const enabled = await desired();
  const scripts = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT.id] });
  const rules = await chrome.declarativeNetRequest.getEnabledRulesets();
  return { enabled, healthy: Boolean(scripts.length) === enabled && rules.includes(RULESET) === enabled,
    version: chrome.runtime.getManifest().version, revision: RULE_REVISION };
}

async function setEnabled(enabled) {
  const previous = await desired();
  try {
    await configure(enabled);
    await chrome.storage.local.set({ enabled });
  } catch (error) {
    try { await configure(previous); } catch { /* GET_STATE surfaces a degraded state. */ }
    throw error;
  }
  return state();
}

chrome.runtime.onInstalled.addListener(() => { enqueue(async () => configure(await desired())).catch(console.error); });
chrome.runtime.onStartup.addListener(() => { enqueue(async () => configure(await desired())).catch(console.error); });
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  // Only this extension's pages may change configuration. No page-world bridge.
  if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(''))) return false;
  if (message?.type !== 'GET_STATE' && !(message?.type === 'SET_ENABLED' && typeof message.enabled === 'boolean')) return false;
  enqueue(async () => {
    if (message.type === 'SET_ENABLED') return setEnabled(message.enabled);
    await configure(await desired()); // Repair registration after an extension update.
    return state();
  }).then(value => reply({ ok: true, ...value }), () => reply({ ok: false, error: 'Could not apply protection. Please reload the extension and try again.' }));
  return true;
});
