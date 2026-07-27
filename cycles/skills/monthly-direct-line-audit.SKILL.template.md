---
name: monthly-direct-line-audit
description: Re-run the foundation report and diff direct-line source coverage against the baseline. Read-only; produces one summary.
schedule: "0 8 1 * *"   # 1st of the month 8am — adapt to your harness's schedule syntax
---

# Monthly direct-line audit

A drift check on research quality for {{USER_NAME}}'s family history project at `{{PROJECT_PATH}}`.

1. Run `python3 scripts/build_foundation_report.py --data Data --roots {{ROOT_PERSON_IDS}} --generations 4 --report Reports/Foundation Audit - <date>.md --queue "Branch Research/Foundation Research Queue.csv"`.
2. Compare against `BASELINE.md` and the previous month's audit: source coverage per direct ancestor, unresolved conflicting assertions, hypotheses older than 60 days with no logged search attempt.
3. Flag — conversationally, never as tasks — any direct ancestor whose vital events remain entirely unsourced, and any `conflicting` assertion pair nobody has touched.
4. Make no data changes. This audit reads and reports.
