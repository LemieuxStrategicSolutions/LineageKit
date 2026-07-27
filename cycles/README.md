# Research cycles

Work happens in numbered, bounded cycles. A cycle is the unit of research the way a commit is the unit of code change: scoped, recorded, reviewable.

## The protocol

1. **Charter** (`templates/cycle-charter.template.md`) — before any searching: scope (one bounded question per active line), the governing question, what's already established, the gaps targeted, and exit criteria. A cycle without a charter drifts into name-chasing.
2. **Research** — the working loop from the project README, line by line, logging every search (including negatives) in `Research Log.csv` and every source in `Source Register.csv`.
3. **Report** (`templates/cycle-report.template.md`) — findings per line, each with an explicit **promote / do not promote** verdict and its evidence bridge; a position statement of what did and didn't advance; the cycle's source set; the attestation that the upstream host was untouched.
4. **Human gate** — the family researcher reads the report (or hears it conversationally) and approves the next cycle's charter. Research does not roll past a cycle boundary on its own.
5. **Publish (optional)** — if the site module is installed and the cycle produced publishable material, add it to the redaction manifest and redeploy. Publication is its own deliberate step, never a side effect.

## Cadence — an honest note

The reference implementation ran **24 cycles in five days, all manually invoked** — burst-driven hobby sessions, not a scheduler. Scheduling is optional sugar: the protocol is the charter/report/gate structure, not the calendar. If a weekly rhythm helps you show up, use the configs below; if the hobby runs on enthusiasm bursts, run cycles by hand and skip this whole section.

## Optional runnable schedules

Three ready-to-adapt configs, all requiring the human gate to actually advance research:

| Config | What it does | File |
|---|---|---|
| Weekly cycle kickoff | Drafts the next cycle's charter from the open questions and surfaces it for approval | `skills/weekly-research-cycle.SKILL.template.md` |
| Contribution screening | Screens new family submissions in the site's review inbox and prepares a moderation summary | `skills/contribution-screening.SKILL.template.md` |
| Monthly direct-line audit | Re-runs the foundation report and diffs source coverage against the baseline | `skills/monthly-direct-line-audit.SKILL.template.md` |
| Weekly kickoff (GitHub Actions) | Opens a "Cycle N charter" issue on your private research repo every Sunday | `github-workflow-weekly-cycle.yml` |

The SKILL templates target agent harnesses with scheduled tasks (e.g. Claude Code scheduled tasks); adapt the front matter to yours. If your harness has an automation registry ("no silent automations" is a good rule), register anything you enable.
