# GOTCHAS — production lessons

Lessons from running this system in production on a real multi-line research project. Numbered so other docs can cite them.

## 1. Denylist anonymizers fail open

The reference implementation's first site publisher redacted living people with a hardcoded list of name→role regex replacements ("Jane Q." → "a living family informant"). It worked — until the next document mentioned a living person the list didn't know about, and the pipeline published the name without a murmur. **A denylist fails open; an allowlist fails closed.** The site template therefore ships with a redaction *manifest*: nothing is published unless it is explicitly listed as publishable, and living people are representable only as unnamed connecting generations. See `docs/publishing-guide.md`.

## 2. Never merge two people on a name match

The single most common way trees rot. Same name + same-ish decade + same country is *three coincidences*, not an identity. Require an independent bridge (spouse, parents, exact date, address, occupation, parish, migration sequence) before joining records. The staging tables keep a `Duplicate Candidates` list precisely so merge decisions are deliberate, logged events.

## 3. Log the searches that found nothing

A negative search is the only thing standing between you and doing the same futile search three times across three sessions. The Research Log schema has a `result` column for a reason; "no surname-variant entries in this index through 1930, film is final-orders only — closed as negative" is a *finding*.

## 4. Hints and match counts are marketing, not evidence

Commercial hosts will report thousands of "matches" for a modest tree. They are leads at best. Import none of them as facts. The seed import marks every incoming claim `hypothesis` for this reason — including claims that were "confirmed" on the host.

## 5. Local-LLM classification is not research

The reference implementation piloted a small local model for genealogy web-search triage. It passed its isolation test, then skipped the search tool and produced fluent, ungrounded output. The pilot was disabled and its output excluded from the record. Rule: **no model-generated classification enters the evidence record without a human-verifiable receipt** (a URL, an image, a citation that a person checked). Drafting and summarizing, fine; asserting facts about your family, no.

## 6. The upstream tree host will tempt you to sync

Don't. Bidirectional sync between your evidence-labeled local tree and a hint-driven commercial tree destroys the meaning of your labels within weeks. One-time GEDCOM seed in; nothing out except (optionally, much later) a deliberate, human-reviewed merge package.

## 7. Cloud-synced folders and automation don't mix

If your private project lives in iCloud/OneDrive/Dropbox, scheduled jobs and git can hit permission walls and sync races (macOS TCC will silently block launchd children from iCloud paths). Keep automation state and any site repo on a real local path; let the document folder sync.

## 8. Separate the fact from the record's claim about the fact

A death certificate saying "born in Ireland" is *evidence that the informant believed* the birthplace was Ireland — the same person's draft card, in their own words decades earlier, may name a specific town in another country. Record both, label the conflict, and let the assertion table carry the disagreement. Conflicting evidence honestly labeled is a healthier tree than a smoothed-over one.

## 9. Restraint is a result

A research cycle that examines four candidate records and promotes none of them did its job. Write the cycle report anyway, log the negatives, and record why nothing advanced. The pressure to "make progress" by accepting weak matches is exactly how trees fill with strangers.

## 10. Oral history is a source too — register it

Interviews get a date, a source ID, and a register entry like any archive film. Separate first-hand memory from hearsay at capture time, while the distinction is still checkable. And date oral-history files by the *capture* date, not the event date.

## 11. Keep the public/private line absolute

Never generate a public artifact by copy-editing private files — write public docs fresh, then sweep for names, emails, phone numbers, IDs, and secret-shaped strings before any push. Two corollaries: your private project's git history is as sensitive as its worktree, and generated site bundles (`dist/`, local emulator state) can carry personal data into places you forgot to check.

## 12. The hobby must not become homework

The moment the research queue lands on the owner's personal task list, the hobby starts generating guilt instead of joy, and the human starts avoiding the project. The queue belongs to the AI research partner inside the project folder; discoveries are shared conversationally. This is a contract clause in the generated `AGENTS.md`, not a suggestion.
