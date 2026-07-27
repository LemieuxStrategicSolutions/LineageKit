# Security & data boundaries

## Reporting a vulnerability

If you find a security issue in the site template (the contribution pipeline, the reviewer auth, the file handling) — or personal data of any real person anywhere in this repository — please report it **privately** via GitHub's security advisory feature ("Report a vulnerability" on the Security tab) rather than a public issue. Reports of real personal data will be treated as highest priority.

## The data boundary

This repository is generic forever:

- Every person named in `examples/`, `site/`, tests, and docs is invented.
- No real family data, record scans, certificate numbers, addresses, or contact details are ever committed here.
- The reference implementation's research data lives in a private project that is not this repo and never flows into it.

## Boundaries the software itself enforces or encodes

- **Living people are never published.** The site's publication pipeline is allowlist-based: only documents and people explicitly listed in the redaction manifest are rendered, and the generated project's data model carries `living_status` and `privacy_level` per person.
- **Secrets are never in files.** The site's reviewer token and any deployment credentials live in the platform secret store (`wrangler secret put`), not in the repo. The `.gitignore` refuses `.env`, `*.key`, `*.pem`.
- **Contribution uploads are constrained**: MIME allowlist, per-file and total size caps, filename sanitization, honeypot field, and rate limiting keyed to a SHA-256 hash of the client IP (the raw IP is not stored).
- **Commercial tree hosts are read-only.** No component of this system authenticates to or writes to a tree host.

## Your generated project

BOOTSTRAP generates your research project as a separate, private folder or repo. Treat its git history as being as sensitive as its files, keep build outputs (`dist/`, local emulator state) out of anything public, and run the sweep in `docs/publishing-guide.md` before publishing anything from it.
