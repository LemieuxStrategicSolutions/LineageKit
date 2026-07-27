#!/usr/bin/env python3
"""Build a four-generation foundation report and internal research queue."""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict, deque
from datetime import date
from pathlib import Path


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write_rows(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--roots", nargs="+", required=True)
    parser.add_argument("--generations", type=int, default=4)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--queue", type=Path, required=True)
    args = parser.parse_args()

    people = {row["person_id"]: row for row in read_rows(args.data / "People.csv")}
    relationships = read_rows(args.data / "Relationships.csv")
    events = read_rows(args.data / "Events.csv")
    source_links = read_rows(args.data / "Source Links.csv")

    parents_by_child: dict[str, list[str]] = defaultdict(list)
    for row in relationships:
        if row["relationship_type"] == "parent_child":
            parents_by_child[row["person_2_id"]].append(row["person_1_id"])

    events_by_person: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in events:
        events_by_person[row["person_id"]].append(row)
    source_count_by_person: dict[str, int] = defaultdict(int)
    for row in source_links:
        if row["person_id"]:
            source_count_by_person[row["person_id"]] += 1

    ancestry: dict[tuple[str, str], tuple[int, str]] = {}
    for root_id in args.roots:
        root_name = " ".join(
            item for item in [people[root_id]["given_names"], people[root_id]["surname"]] if item
        )
        queue = deque([(root_id, 0, root_name)])
        seen = {root_id}
        while queue:
            person_id, generation, path = queue.popleft()
            ancestry[(root_id, person_id)] = (generation, path)
            if generation >= args.generations - 1:
                continue
            for parent_id in parents_by_child.get(person_id, []):
                if parent_id in seen or parent_id not in people:
                    continue
                seen.add(parent_id)
                parent_name = " ".join(
                    item for item in [people[parent_id]["given_names"], people[parent_id]["surname"]] if item
                )
                queue.append((parent_id, generation + 1, f"{path} → {parent_name}"))

    generation_labels = {0: "Root", 1: "Parent", 2: "Grandparent", 3: "Great-grandparent"}
    report_lines = [
        f"# Four-Generation Foundation — {date.today().strftime('%B %-d, %Y')}",
        "",
        "This is a seed-tree inventory, not a proof report. Every imported relationship remains a hypothesis until supported independently.",
        "",
    ]
    queue_rows: list[dict[str, str]] = []
    unique_people: set[str] = set()
    missing_parent_slots = 0

    for root_id in args.roots:
        root = people[root_id]
        root_name = " ".join(item for item in [root["given_names"], root["surname"]] if item)
        report_lines.extend([f"## {root_name} line", "", "| Generation | Person | Born | Died | Citations | Gaps |", "|---|---|---|---|---:|---|"])
        rows_for_root = [
            (person_id, details)
            for (candidate_root, person_id), details in ancestry.items()
            if candidate_root == root_id
        ]
        rows_for_root.sort(key=lambda item: (item[1][0], people[item[0]]["surname"], people[item[0]]["given_names"]))
        for person_id, (generation, path) in rows_for_root:
            unique_people.add(person_id)
            person = people[person_id]
            name = " ".join(item for item in [person["given_names"], person["surname"]] if item) or person_id
            person_events = events_by_person.get(person_id, [])
            birth = next((event for event in person_events if event["event_type"] == "birth"), None)
            death = next((event for event in person_events if event["event_type"] == "death"), None)
            gaps: list[str] = []
            if not birth or not birth["date_exact"]:
                gaps.append("birth date")
            if not birth or not birth["place_original"]:
                gaps.append("birth place")
            if person["living_status"] == "deceased":
                if not death or not death["date_exact"]:
                    gaps.append("death date")
                if not death or not death["place_original"]:
                    gaps.append("death place")
            if source_count_by_person.get(person_id, 0) == 0:
                gaps.append("event citations")
            if generation < args.generations - 1 and len(parents_by_child.get(person_id, [])) < 2:
                gaps.append("parent link")
                missing_parent_slots += 2 - len(parents_by_child.get(person_id, []))
            birth_text = " — ".join(item for item in [(birth or {}).get("date_exact", ""), (birth or {}).get("place_original", "")] if item)
            death_text = " — ".join(item for item in [(death or {}).get("date_exact", ""), (death or {}).get("place_original", "")] if item)
            gap_text = ", ".join(gaps) if gaps else "none visible in seed"
            report_lines.append(
                f"| {generation_labels.get(generation, f'Generation {generation}')} | {name} (`{person_id}`) | {birth_text} | {death_text} | {source_count_by_person.get(person_id, 0)} | {gap_text} |"
            )
            if gaps:
                priority = 1 if "parent link" in gaps else 2 if "event citations" in gaps else 3
                queue_rows.append(
                    {
                        "priority": str(priority),
                        "root_line": root_name,
                        "generation": generation_labels.get(generation, str(generation)),
                        "person_id": person_id,
                        "person_name": name,
                        "research_gaps": "; ".join(gaps),
                        "seed_source_links": str(source_count_by_person.get(person_id, 0)),
                        "relationship_path": path,
                        "research_status": "unstarted",
                    }
                )
        report_lines.append("")

    queue_rows.sort(key=lambda row: (int(row["priority"]), row["root_line"], row["generation"], row["person_name"]))
    report_lines.extend(
        [
            "## Foundation summary",
            "",
            f"- Unique people in the four-generation foundation: {len(unique_people)}",
            f"- Missing parent slots within the audited generation boundary: {missing_parent_slots}",
            f"- Foundation people with visible research gaps: {len({row['person_id'] for row in queue_rows})}",
            "- Research begins with missing parent links and uncited vital events, then moves outward through siblings and witnesses.",
            "",
        ]
    )

    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text("\n".join(report_lines), encoding="utf-8")
    headers = [
        "priority",
        "root_line",
        "generation",
        "person_id",
        "person_name",
        "research_gaps",
        "seed_source_links",
        "relationship_path",
        "research_status",
    ]
    write_rows(args.queue, headers, queue_rows)
    print(f"Foundation contains {len(unique_people)} unique people.")
    print(f"Research queue contains {len(queue_rows)} person-line entries.")
    print(f"Missing parent slots: {missing_parent_slots}.")


if __name__ == "__main__":
    main()
