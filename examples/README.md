# Examples — the synthetic family

Every person, place, repository, and record in this folder is **invented**. The family exists so the tooling has something real-shaped to run against — and so the docs can show failure modes without exposing anyone.

## The family

Two roots (living, so the publication layer must hide them): **Rowan Ashford** and **Casey Fenwick**, married 2013. Their grandparents give the example its ancestral lines, one surname per line:

Rowan's side: **Ashford · Beckwith · Cardew · Delmore** — Casey's side: **Fenwick · Grantham · Holloway · Iverson**

Plus one great-grandparent couple (Thomas Ashford & Margaret Quill) for four-generation depth.

## Seeded failure modes (on purpose)

The seed and sample documents contain the classic traps, so tooling and readers can see them handled:

1. **Duplicate candidate** — the GEDCOM contains two Edmund Ashfords with the same recorded birth date in Stonebridge (`@I4@` attached, `@I17@` floating). The import must list them in `Duplicate Candidates.csv`, not merge them. Same name + same date + same town is still not an identity — the parish register later shows they had different parents.
2. **Conflicting evidence** — Harold Fenwick's birthplace: the civil index says Dunmore Cross, but the sample cycle report shows his death record claiming Larkfield. Handled as two assertions linked by `conflicting_assertion_ids`, not smoothed over.
3. **Name-variant chain** — Rosa Iverson appears in older records as *Róisín Iversen*. The variant is a search path; the sample research log shows the independent bridge (same spouse, same townland) that justified joining the records.
4. **Negative search** — the sample research log includes a search that found nothing and says so, closing a record set.
5. **Disproved hypothesis** — the sample cycle report disproves "Thomas Ashford emigrated in 1912" via a 1913 local directory entry, and records the disproof as a win.

## Run the pipeline

From the repo root:

```bash
python3 scripts/import_gedcom_seed.py examples/seed.ged \
  --output examples/output/staging --report examples/output/seed-audit.md

python3 scripts/build_foundation_report.py \
  --data examples/output/staging --roots P000001 P000008 --generations 4 \
  --report examples/output/foundation-report.md \
  --queue examples/output/research-queue.csv
```

Expected: 17 people, 8 families, 2 sources imported; 1 duplicate-candidate group; the foundation report walks 4 generations up from the two roots and flags the source-coverage gaps (only 2 of 17 people have any citation — exactly the state a fresh commercial-tree export tends to be in).

## Sample documents

- [`sample-cycle-1-charter.md`](sample-cycle-1-charter.md) — a filled-in cycle charter
- [`sample-cycle-1-report.md`](sample-cycle-1-report.md) — the matching report, with promote / do-not-promote verdicts, the conflict, the disproof, and the attestation
- [`sample-research-log.csv`](sample-research-log.csv) — log rows including the negative search
- [`sample-source-register.csv`](sample-source-register.csv) — matching register entries
