@echo off
setlocal
set "EXTENSION_DIR=%~dp0extension"
if not exist "%EXTENSION_DIR%\\manifest.json" set "EXTENSION_DIR=%~dp0..\\extension"
echo BulkOperation Chrome Extension
echo.
echo This helper opens Chrome's extension management page.
echo In Chrome, enable Developer mode and select Load unpacked.
echo Choose this extension folder:
echo "%EXTENSION_DIR%"
echo.
start "" "chrome://extensions"
echo.
echo If Chrome did not open, paste chrome://extensions into its address bar.
pause
