# Contributing

## Before opening a pull request

- Keep the Manifest V3 permission set minimal.
- Do not add remote code, hidden site APIs, or permission bypasses.
- Preserve sequential execution and explicit review for destructive actions.
- Preserve fail-closed behavior when an action cannot be identified.
- Add or update validation for changed behavior.
- Update user documentation when installation, compatibility, or safety behavior changes.

## Validate locally

Run:

```sh
node scripts/validate.mjs
```

For packaging on Windows, run:

```powershell
./scripts/package.ps1
```

## Pull requests

Describe the user problem, implementation, safety impact, validation performed, and known limitations. Include a focused reproduction or fixture when changing DOM discovery logic.

Do not claim browser acceptance testing unless the extension was loaded in a real Chromium browser and the relevant workflows were exercised.
