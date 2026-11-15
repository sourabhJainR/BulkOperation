# BulkOperation

BulkOperation is a Chrome extension that adds multi-selection and controlled sequential actions to grids and lists on webpages.

## Features

- Detects native HTML tables, ARIA grids, and common list layouts.
- Adds row checkboxes and select-all controls without replacing the page's controls.
- Discovers actions exposed by each selected row and lets the user choose a compatible action.
- Recognises common action controls through visible text, accessible labels, linked ARIA labels/descriptions, tooltip attributes, SVG titles, icon classes, data attributes, and common menu/dropdown patterns.
- Inspects newly opened row menus, including common portal-rendered menus, rather than assuming actions are nested inside the row.
- Executes actions one item at a time, with progress and per-item results.
- Includes a GitHub branches adapter for selecting and deleting multiple branches through GitHub's visible UI.
- Skips protected/default branches and requires explicit confirmation before destructive actions.
- Supports dynamically updated pages through mutation observation.

## Install

Download the single-file [BulkOperation ZIP package](https://github.com/sourabhJainR/BulkOperation/archive/refs/heads/feature/chrome-bulk-operation-extension.zip) while this implementation is under review. After the pull request is merged, the GitHub Actions workflow will publish a curated **BulkOperation-Installer.zip** artifact; tagged releases will include the same package.

1. Extract the ZIP.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the extracted `extension` folder.

The included Windows helper opens the extension page and displays the installation steps. Chrome requires the user to complete the final Load unpacked action.

## Usage

1. Open a webpage containing a table, grid, or supported list.
2. Select the BulkOperation extension icon and enable selection on the page.
3. Select the rows or items you want to process.
4. Open the bulk action bar, choose an action, review the target list, and confirm.
5. Follow progress and review the per-item results.

For destructive actions, BulkOperation uses the webpage's own visible controls and confirmation flow. The extension does not bypass permissions, hidden page APIs, or site restrictions.

## Compatibility and limitations

Generic support uses layered DOM heuristics rather than one fixed button selector. It checks native buttons and links, ARIA roles, keyboard-focusable controls, linked accessible-name/description elements, common tooltip attributes, SVG and icon metadata, and common menu, dropdown, popover, and context-menu containers. Menus rendered in portals are inspected after the row trigger opens them.

No browser extension can infer every custom control safely. Canvas-rendered controls, closed shadow roots, unlabeled controls with no meaningful icon or metadata, menus that require hover-only gestures, and highly virtualized grids may still need a site adapter. BulkOperation fails closed when it cannot identify an action with enough confidence; it does not guess based only on screen position.

The GitHub branch adapter targets the repository branches page. GitHub may change its UI, so the adapter is tested against supported DOM patterns and fails closed when it cannot identify a branch or its delete control safely.

Bulk actions are sequential, not parallel. A failure on one row does not silently mark later rows as successful.

## Development

The extension uses Manifest V3 and has no runtime dependency or remote code requirement. See `extension/` for source and `scripts/` for packaging helpers.
