#!/usr/bin/env python3
"""Create a private staging inventory and quality audit from a GEDCOM seed."""

from __future__ import annotations

import argparse
import csv
import hashlib
import re
from collections import Counter, defaultdict, deque
from datetime import date as _date
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class Node:
    level: int
    tag: str
    value: str = ""
    xref: str = ""
    children: list["Node"] = field(default_factory=list)


LINE_RE = re.compile(
    r"^(?P<level>\d+)\s+(?:(?P<xref>@[^@]+@)\s+)?(?P<tag>[A-Z0-9_]+)(?:\s+(?P<value>.*))?$"
)


def clean_pointer(value: str) -> str:
    value = value.strip()
    return value[1:-1] if value.startswith("@") and value.endswith("@") else value


def parse_gedcom(path: Path) -> tuple[list[Node], dict[str, int]]:
    records: list[Node] = []
    stack: list[Node] = []
    parse_stats = {"blank_lines_ignored": 0, "raw_continuation_lines_preserved": 0, "unattached_lines": 0}
    with path.open("r", encoding="utf-8-sig", errors="replace", newline=None) as handle:
        for raw in handle:
            line = raw.rstrip("\r\n")
            match = LINE_RE.match(line)
            if not match:
                if not line.strip():
                    parse_stats["blank_lines_ignored"] += 1
                elif stack:
                    stack[-1].value = f"{stack[-1].value}\n{line}" if stack[-1].value else line
                    parse_stats["raw_continuation_lines_preserved"] += 1
                else:
                    parse_stats["unattached_lines"] += 1
                continue
            node = Node(
                level=int(match.group("level")),
                tag=match.group("tag"),
                value=match.group("value") or "",
                xref=clean_pointer(match.group("xref") or ""),
            )
            while stack and stack[-1].level >= node.level:
                stack.pop()
            if stack:
                stack[-1].children.append(node)
            else:
                records.append(node)
            stack.append(node)
    return records, parse_stats


def child(node: Node, tag: str) -> Node | None:
    return next((item for item in node.children if item.tag == tag), None)


def children(node: Node, tag: str) -> list[Node]:
    return [item for item in node.children if item.tag == tag]


def child_value(node: Node, tag: str) -> str:
    item = child(node, tag)
    return item.value.strip() if item else ""


def descendants(node: Node):
    queue = deque(node.children)
    while queue:
        item = queue.popleft()
        yield item
        queue.extend(item.children)


def parse_name(record: Node) -> tuple[str, str, str, str]:
    name_node = child(record, "NAME")
    if not name_node:
        return "", "", "", ""
    given = child_value(name_node, "GIVN")
    surname = child_value(name_node, "SURN")
    suffix = child_value(name_node, "NSFX")
    raw = name_node.value.strip()
    if not given and "/" in raw:
        given = raw.split("/", 1)[0].strip()
    if not surname and "/" in raw:
        parts = raw.split("/")
        if len(parts) >= 2:
            surname = parts[1].strip()
    if not given and not surname:
        given = raw
    return given, surname, suffix, raw


def event_details(event: Node) -> tuple[str, str, str]:
    return child_value(event, "DATE"), child_value(event, "PLAC"), event.value.strip()


