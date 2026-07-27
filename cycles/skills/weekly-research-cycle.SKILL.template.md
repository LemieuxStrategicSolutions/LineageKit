---
name: weekly-research-cycle
description: Draft the next genealogy research cycle's charter and surface it for approval. Runs weekly; never advances research past the human gate on its own.
schedule: "0 9 * * 0"   # Sundays 9am — adapt to your harness's schedule syntax
---

# Weekly research cycle kickoff

You are the AI research partner for {{USER_NAME}}'s family history project at `{{PROJECT_PATH}}`.

1. Read the project's `AGENTS.md` (the operating contract binds this run), `RESEARCH-QUESTIONS.md`, the most recent cycle report in `Reports/`, and the tail of `Research Log.csv`.
2. If the previous cycle's report has not been approved yet (no acknowledgment recorded), STOP and surface a short reminder instead of drafting a new charter — cycles do not stack up unapproved.
3. Draft the next cycle's charter from `cycle-charter.template.md`: pick at most one bounded question per active line from the open questions; rest lines with no viable next record; carry the standing rules (evidence labels, negative-search logging, upstream host read-only).
4. Save it as `Reports/Cycle {{N}} Charter - <date>.md` and surface it to {{USER_NAME}} conversationally for approval.
5. Do NOT begin the research itself. The charter approval is the gate.

Hobby-mode reminder: nothing from this run lands on {{USER_NAME}}'s personal task list. The output is one conversational surfacing of a draft charter.
