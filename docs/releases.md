# Releases

## Downloading

Use the [GitHub Releases page](https://github.com/sourabhJainR/BulkOperation/releases). Download `BulkOperation-Installer.zip` from a published release. GitHub's automatically generated source ZIP is not the curated installer.

## Release contents

A release should include:
- A version tag in the form `vMAJOR.MINOR.PATCH`.
- `BulkOperation-Installer.zip`, containing the extension folder, Windows helper, and README.
- Release notes with user-visible changes, fixes, validation performed, and known limitations.

## Publishing

1. Update `extension/manifest.json` version.
2. Update release notes and documentation.
3. Run `node scripts/validate.mjs`.
4. Review the final changes and verify the package contents.
5. Create and push a version tag such as `v1.0.1`.
6. Confirm the tagged GitHub Actions run succeeds.
7. Confirm the release contains `BulkOperation-Installer.zip`.
8. Test installation from the downloaded release ZIP.

The packaging workflow attaches the curated ZIP to a GitHub Release when a version tag is pushed. Do not describe a version as released until the release and asset are visible on GitHub.
