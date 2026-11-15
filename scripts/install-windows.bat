@echo off
setlocal
echo BulkOperation Chrome Extension
echo.
echo This helper opens Chrome's extension management page.
echo In Chrome, enable Developer mode and select Load unpacked.
echo Then choose the "extension" folder next to this file.
echo.
start "" "chrome://extensions"
echo.
echo If Chrome did not open, paste chrome://extensions into its address bar.
pause