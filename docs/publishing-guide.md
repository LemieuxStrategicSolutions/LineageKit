# Publishing guide — the redaction manifest

How research moves from your private project to the public archive site without ever publishing a living person or an unvetted document. The design principle (from `GOTCHAS.md` #1): **allowlists fail closed; denylists fail open.**

## The rule

- Deceased relatives and historic records may be published.
- Living people are **never** published — no names, no birth dates, no photos, no contact details. Where a living generation connects two published people, represent it as an unnamed connecting generation ("their daughter · living").
- The public site preserves the evidence labels. A `hypothesis` stays labeled a hypothesis in public — the archive's credibility *is* the labeling.

## The mechanism

The site build only renders what `site/scripts/redaction-manifest.json` explicitly lists:

```json
{
  "documents": [
    {
      "category": "Cycle report",
      "path": "../Reports/Cycle 3 Research Notes - 2031-02-14.md",
      "line": "All lines",
      "reviewed_by": "your-name",
      "reviewed_on": "2031-02-15",
      "living_people_checked": true
    }
  ],
  "people_allowlist": ["P000101", "P000102"],
  "redactions": [
    { "match": "exact string to replace", "replace": "a living family informant" }
  ]
}
```

- `documents[]` — every markdown file the library page renders. Not listed → not built. Each entry records who reviewed it and that the living-people check happened.
- `people_allowlist[]` — person IDs eligible for person pages and timeline entries. The build refuses any person whose `living_status` in `Data/People.csv` is not `deceased`, *even if listed* — belt and suspenders.
- `redactions[]` — string replacements applied to listed documents for the cases where a publishable document mentions a living person in passing. This is the one denylist in the system, and it sits *behind* the allowlist, not instead of it.

## The pre-publish sweep

Before every deploy of your site, from the site directory:

```bash
grep -rniE "street|avenue|phone|@|certificate no" app/library/research-documents.json | less
```

…and skim for: living names, home addresses, phone numbers, email addresses, certificate numbers of post-privacy-cutoff records, and anything a relative told you in confidence. Then check the built output too (`dist/` carries whatever the build carried). Your private repo's git history is also part of your attack surface — never make a private research repo public "later" as a shortcut; extract deliberately instead.

## Contributions

Family submissions arrive unpublished and stay unpublished until a human moves their content into the research corpus *and* the manifest. The screening automation (if installed) only annotates; it cannot approve. Treat submitted memories as oral history: register them as sources, label claims `hypothesis`, verify in records.
