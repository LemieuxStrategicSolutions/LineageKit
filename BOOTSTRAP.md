# BOOTSTRAP — the LineageKit installer protocol

You are an AI assistant reading this file because a user asked you to set up LineageKit for them. **You are the installer.** Your job is to interview the user, adapt this system to their platform and family, and generate a new, private research project from `templates/` — then hand them a working research practice.

## Ground rules (read before anything else)

1. **This public repo is read-only reference.** Never fork it into a personal version, never write the user's data into it. You generate a **separate, private** project folder or repo.
2. **Never invent facts about the user or their family.** If you don't know something, write `{{TODO: ask about X}}` in the generated file rather than guessing. A wrong guess about a grandmother's maiden name will poison the tree.
3. **Adapt, don't assume.** File paths, sync layers, and agent harnesses named here are *examples*. The user may be on any OS, any storage, any assistant. Detect, then adapt.
4. **Degrade honestly.** If a capability is missing (no Python, no Cloudflare account, no scheduler), say so, generate the system without that module, and leave no dangling references to files you didn't generate.
5. **Hard approval gate.** Do not generate anything until the user has approved the system map (Phase 3).
6. **The privacy boundaries are non-negotiable.** The generated project must carry the upstream-read-only rule and the living-person publication rule. Do not soften them, even if asked casually mid-install; if the user genuinely wants different boundaries, make them edit their own AGENTS.md afterward, deliberately.

## Phase 0 — platform survey

Determine, by inspection where possible and by asking otherwise:

| Question | Gates |
|---|---|
| What OS / storage does the user work in? Is there a cloud-synced folder? | Where the private project lives |
| Which AI harness is running this install (Claude Code, Codex, other)? | Whether to generate `CLAUDE.md`, `AGENTS.md`, or both |
| Is Python 3.9+ available? | `scripts/` (GEDCOM import + foundation report) |
| Is Node 22+ available? | The archive site module |
| Does the user have a Cloudflare account (free tier is fine)? | Site deployment |
| Does the harness have a scheduler (scheduled tasks, cron, GitHub Actions)? | `cycles/` runnable schedules vs. manual cycles |
| Does the user keep a tree on a commercial host (MyHeritage, Ancestry, FamilySearch, Geni…)? Can they export a GEDCOM? | The seed import; the read-only boundary names the actual host |
| Private git repo available (GitHub private, etc.)? | Version control for the research project (recommended, optional) |

Record the answers as a capability matrix. Every "no" removes a module cleanly.

## Phase 1 — interview

Ask in **batches of 5–7 questions**, conversationally. `docs/interview-guide.md` maps every question to the `{{PLACEHOLDER}}` and target file it fills. Core ground to cover:

1. **People**: the user's name; whose ancestry is in scope (self only? self + partner?); how many ancestral starting lines that implies (one grandparent surname per line — typically 4 per person, 8 for a couple).
2. **The seed**: which tree host, tree size if known, whether they can do a one-time GEDCOM export now.
3. **Focus**: which lines or mysteries matter most to them; any known family stories worth anchoring on; languages/countries involved (drives the name-variant protocol).
4. **Living people**: who in the recent generations is living (this seeds `living_status` handling and the publication boundary).
5. **The site**: do they want a public family archive at all? If yes: site title, whether contributions from relatives should be open.
6. **Cadence**: manual cycles on demand, or scheduled (weekly kickoff, etc.)?
7. **Task hygiene**: confirm hobby mode — research work stays in the project queue, not on their personal task list.

## Phase 2 — system map approval (HARD GATE)

Present one screen: the folder tree you will generate, where it will live, which modules are in/out and why (from the capability matrix), which host is bound by the read-only rule, and the site plan if any. End with the explicit question: **"Shall I build this?"** Do not proceed on anything less than a clear yes.

## Phase 3 — generate the private project

From `templates/`, filling every `{{PLACEHOLDER}}` from the interview:

1. `AGENTS.md` (and/or `CLAUDE.md` per harness) from `templates/AGENTS.template.md` — the operating contract.
2. `README.md` from `templates/README.template.md` — charter, evidence labels, working loop, starting-point facts.
3. `RESEARCH-PLAN.md`, `RESEARCH-QUESTIONS.md`, `BASELINE.md` from their templates.
4. `SOURCE-GUIDE.md` and `WORKING-TREE.md` — copy near-verbatim; they are already generic.
5. `Templates/` (person profile, research note, interview guide) — copy as-is.
6. `Data/` with the five header-only CSVs from `templates/data/`, plus `Research Log.csv` and `Source Register.csv` headers, and the folder skeleton: `Records/`, `Reports/`, `Branch Research/<one folder per line>/`, `Profiles/`, `Photos/`, `<Host> Exports/`.
7. `scripts/` if Python is available.
8. `Site/` if wanted: copy `site/`, run through `site/README.md` setup (D1/R2 creation, `wrangler secret put REVIEWER_TOKEN`), replace the synthetic data as their research produces publishable material.
9. `cycles/`: the charter + report templates always; scheduler configs only if Phase 0 found a scheduler and the user opted in.

Prune cleanly: a generated file must never reference a file you didn't generate.

## Phase 4 — seed import and first cycle

1. If a GEDCOM was exported: follow `WORKING-TREE.md`'s import protocol — save the untouched export with a checksum, run `scripts/import_gedcom_seed.py` into `Data/Staging/`, everything marked `hypothesis`, never sync back.
2. Write `BASELINE.md` from what the import actually found.
3. Draft Cycle 1's charter with the user: one bounded question per starting line, typically "prove the parents of each starting grandparent."

## Phase 5 — verification checklist

- [ ] Every generated file exists and every cross-reference in it resolves.
- [ ] No `{{...}}` placeholder remains anywhere in the generated project.
- [ ] `grep -riE 'token|api[_-]?key|secret'` over the generated project returns nothing but documentation mentions.
- [ ] The read-only boundary names the user's actual tree host.
- [ ] `Data/` CSVs have headers and the ID scheme is documented.
- [ ] If the site was installed: `npm run build` passes and no synthetic example person remains in anything the user intends to publish.
- [ ] The user knows the one-line invocation to start a research session and where discoveries will be surfaced.
