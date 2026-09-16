// SPDX-License-Identifier: GPL-3.0-or-later
const $ = id => document.getElementById(id);
let currentTab, setting = true;
const isYouTube = url => {
  try { const u = new URL(url); return u.protocol === 'https:' && ['www.youtube.com', 'm.youtube.com', 'youtube.com'].includes(u.hostname); }
  catch { return false; }
};
function render(state) {
  setting = state.enabled;
  $('enabled').checked = setting;
  $('enabled').disabled = false;
  document.body.classList.toggle('paused', !setting);
  $('status-title').textContent = !state.healthy ? 'Setup needs attention' : setting ? 'Protection enabled' : 'Protection paused';
  $('version').textContent = `v${state.version}`;
  $('revision').textContent = `Rules ${state.revision}`;
  if (!state.healthy) $('feedback').textContent = 'Please reload the extension in chrome://extensions.';
}
async function send(message) {
  const result = await chrome.runtime.sendMessage(message);
  if (!result?.ok) throw new Error(result?.error || 'Extension unavailable. Try reopening this panel.');
  return result;
}
$('enabled').addEventListener('change', async () => {
  const enabled = $('enabled').checked;
  $('enabled').disabled = true;
  try {
    render(await send({ type: 'SET_ENABLED', enabled }));
    $('feedback').textContent = 'Saved. Reload all open YouTube tabs to fully apply this change.';
  } catch (error) { $('enabled').checked = setting; $('enabled').disabled = false; $('feedback').textContent = error.message; }
});
$('reload').addEventListener('click', async () => {
  if (!currentTab?.id) return;
  $('reload').disabled = true;
  try {
    // Revalidate: the active tab may have navigated since the panel was opened.
    const fresh = await chrome.tabs.get(currentTab.id);
    if (!isYouTube(fresh.url)) throw new Error('This tab is no longer on YouTube.');
    await chrome.tabs.reload(currentTab.id);
    $('feedback').textContent = 'Reload requested. Other open YouTube tabs need a reload too.';
  } catch (error) { $('feedback').textContent = error.message; }
  finally { $('reload').disabled = false; }
});
try {
  render(await send({ type: 'GET_STATE' }));
  [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const supported = isYouTube(currentTab?.url);
  $('reload').disabled = !supported;
  $('page-status').textContent = supported ? 'Changes apply fully after reloading this video page.' : 'Open a YouTube tab to use the reload shortcut. Protection applies on your next visit.';
} catch (error) { $('feedback').textContent = error.message; $('page-status').textContent = 'Could not connect to the extension.'; }
