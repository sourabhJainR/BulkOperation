# Privacy

## What BulkOperation does

BulkOperation runs in your browser. It inspects the current page's DOM to identify supported rows, visible controls, and action labels. It adds selection controls and interacts with visible page controls after you choose and confirm an action.

## Data collection

The extension does not include analytics or telemetry code and does not send page content to a BulkOperation server.

Page content is processed locally by the extension so it can identify rows and controls. The website itself continues to receive requests caused by the actions you choose through its own interface.

## Permissions and access

The extension uses a Manifest V3 content script on pages so it can provide generic row selection. Browser-restricted pages, such as Chrome internal pages and the Chrome Web Store, do not allow normal content-script injection.

## User control

You choose when to enable selection, which rows to select, and whether to confirm a bulk action. You can disable BulkOperation from its popup or remove it from `chrome://extensions`.

This document describes the current repository implementation. Review the manifest and source code for the exact behavior of the version you install.
