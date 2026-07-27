# Contributing

Contributions welcome — new record-repository guides, template improvements, site accessibility fixes, better GEDCOM edge-case handling, translations of the methodology.

## Two things this project will not do, no matter how often they're requested

1. **Automatic person-merging.** No feature that joins two person records without a human decision backed by an independent evidence bridge. Name-similarity scoring as a *suggestion* surface is fine; auto-merge is not. (See `GOTCHAS.md` #2.)
2. **Write access to commercial tree hosts.** No sync, no push, no API write integration with MyHeritage, Ancestry, FamilySearch, or any other host. The read-only boundary is the product. (See `GOTCHAS.md` #6.)

And a third that is really a publication rule: nothing that weakens the living-person allowlist in the site pipeline. PRs that make publishing living people easier will be declined.

## Ground rules for PRs

- **No real people.** Every example, fixture, test case, and screenshot uses invented people from the synthetic `examples/` family (or new invented people). PRs containing real names, real record IDs, real addresses, or scans of real documents will be declined regardless of consent claims — this repo stays generic forever.
- Keep the Python scripts stdlib-only — installability with zero dependencies is a feature.
- The site template must keep building with `npm run build` and passing `npm test`.
- Methodology changes should cite genealogical practice (e.g. the Genealogical Proof Standard) rather than personal preference.

## Reporting problems

Bugs and doc gaps: open an issue. Anything involving personal data appearing where it shouldn't: see `SECURITY.md` for private reporting.
