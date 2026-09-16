// SPDX-License-Identifier: GPL-3.0-or-later
(() => {
  let enabled = false;
  const apply = () => {
    if (document.documentElement) document.documentElement.toggleAttribute('data-tubequiet-enabled', enabled);
  };
  chrome.storage.local.get('enabled').then(value => { enabled = value.enabled !== false; apply(); }).catch(() => {});
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.enabled) return;
    enabled = changes.enabled.newValue !== false; apply();
  });
})();
