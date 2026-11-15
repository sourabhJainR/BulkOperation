# Getting started

## Requirements

- Google Chrome or a compatible Chromium-based browser.
- A downloaded BulkOperation release ZIP.
- A webpage containing a supported table, grid, or interactive list.

## Install

1. Open the [Releases page](https://github.com/sourabhJainR/BulkOperation/releases).
2. Download `BulkOperation-Installer.zip` from the latest published release.
3. Extract the ZIP.
4. Open `chrome://extensions`.
5. Enable **Developer mode**.
6. Select **Load unpacked**.
7. Select the extracted `BulkOperation/extension` folder.

The Windows helper `install-windows.bat` opens the extensions page and prints the folder location. It does not install the extension automatically.

## Run a bulk action

1. Open a supported page.
2. Click the BulkOperation toolbar icon.
3. Select **Enable selection on this page**.
4. Select the target rows.
5. Choose an action from the bulk toolbar.
6. Review the target list.
7. Confirm the operation.
8. Review the completion report.

## Disable

Open the extension popup and select **Disable**. Refreshing the page also removes the injected page state.

## Important

Use a small test selection first. The page can change while an operation is running. BulkOperation processes actions sequentially and reports failures; it cannot guarantee that a third-party website will keep the same controls or behavior.
