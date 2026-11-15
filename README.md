# BulkOperation

BulkOperation is a Chrome extension that adds multi-selection and controlled sequential actions to grids and lists on webpages.

## Features

- Detects native HTML tables, ARIA grids, and common list layouts.
- Adds row checkboxes and select-all controls without replacing the page's controls.
- Discovers actions exposed by each selected row and lets the user choose a compatible action.
- Executes actions one item at a time, with progress and per-item results.
- Includes a GitHub branches adapter for selecting and deleting multiple branches through GitHub's visible UI.
- Skips protected/default branches and requires explicit confirmation before destructive actions.
- Supports dynamically updated pages through mutation observation.

## Install

1. Download the latest **BulkOperation Installer** ZIP from the repository's GitHub Actions artifact or Releases page.
2. Extract the ZIP.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode**.
5. Select **Load unpacked** and choose the extracted `extension` folder.

The included Windows helper opens the extension page and displays the installation steps. Chrome requires the user to complete the final Load unpacked action.

## Usage

1. Open a webpage containing a table, grid, or supported list.
2. Select the BulkOperation extension icon and enable selection on the page.
3. Select the rows or items you want to process.
4. Open the bulk action bar, choose an action, review the target list, and confirm.
5. Follow progress and review the per-item results.

For destructive actions, BulkOperation uses the webpage's own visible controls and confirmation flow. The extension does not bypass permissions, hidden page APIs, or site restrictions.

## Compatibility and limitations

Generic support depends on the page exposing identifiable row containers and visible row-level actions. Some virtualized grids, custom canvas grids, and sites with inaccessible controls may need a site adapter.

The GitHub branch adapter targets the repository branches page. GitHub may change its UI, so the adapter is tested against supported DOM patterns and fails closed when it cannot identify a branch or its delete control safely.

Bulk actions are sequential, not parallel. A failure on one row does not silently mark later rows as successful.

## Development

The extension uses Manifest V3 and has no runtime dependency or remote code requirement. See `extension/` for source and `scripts/` for packaging helpers.
