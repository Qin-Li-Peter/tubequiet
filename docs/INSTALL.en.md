# TubeQuiet Installation Guide

**English** | [简体中文](INSTALL.zh-CN.md)

For desktop Chrome on Windows or macOS (version 120 or later). Download directly from GitHub; no coding, Git installation, or developer account is required.

## Installation (about 2 minutes)

1. **Download from GitHub**
   - Open the [TubeQuiet repository](https://github.com/Qin-Li-Peter/tubequiet) and click the green **Code → Download ZIP** button.
   - Extract `tubequiet-main.zip`: on Windows, right-click → **Extract All**; on macOS, double-click.
   - Keep the extracted `tubequiet-main` folder in a permanent location, such as Documents. **Do not move or delete it after installation.**

2. **Open the extensions page**
   - Type `chrome://extensions` in Chrome's address bar and press Enter.
   - If you use multiple Chrome profiles, do this in the profile you normally use for YouTube.

3. **Enable Developer mode**
   - Turn on **Developer mode** in the upper-right corner.
   - A **Load unpacked** button will appear near the top of the page.

4. **Load the extension folder**
   - Click **Load unpacked** and select **`tubequiet-main/extension`** inside the extracted folder.
   - **The selected folder must directly contain `manifest.json`.** Do not select the ZIP or the JSON file itself.
   - Installation is complete when the **TubeQuiet — YouTube Ad Control** card appears with its switch enabled.

5. **Pin and start using it**
   - Click Chrome's puzzle-piece icon, find **TubeQuiet**, and click its pin icon.
   - Open TubeQuiet, check that its switch is on, then reload any YouTube pages already open.

## Daily use

| Popup state | Meaning |
| --- | --- |
| **Ads blocked** (black switch, thumb on the right) | Ad filtering is enabled |
| **Ads allowed** (gray switch, thumb on the left) | Ad filtering is disabled; ads are allowed |

Changing the switch automatically reloads open YouTube pages. TubeQuiet targets YouTube advertising, not sponsorships spoken or embedded by video creators. Some ads may stop being filtered when YouTube changes.

## Troubleshooting

- **Manifest file not found**: usually the wrong folder was selected. Choose the folder directly containing `manifest.json`; check inside any nested folder.
- **Developer mode is missing or disabled**: a company or school may restrict extension installation. Contact your administrator or use a personal computer that permits it.
- **Ads remain or playback behaves unexpectedly**: check that TubeQuiet is enabled and reload the page. If other ad blockers are installed, pause them and try again. If the problem continues, turn TubeQuiet off and check or report it in [GitHub Issues](https://github.com/Qin-Li-Peter/tubequiet/issues) (a GitHub login is required to submit an issue). TubeQuiet does not provide network connectivity.

## Updating and uninstalling

- **Update**: download the repository again using **Code → Download ZIP**. Extract it and replace the contents of your existing `extension` folder with all the files from the new `extension` folder. At `chrome://extensions`, click **Reload** on the TubeQuiet card, then reload YouTube. Locally installed copies require manual updates.
- **Uninstall**: at `chrome://extensions`, find TubeQuiet and click **Remove**. You can then delete its installation folder.

Installation reference: [Chrome's official instructions for loading an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

[Back to README](../README.md)
