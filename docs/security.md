# Security

## Safety model

- Interact with visible page controls only.
- Do not call private website APIs or bypass access controls.
- Require explicit user review and confirmation before running a bulk action.
- Process items sequentially.
- Report per-item failures.
- Fail closed when an action cannot be identified with sufficient confidence.
- Exclude protected and default branches in the GitHub branch adapter.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue. Use GitHub's private vulnerability reporting feature if it is enabled for this repository. If private reporting is unavailable, contact the repository maintainer through a trusted private channel and provide concise reproduction steps.

Do not include passwords, cookies, access tokens, session identifiers, or private customer data in reports.
