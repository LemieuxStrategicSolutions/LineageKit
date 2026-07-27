# Baseline — {{BASELINE_DATE}}

Point-in-time snapshot taken before new research began. Progress is measured against this file.

## Reference tree

- Host: {{TREE_HOST}} (read-only)
- Tree size as observed: {{SEED_PERSON_COUNT}} people, {{TODO: family groups}}
- Host-reported hints/matches at observation: {{TODO: counts — leads only, not facts}}

## Seed import

- GEDCOM export date: {{SEED_DATE}} · SHA-256: {{TODO: checksum}}
- Imported: {{TODO: individuals / families / sources from the import summary}}
- Staging inventory: {{TODO: events and relationships, all marked hypothesis}}
- Source coverage at import: {{TODO: cited people / total people}}

## Focus lines

{{LINE_SURNAMES}}

## Known local material

{{TODO: photographs, certificates, letters, family papers, prior research already in the family's possession}}

## Project state checklist

- [ ] Untouched GEDCOM export saved and checksummed
- [ ] Staging CSVs generated, everything marked `hypothesis`
- [ ] Living people identified and `privacy_level` set
- [ ] Duplicate candidates listed for deliberate review
- [ ] Baseline quality report generated (`scripts/build_foundation_report.py`)

## Research posture

Direct lines first, evidence labels on everything, negative searches logged, no name-only merges, {{TREE_HOST}} untouched.