def write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def markdown_table(counter: Counter[str], limit: int = 25) -> str:
    lines = ["| Value | Count |", "|---|---:|"]
    for value, count in counter.most_common(limit):
        lines.append(f"| {value.replace('|', '/')} | {count} |")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("gedcom", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    gedcom = args.gedcom.resolve()
    output = args.output.resolve()
    report = args.report.resolve()
    records, parse_stats = parse_gedcom(gedcom)

    individual_records = [record for record in records if record.tag == "INDI"]
    family_records = [record for record in records if record.tag == "FAM"]
    source_records = [record for record in records if record.tag == "SOUR"]

    person_id_by_xref = {
        record.xref: f"P{index:06d}" for index, record in enumerate(individual_records, start=1)
    }
    ged_source_id_by_xref = {
        record.xref: f"GS{index:06d}" for index, record in enumerate(source_records, start=1)
    }

    person_rows: list[dict[str, str]] = []
    event_rows: list[dict[str, str]] = []
    relationship_rows: list[dict[str, str]] = []
    source_rows: list[dict[str, str]] = []
    source_link_rows: list[dict[str, str]] = []
    assertion_rows: list[dict[str, str]] = []
    duplicate_basis: dict[tuple[str, str], list[tuple[str, str]]] = defaultdict(list)
    surname_counts: Counter[str] = Counter()
    place_counts: Counter[str] = Counter()
    graph: dict[str, set[str]] = defaultdict(set)
    cited_people: set[str] = set()

    missing = Counter()
    event_index = 0
    relationship_index = 0
    link_index = 0
    assertion_index = 0

    event_tags = {
        "BIRT": "birth",
        "CHR": "christening",
        "BAPM": "baptism",
        "DEAT": "death",
        "BURI": "burial",
        "RESI": "residence",
        "OCCU": "occupation",
        "IMMI": "immigration",
        "EMIG": "emigration",
        "NATU": "naturalization",
        "CENS": "census",
        "MILI": "military_service",
        "EDUC": "education",
        "RETI": "retirement",
    }

    birth_date_by_person: dict[str, str] = {}
    display_name_by_person: dict[str, str] = {}

    for record in individual_records:
        person_id = person_id_by_xref[record.xref]
        given, surname, suffix, raw_name = parse_name(record)
        display_name = " ".join(item for item in [given, surname, suffix] if item).strip() or raw_name
        display_name_by_person[person_id] = display_name
        sex = child_value(record, "SEX")
        deceased = child(record, "DEAT") is not None
        living_status = "deceased" if deceased else "unknown"
        privacy_level = "standard" if deceased else "private"
        if surname:
            surname_counts[surname] += 1
        else:
            missing["surname"] += 1
        if not given:
            missing["given name"] += 1
        if not sex:
            missing["sex"] += 1

        person_rows.append(
            {
                "person_id": person_id,
                "given_names": given,
                "middle_names": "",
                "surname": surname,
                "birth_surname": surname,
                "suffix": suffix,
                "sex": sex,
                "preferred_name": "",
                "living_status": living_status,
                "privacy_level": privacy_level,
                "notes": "Imported from GEDCOM seed; unaudited.",
                "external_reference_ids": f"SeedGEDCOM:{record.xref}",
            }
        )

        assertion_index += 1
        assertion_rows.append(
            {
                "assertion_id": f"A{assertion_index:06d}",
                "subject_person_id": person_id,
                "claim_type": "name",
                "claim_value": display_name,
                "evidence_status": "hypothesis",
                "confidence_reasoning": "Imported from the seed tree and not yet independently audited.",
                "conflicting_assertion_ids": "",
                "last_reviewed": _date.today().isoformat(),
            }
        )

        has_birth_date = False
        has_birth_place = False
        has_death_date = False
        has_death_place = False
        person_event_count = 0
        for event_node in record.children:
            if event_node.tag not in event_tags:
                continue
            person_event_count += 1
            event_index += 1
            event_id = f"E{event_index:06d}"
            date, place, description = event_details(event_node)
            if place:
                place_counts[place] += 1
            if event_node.tag == "BIRT":
                birth_date_by_person[person_id] = date
                has_birth_date = bool(date)
                has_birth_place = bool(place)
            if event_node.tag == "DEAT":
                has_death_date = bool(date)
                has_death_place = bool(place)
            event_rows.append(
                {
                    "event_id": event_id,
                    "person_id": person_id,
                    "event_type": event_tags[event_node.tag],
                    "date_exact": date,
                    "date_from": "",
                    "date_to": "",
                    "place_original": place,
                    "place_standardized": "",
                    "description": description,
                    "evidence_status": "hypothesis",
                    "notes": "Imported from seed; date field preserves the GEDCOM text as supplied.",
                }
            )
            for source_node in children(event_node, "SOUR"):
                source_xref = clean_pointer(source_node.value)
                source_id = ged_source_id_by_xref.get(source_xref, source_xref)
                link_index += 1
                source_link_rows.append(
                    {
                        "link_id": f"L{link_index:06d}",
                        "source_id": source_id,
                        "person_id": person_id,
                        "event_id": event_id,
                        "relationship_id": "",
                        "assertion_id": "",
                        "role": child_value(source_node, "PAGE"),
                        "quoted_or_transcribed_text": child_value(source_node, "TEXT"),
                        "analysis": "Imported citation; source image and claim support not yet reviewed.",
                    }
                )
                cited_people.add(person_id)

        if not has_birth_date:
            missing["birth date"] += 1
        if not has_birth_place:
            missing["birth place"] += 1
        if deceased and not has_death_date:
            missing["death date among people marked deceased"] += 1
        if deceased and not has_death_place:
            missing["death place among people marked deceased"] += 1
        if person_event_count == 0:
            missing["people with no structured events"] += 1

        if any(item.tag == "SOUR" for item in descendants(record)):
            cited_people.add(person_id)
        for source_node in children(record, "SOUR"):
            source_xref = clean_pointer(source_node.value)
            source_id = ged_source_id_by_xref.get(source_xref, source_xref)
            link_index += 1
            source_link_rows.append(
                {
                    "link_id": f"L{link_index:06d}",
                    "source_id": source_id,
                    "person_id": person_id,
                    "event_id": "",
                    "relationship_id": "",
                    "assertion_id": "",
                    "role": child_value(source_node, "PAGE"),
                    "quoted_or_transcribed_text": child_value(source_node, "TEXT"),
                    "analysis": "Imported person-level citation; claim support not yet reviewed.",
                }
            )
            cited_people.add(person_id)
        normalized_name = re.sub(r"[^a-z0-9]", "", display_name.lower())
        duplicate_basis[(normalized_name, birth_date_by_person.get(person_id, ""))].append(
            (person_id, display_name)
        )

    for record in source_records:
        source_id = ged_source_id_by_xref[record.xref]
        source_rows.append(
            {
                "source_id": source_id,
                "gedcom_xref": record.xref,
                "title": child_value(record, "TITL") or record.value,
                "author": child_value(record, "AUTH"),
                "publication": child_value(record, "PUBL"),
                "abbreviation": child_value(record, "ABBR"),
                "repository_pointer": clean_pointer(child_value(record, "REPO")),
                "text": child_value(record, "TEXT"),
                "audit_status": "unreviewed",
            }
        )

    family_record_by_xref = {record.xref: record for record in family_records}

    for family_record in family_records:
        husbands = [person_id_by_xref.get(clean_pointer(item.value), "") for item in children(family_record, "HUSB")]
        wives = [person_id_by_xref.get(clean_pointer(item.value), "") for item in children(family_record, "WIFE")]
        spouses = [item for item in husbands + wives if item]
        children_ids = [person_id_by_xref.get(clean_pointer(item.value), "") for item in children(family_record, "CHIL")]
        children_ids = [item for item in children_ids if item]
        marriage_node = child(family_record, "MARR")
        marriage_date, marriage_place, _ = event_details(marriage_node) if marriage_node else ("", "", "")
        if marriage_place:
            place_counts[marriage_place] += 1

        if len(spouses) >= 2:
            relationship_index += 1
            relationship_rows.append(
                {
                    "relationship_id": f"R{relationship_index:06d}",
                    "person_1_id": spouses[0],
                    "person_2_id": spouses[1],
                    "relationship_type": "spouse",
                    "start_date": marriage_date,
                    "end_date": "",
                    "place": marriage_place,
                    "evidence_status": "hypothesis",
                    "notes": f"Imported from GEDCOM family {family_record.xref}; unaudited.",
                }
            )
            graph[spouses[0]].add(spouses[1])
            graph[spouses[1]].add(spouses[0])
            if marriage_node:
                for person_id in spouses[:2]:
                    event_index += 1
                    event_rows.append(
                        {
                            "event_id": f"E{event_index:06d}",
                            "person_id": person_id,
                            "event_type": "marriage",
                            "date_exact": marriage_date,
                            "date_from": "",
                            "date_to": "",
                            "place_original": marriage_place,
                            "place_standardized": "",
                            "description": "",
                            "evidence_status": "hypothesis",
                            "notes": f"Imported from GEDCOM family {family_record.xref}; unaudited.",
                        }
                    )

        for parent_id in spouses:
            for child_id in children_ids:
                relationship_index += 1
                relationship_rows.append(
                    {
                        "relationship_id": f"R{relationship_index:06d}",
                        "person_1_id": parent_id,
                        "person_2_id": child_id,
                        "relationship_type": "parent_child",
                        "start_date": "",
                        "end_date": "",
                        "place": "",
                        "evidence_status": "hypothesis",
                        "notes": f"Imported from GEDCOM family {family_record.xref}; unaudited.",
                    }
                )
                graph[parent_id].add(child_id)
                graph[child_id].add(parent_id)

    # Some GEDCOM exports encode a person's family link only on the individual
    # record (FAMC), with PEDI describing adoption or another pedigree type.
    # Preserve those links even when the family record omits a CHIL entry.
    existing_relationships = {
        (row["person_1_id"], row["person_2_id"], row["relationship_type"])
        for row in relationship_rows
    }
    pedigree_relationship_types = {
        "adopted": "adoptive_parent_child",
        "foster": "foster_parent_child",
        "guardian": "guardian_child",
    }
    for individual_record in individual_records:
        child_id = person_id_by_xref[individual_record.xref]
        for family_link in children(individual_record, "FAMC"):
            family_xref = clean_pointer(family_link.value)
            family_record = family_record_by_xref.get(family_xref)
            if not family_record:
                continue
            parent_ids = [
                person_id_by_xref.get(clean_pointer(item.value), "")
                for tag in ("HUSB", "WIFE")
                for item in children(family_record, tag)
            ]
            pedigree = child_value(family_link, "PEDI").strip().lower()
            relationship_type = pedigree_relationship_types.get(pedigree, "parent_child")
            for parent_id in (item for item in parent_ids if item):
                key = (parent_id, child_id, relationship_type)
                if key in existing_relationships:
                    continue
                relationship_index += 1
                relationship_rows.append(
                    {
                        "relationship_id": f"R{relationship_index:06d}",
                        "person_1_id": parent_id,
                        "person_2_id": child_id,
                        "relationship_type": relationship_type,
                        "start_date": "",
                        "end_date": "",
                        "place": "",
                        "evidence_status": "hypothesis",
                        "notes": (
                            f"Imported from individual FAMC link to GEDCOM family {family_xref}; "
                            f"PEDI={pedigree or 'unspecified'}; unaudited."
                        ),
                    }
                )
                existing_relationships.add(key)
                graph[parent_id].add(child_id)
                graph[child_id].add(parent_id)

    duplicate_rows: list[dict[str, str]] = []
    for (normalized_name, birth_date), people in duplicate_basis.items():
        if normalized_name and len(people) > 1:
            duplicate_rows.append(
                {
                    "normalized_name": normalized_name,
                    "birth_date": birth_date,
                    "candidate_count": str(len(people)),
                    "person_ids": ";".join(item[0] for item in people),
                    "display_names": ";".join(item[1] for item in people),
                    "review_status": "unreviewed",
                }
            )

    all_people = set(person_id_by_xref.values())
    seen: set[str] = set()
    component_sizes: list[int] = []
    for person_id in all_people:
        if person_id in seen:
            continue
        queue = [person_id]
        seen.add(person_id)
        size = 0
        while queue:
            current = queue.pop()
            size += 1
            for neighbor in graph.get(current, set()):
                if neighbor not in seen:
                    seen.add(neighbor)
                    queue.append(neighbor)
        component_sizes.append(size)
    component_sizes.sort(reverse=True)

    write_csv(output / "People.csv", list(person_rows[0].keys()) if person_rows else [], person_rows)
    write_csv(output / "Relationships.csv", list(relationship_rows[0].keys()) if relationship_rows else [], relationship_rows)
    write_csv(output / "Events.csv", list(event_rows[0].keys()) if event_rows else [], event_rows)
    write_csv(output / "GEDCOM Source Records.csv", list(source_rows[0].keys()) if source_rows else [], source_rows)
    write_csv(output / "Source Links.csv", list(source_link_rows[0].keys()) if source_link_rows else [], source_link_rows)
    write_csv(output / "Assertions.csv", list(assertion_rows[0].keys()) if assertion_rows else [], assertion_rows)
    write_csv(
        output / "Duplicate Candidates.csv",
        ["normalized_name", "birth_date", "candidate_count", "person_ids", "display_names", "review_status"],
        duplicate_rows,
    )

    digest = hashlib.sha256(gedcom.read_bytes()).hexdigest()
    missing_table = markdown_table(Counter(dict(missing)), limit=len(missing))
    source_coverage = (len(cited_people) / len(individual_records) * 100) if individual_records else 0
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(
        f"""# Seed Audit — {_date.today().strftime("%B %-d, %Y")}

## File integrity

- Seed: `{gedcom.name}`
- SHA-256: `{digest}`
- Bytes: {gedcom.stat().st_size:,}
- Blank separator lines ignored: {parse_stats['blank_lines_ignored']}
- Raw multiline continuation lines preserved: {parse_stats['raw_continuation_lines_preserved']}
- Nonblank lines that could not be attached: {parse_stats['unattached_lines']}

## Structure

- Individuals: {len(individual_records):,}
- Family records: {len(family_records):,}
- Embedded source records: {len(source_records):,}
- Local relationship rows created: {len(relationship_rows):,}
- Local event rows created: {len(event_rows):,}
- Potential duplicate groups: {len(duplicate_rows):,}
- Connected components: {len(component_sizes):,}
- Largest connected component: {(component_sizes[0] if component_sizes else 0):,} people
- Isolated people: {sum(1 for size in component_sizes if size == 1):,}

## Evidence posture

All imported people, relationships, events, and names are staged as **hypotheses** until independently audited. The seed is a map of prior work, not proof.

- People with at least one source citation somewhere in their GEDCOM record: {len(cited_people):,} of {len(individual_records):,} ({source_coverage:.1f}%)

## Missing-field inventory

{missing_table}

## Most common surnames in the seed

{markdown_table(surname_counts)}

## Most common recorded places

{markdown_table(place_counts)}

## Recommended first research pass

1. Identify the four-generation direct-ancestor set around the root person or couple.
2. Audit every parent-child link in that set before expanding farther back.
3. Resolve exact-name and birth-date duplicate candidates.
4. Prioritize people with no birth place, no death place, or no citations.
5. Use collateral relatives and witnesses to break uncertain links rather than accepting public-tree matches.
""",
        encoding="utf-8",
    )

    print(f"Imported {len(individual_records)} people, {len(family_records)} families, and {len(source_records)} sources.")
    print(f"Created {len(event_rows)} events and {len(relationship_rows)} relationships.")
    print(f"Source coverage: {len(cited_people)}/{len(individual_records)} ({source_coverage:.1f}%).")
    print(f"Potential duplicate groups: {len(duplicate_rows)}.")
    print(f"Connected components: {len(component_sizes)}; largest: {component_sizes[0] if component_sizes else 0}.")


if __name__ == "__main__":
    main()
