# Troubleshooting

## The extension popup cannot reach the page

1. Confirm the extension is enabled in `chrome://extensions`.
2. Refresh the webpage.
3. Open the popup and enable selection again.
4. Check that the page is not a Chrome internal page or a restricted browser page.

## No row checkboxes appear

The page may not use a supported table, ARIA grid, or list structure. Highly virtualized and custom-rendered pages may require a site adapter.

## An action is missing

BulkOperation only offers actions it can identify with sufficient confidence. Check that the row exposes a visible label, accessible name, tooltip, icon metadata, or a discoverable menu trigger. Unlabeled controls are intentionally not guessed.

## An operation stops or reports failures

The page may have changed, navigated, opened an unsupported confirmation dialog, or removed the control. Review the result list and retry only after checking the remaining rows.

## Report a bug

Open a [GitHub issue](https://github.com/sourabhJainR/BulkOperation/issues) with browser version, page type, steps to reproduce, expected behavior, and actual behavior. Remove private data and credentials before sharing logs or screenshots.
