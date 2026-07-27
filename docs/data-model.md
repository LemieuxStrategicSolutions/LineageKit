# Data model reference

Five linked CSV tables form the canonical tree. Plain CSV on purpose: diffable, greppable, future-proof, and readable by any tool your grandchildren might have.

## Tables

**`Data/People.csv`** — one row per person.
`person_id, given_names, middle_names, surname, birth_surname, suffix, sex, preferred_name, living_status, privacy_level, notes, external_reference_ids`

- `living_status`: `living` / `deceased` / `unknown` — `unknown` is treated as living by the publication layer.
- `privacy_level`: restricts what even private reports display; the site build enforces it absolutely.
- `external_reference_ids`: e.g. `SeedGEDCOM:@I123@` — provenance back to the seed, never a live link.

**`Data/Relationships.csv`** — `relationship_id, person_1_id, person_2_id, relationship_type, start_date, end_date, place, evidence_status, notes`. Types include `parent_child` (person_1 = parent), `spouse`, `partner`, `adoptive_parent_child`, `guardian`.

**`Data/Events.csv`** — `event_id, person_id, event_type, date_exact, date_from, date_to, place_original, place_standardized, description, evidence_status, notes`. `place_original` keeps what the record says; `place_standardized` is the modern jurisdiction — never overwrite one with the other.

**`Data/Sources.csv`** — the *link* table: `link_id, source_id, person_id, event_id, relationship_id, assertion_id, role, quoted_or_transcribed_text, analysis`. One source can support many claims; each link records what the source says about *that* claim. Source descriptions themselves live in `Source Register.csv`.

**`Data/Assertions.csv`** — `assertion_id, subject_person_id, claim_type, claim_value, evidence_status, confidence_reasoning, conflicting_assertion_ids, last_reviewed`. Where disagreement lives: two assertions can conflict openly via `conflicting_assertion_ids` instead of one being silently overwritten.

## Registers (project root)

**`Research Log.csv`** — one row per search attempt, including negatives: `date, researcher, branch, person_id, person_name, research_question, repository, collection, search_terms, result, evidence_status, source_id_or_path, next_step`.

**`Source Register.csv`** — one row per source: `source_id, title, creator, repository, collection, record_type, jurisdiction, record_date, people_or_events_supported, full_citation, url_or_file, evidence_quality, access_date, notes`.

## IDs

`P000001` people · `R000001` relationships · `E000001` events · `S000001` sources · `A000001` assertions. Stable forever: IDs never change and are never reused, even when names or conclusions do. Cross-references throughout the markdown corpus rely on this.

## Evidence status vocabulary

`confirmed` · `probable` · `hypothesis` · `conflicting` · `disproved` — defined in the project README. Everything imported from a GEDCOM seed starts as `hypothesis`, including claims the host called confirmed.

## Staging

`Data/Staging/` holds the mechanical GEDCOM import (same schemas, plus `Duplicate Candidates.csv` and `GEDCOM Source Records.csv`). Rows are *promoted* from staging to canonical individually, when the evidence supports them — never bulk-copied.
