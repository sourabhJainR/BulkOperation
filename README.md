# BulkOperation

BulkOperation is a Manifest V3 Chrome extension for selecting multiple rows in webpage tables, grids, and supported lists, then running a compatible visible action on each item in sequence.

It is designed to make repetitive page tasks easier without using hidden site APIs, bypassing permissions, or guessing which control to click.

[Project website](https://sourabhjainr.github.io/BulkOperation/) · [Documentation](https://sourabhjainr.github.io/BulkOperation/docs/) · [GitHub Wiki](https://github.com/sourabhJainR/BulkOperation/wiki) · [Releases](https://github.com/sourabhJainR/BulkOperation/releases)

## Features

- Detects native HTML tables, ARIA grids, and common interactive list layouts.
- Adds row selection controls and a bulk-action toolbar.
- Finds compatible row actions through visible labels, accessible names, linked ARIA labels, tooltip metadata, SVG titles, icon classes, data attributes, and common menu patterns.
- Inspects menus that open outside the row, including common portal-rendered menus.
- Runs actions sequentially and reports each item's result.
- Includes a GitHub branches page adapter for branch deletion through GitHub's visible interface.
- Excludes protected and default GitHub branches.
- Supports pages that update dynamically.
- Fails closed when it cannot identify an action with enough confidence.

## Install

### Download a release

Download the latest **BulkOperation-Installer.zip** from the [Releases page](https://github.com/sourabhJainR/BulkOperation/releases). Use the ZIP attached to a published release, not the source-code ZIP generated automatically by GitHub.

### Load the extension in Chrome

1. Download and extract `BulkOperation-Installer.zip`.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Select **Load unpacked**.
5. Open the extracted `BulkOperation/extension` folder.

On Windows, you can run `install-windows.bat`. It opens the Chrome extensions page and shows the folder to select. Chrome requires you to complete **Load unpacked** yourself.

The extension is currently distributed as an unpacked/developer-mode installation. It is not listed in the Chrome Web Store.

## Use

1. Open a page containing a supported table, grid, or list.
2. Select the BulkOperation toolbar icon.
3. Choose **Enable selection on this page**.
4. Select the rows you want to process.
5. Choose an action from the bulk toolbar.
6. Review the target list and confirm.
7. Check the per-item results when processing finishes.

For destructive actions, review the targets before confirming. BulkOperation uses the page's visible controls and confirmation flow.

## Safety and privacy

- Actions run one item at a time.
- Destructive actions require an explicit review and confirmation.
- GitHub default and protected branches are excluded.
- The extension does not call private site APIs or bypass access controls.
- No remote code, analytics, or telemetry is included.
- Page content is inspected locally in the browser to find rows and visible controls.
- The extension does not send page content to a BulkOperation server.

See the [Privacy](docs/privacy.md) and [Security](docs/security.md) notes.

## Compatibility and limitations

BulkOperation uses DOM heuristics and a GitHub-specific adapter. It cannot safely identify every custom control. Canvas-rendered controls, closed shadow roots, unlabeled controls with no useful metadata, hover-only menus, and heavily virtualized grids may need a dedicated adapter.

The GitHub adapter targets the repository branches page. GitHub may change its interface. If a delete action cannot be identified with confidence, the extension stops rather than guessing.

Actions are sequential, not parallel. A page that navigates away, changes its controls, or opens an unsupported confirmation flow may interrupt a batch.

See [compatibility notes](docs/compatibility.md) and [troubleshooting](docs/troubleshooting.md).

## Releases

Published versions and installer downloads are listed on the [GitHub Releases page](https://github.com/sourabhJainR/BulkOperation/releases).

Each tagged release is intended to include:
- `BulkOperation-Installer.zip` — curated extension folder, Windows helper, and README.
- Release notes describing changes, fixes, and known limitations.
- A matching source tag.

The current repository version is `1.0.0`. A release is considered available only after it appears on the Releases page with its installer asset. See [release process](docs/releases.md).

## Development

- Extension source: `extension/`
- Packaging and validation scripts: `scripts/`
- GitHub Actions: `.github/workflows/`
- Website and documentation: `docs/`

Requirements: Node.js 20+ for validation and a Chromium-based browser for manual acceptance testing. No runtime package installation is required.

Run the static package validation:

```sh
node scripts/validate.mjs
```

Build the Windows package from PowerShell:

```powershell
./scripts/package.ps1
```

See [contributing](docs/contributing.md) before submitting changes.

## Support

Report bugs and request improvements through [GitHub Issues](https://github.com/sourabhJainR/BulkOperation/issues). Include your browser version, the page type, steps to reproduce, and any relevant console error. Do not include credentials, session tokens, or private page data.
