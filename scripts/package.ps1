$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$stage = Join-Path $root "dist\BulkOperation"
$zip = Join-Path $root "dist\BulkOperation-Installer.zip"
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage -Force | Out-Null
Copy-Item (Join-Path $root "extension") (Join-Path $stage "extension") -Recurse
Copy-Item (Join-Path $root "scripts\install-windows.bat") $stage
Copy-Item (Join-Path $root "README.md") $stage
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Created $zip"