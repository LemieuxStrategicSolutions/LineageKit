# Independent Working Tree

## Boundary

This is not a {{TREE_HOST}} maintenance project. The local tree is the research master. {{TREE_HOST}} is a separate historical system that may be consulted read-only.

## Data model

The independent tree uses five linked tables:

| File | What it represents |
|---|---|
| `Data/People.csv` | One row per person, with a stable local person ID |
| `Data/Relationships.csv` | Parent-child, spouse, partner, adoptive, guardian, and other relationships |
| `Data/Events.csv` | Births, baptisms, residences, marriages, immigration, military service, deaths, burials, and other dated events |
| `Data/Sources.csv` | Structured links between sources and the people or events they support |
| `Data/Assertions.csv` | Individual claims, their evidence status, and conflicts |

Narrative profiles and branch reports are generated from or reconciled with these tables. They do not replace the structured data.

## Stable IDs

- People: `P000001`, `P000002`, and so on
- Relationships: `R000001`, `R000002`, and so on
- Events: `E000001`, `E000002`, and so on
- Sources: `S000001`, `S000002`, and so on
- Assertions: `A000001`, `A000002`, and so on

IDs never change, even when names or conclusions do.

## Importing the {{TREE_HOST}} seed

{{USER_NAME}} authorizes a one-time, read-only GEDCOM export as the seed. When it is obtained:

1. Save the untouched export in `{{TREE_HOST}} Exports/` with the export date.
2. Record its checksum and source date.
3. Import it into a dated staging copy, not directly into the canonical data.
4. Preserve {{TREE_HOST}} IDs as external reference IDs.
5. Mark all unsupported imported claims as `hypothesis` until audited.
6. Never sync changes back to {{TREE_HOST}} automatically.

## Future merge option

If {{USER_NAME}} later wants to merge selected findings back to {{TREE_HOST}}, produce a reviewable package containing:

- people proposed for addition
- facts proposed for enrichment
- relationships proposed for change
- sources supporting each proposal
- conflicts and uncertainty
- a GEDCOM or change report generated only from approved records

No merge happens without {{USER_NAME}}'s explicit approval.
