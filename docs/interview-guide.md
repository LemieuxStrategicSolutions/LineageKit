# Installer interview guide

Maps every BOOTSTRAP interview question to the placeholder it fills and the file(s) that consume it. Ask in batches of 5–7; never guess an answer — write `{{TODO: ...}}` instead.

## Batch 1 — people and scope

| Question | Placeholder | Target files |
|---|---|---|
| What's your name? | `{{USER_NAME}}` | AGENTS, WORKING-TREE, README, RESEARCH-PLAN, skills |
| Whose ancestry is in scope — just you, or you and a partner? | `{{ROOT_PEOPLE}}`, `{{FAMILY_SCOPE}}` | README, RESEARCH-PLAN |
| What should the project be called? | `{{FAMILY_NAME}}` | README title |
| Which ancestral lines does that give us (one per grandparent surname)? | `{{LINE_COUNT}}`, `{{LINE_SURNAMES}}` | README, RESEARCH-PLAN, Branch Research/ folders |
| Which countries/languages are those lines from? | feeds the name-variant `{{TODO}}` | RESEARCH-PLAN, SOURCE-GUIDE |

## Batch 2 — the seed

| Question | Placeholder | Target files |
|---|---|---|
| Do you keep a tree on a commercial host? Which one? | `{{TREE_HOST}}` | AGENTS, WORKING-TREE, README, SOURCE-GUIDE, cycle templates |
| Roughly how big is it, and when did you last look? | `{{SEED_PERSON_COUNT}}`, `{{SEED_OBSERVED_DATE}}` | README, BASELINE |
| Can you export a GEDCOM now? (walk them through it) | `{{SEED_DATE}}` | AGENTS, README, BASELINE |
| Any prior research, papers, photos already in the family's hands? | BASELINE "Known local material" | BASELINE |

## Batch 3 — living people and boundaries

| Question | Placeholder | Target files |
|---|---|---|
| Who in the recent generations is living? | `living_status`/`privacy_level` seeding | Data/People.csv, publication rule |
| Confirm: the tree host stays read-only — this project never writes to it. | (contract) | AGENTS |
| Confirm hobby mode: the research queue stays with the AI, off your task list. Name your task systems so the contract can exclude them. | `{{TASK_SYSTEMS}}` | AGENTS |
| Where should durable memory/context live, if you have a memory layer? | `{{MEMORY_SYSTEM}}` | AGENTS |

## Batch 4 — site and cadence (only if wanted)

| Question | Placeholder | Target files |
|---|---|---|
| Do you want a public family archive site? | gates `site/` install | README site section |
| Site title? | `{{SITE_TITLE}}` | site config, README |
| Deployed where? (Cloudflare account?) | `{{SITE_URL}}` | README, skills |
| Should relatives be able to submit contributions? | gates `/contribute` | site config |
| Manual cycles, or a scheduled kickoff? | gates `cycles/skills/` install | cycles/README |
| Project path on disk? | `{{PROJECT_PATH}}` | skills |
| Root person IDs after seed import? | `{{ROOT_PERSON_IDS}}` | monthly audit skill |
| Baseline date (day the snapshot is taken)? | `{{BASELINE_DATE}}` | BASELINE |
