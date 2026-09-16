// SPDX-License-Identifier: GPL-3.0-or-later
const toggle = document.getElementById('enabled');
const status = document.getElementById('status');
const error = document.getElementById('error');
let saved = false;
function showError(message = '') {
  error.textContent = message;
  error.hidden = !message;
}
function render(state) {
  saved = state.enabled;
  toggle.checked = saved;
  toggle.disabled = false;
  status.textContent = state.healthy ? (saved ? 'Ads blocked' : 'Ads allowed') : 'Setup needs attention';
  showError(!state.healthy ? 'Reload TubeQuiet in chrome://extensions.' : state.reloadFailed ? 'Reload your YouTube pages to apply the change.' : '');
}
async function send(message) {
  const result = await chrome.runtime.sendMessage(message);
  if (!result?.ok) throw new Error(result?.error || 'Could not connect. Reopen this panel to retry.');
  return result;
}
toggle.addEventListener('change', async () => {
  toggle.disabled = true;
  status.textContent = 'Applying…';
  showError();
  try { render(await send({ type: 'SET_ENABLED', enabled: toggle.checked })); }
  catch (cause) {
    toggle.checked = saved;
    toggle.disabled = false;
    status.textContent = 'Change not applied';
    showError(cause.message);
  }
});
try { render(await send({ type: 'GET_STATE' })); }
catch (cause) { status.textContent = 'Unavailable'; showError(cause.message); }
