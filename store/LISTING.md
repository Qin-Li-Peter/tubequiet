# Chrome Web Store listing draft

Name: TubeQuiet — YouTube Ad Control

Summary: Reduce ads on YouTube with local filtering, a simple pause switch, and no analytics or account required.

Language: English

## Detailed description

TubeQuiet is a focused ad-control extension for YouTube.

- Filters recognized player advertising data locally.
- Hides supported advertising placements.
- Blocks selected YouTube advertising requests using Chrome's built-in rules.
- Offers a simple pause switch and a shortcut to reload your YouTube tab.

No TubeQuiet account, analytics, subscription, or external filtering server is required. Your protection preference stays in Chrome's local storage. TubeQuiet does not collect your browsing history, video titles, or account information.

After changing protection, reload all open YouTube tabs. YouTube changes frequently, so filtering may vary and cannot be guaranteed for every ad format. Creator sponsorships inside videos are not removed. This extension does not unlock paid content.

Supports YouTube's main and mobile websites. Independent project; not affiliated with YouTube, Google, or uBlock Origin. Licensed under GPL-3.0-or-later, with readable source included in the extension.

## Single purpose

Reduce advertising interruptions and supported advertising placements on YouTube, with a user-controlled pause switch.

## Permission justifications

- storage: Save only the user's enabled/paused preference locally on the device.
- scripting: Register or unregister the bundled document-start MAIN-world scripts that filter recognized YouTube player advertising data.
- declarativeNetRequest: Apply three packaged rules to block selected advertising requests initiated by YouTube. No remote rules are downloaded.
- host access to https://www.youtube.com/*, https://youtube.com/*, https://m.youtube.com/*: Apply player-data filtering and cosmetic ad hiding on YouTube, and enable the popup's reload shortcut for a supported active tab. No all-sites host access.
- Remote code: No. All executable JavaScript and filtering rules are included in the submitted ZIP.

## Privacy disclosure guidance

No user data is collected/transmitted to the developer or third parties by this extension. Local transient processing of YouTube player responses is required for filtering; one local preference is retained. Explain both accurately in the dashboard and public privacy policy. Do not describe the extension as unable to read page data: it necessarily processes player responses.

## Reviewer instructions

1. Use a Chrome profile without other ad blockers. No extension login or subscription is required.
2. Install, open TubeQuiet, verify Protection enabled.
3. Visit YouTube and play an ad-supported video. Ad inventory is nondeterministic.
4. Pause protection and reload the page; resume and reload. The popup must reflect the saved choice after reopening.
5. Visit another website: TubeQuiet should not inject filtering scripts there.
6. Read the bundled privacy page and source. All logic is local and unminified.

Do not claim every ad is blocked or that the product is approved before review. Complete the release gate in docs/VALIDATION.md first.
