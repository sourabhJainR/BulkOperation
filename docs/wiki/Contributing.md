# Contributing

- Keep browser permissions minimal.
- Do not add remote code or hidden site API calls.
- Preserve sequential execution and destructive-action confirmation.
- Preserve fail-closed behavior.
- Add validation for changed behavior.
- Update docs when behavior changes.

Run `node scripts/validate.mjs`. For DOM discovery changes, include focused fixtures or reproduction steps. Do not claim browser acceptance unless the extension has been loaded in Chromium and tested.
