// Synthetic example data. Every person, place, and record is invented — see
// examples/README.md at the repository root for the family this describes.

export type EvidenceStatus = "confirmed" | "probable" | "hypothesis" | "conflicting" | "disproved" | "open";

export type TreeNode = {
  name: string;
  detail: string;
  status: EvidenceStatus;
  personSlug?: string;
};

export type FamilyLine = {
  slug: string;
  name: string;
  relationship: string;
  subtitle: string;
  geography: string;
  summary: string;
  state: string;
  researchTerms: string[];
  generations: { label: string; explanation: string; people: TreeNode[] }[];
};

export const familyLines: FamilyLine[] = [
  {
    slug: "ashford",
    name: "Ashford",
    relationship: "First root · paternal grandfather",
    subtitle: "Edmund → Thomas Ashford and Margaret Quill → parents still open",
    geography: "Stonebridge",
    state: "Most developed line · birth confirmed on an original image",
    researchTerms: ["Ashford", "Quill", "Stonebridge"],
    summary:
      "This line starts with Edmund Ashford and moves backward only through his direct parents. Edmund's baptism was located in the Stonebridge parish register, naming Thomas Ashford and Margaret Quill — the exact parents carried in the seed — which promoted his birth to confirmed. The register also exposed a second Edmund Ashford baptized the same year with different parents: recorded as a separate person, not merged. Thomas and Margaret's own marriage record is the next proof target.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "The deceased grandparent who opens this line. His living descendants — the connecting generation — are intentionally unnamed in this public edition.",
        people: [{ name: "Edmund Ashford", detail: "1921–1998 · baptism confirmed on the original register image", status: "confirmed", personSlug: "edmund-ashford" }],
      },
      {
        label: "His parents",
        explanation: "Both named on Edmund's baptism entry, matching the seed exactly.",
        people: [
          { name: "Thomas Ashford", detail: "c. 1890–1957 · the 1912 emigration hypothesis was disproved", status: "confirmed", personSlug: "thomas-ashford" },
          { name: "Margaret Quill", detail: "c. 1894–1976 · named on the baptism entry", status: "confirmed", personSlug: "margaret-quill" },
        ],
      },
      {
        label: "Their parents",
        explanation: "No record naming this generation has been located yet.",
        people: [
          { name: "Thomas's father", detail: "Not yet identified", status: "open" },
          { name: "Thomas's mother", detail: "Not yet identified", status: "open" },
          { name: "Margaret's father", detail: "Not yet identified", status: "open" },
          { name: "Margaret's mother", detail: "Not yet identified", status: "open" },
        ],
      },
    ],
  },
  {
    slug: "fenwick",
    name: "Fenwick",
    relationship: "Second root · paternal grandfather",
    subtitle: "Harold → parents unknown · birthplace carries a live conflict",
    geography: "Dunmore Cross · Larkfield",
    state: "Probable birth · conflicting birthplace kept visible",
    researchTerms: ["Fenwick", "Dunmore Cross", "Larkfield"],
    summary:
      "Harold Fenwick's civil birth certificate places his 1918 birth at Dunmore Cross, but his 1989 death record — reported by a grandson informant — claims Larkfield. Both assertions stand, cross-linked as a conflict, until a third record breaks the tie. The certificate made near the event outweighs the informant's memory, so the birth is held at probable rather than smoothed to confirmed.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "The deceased grandparent who opens this line. The living connecting generation is unnamed here.",
        people: [{ name: "Harold Fenwick", detail: "1918–1989 · birthplace disputed between two records", status: "conflicting", personSlug: "harold-fenwick" }],
      },
      {
        label: "His parents",
        explanation: "No parent-bearing record has been reviewed yet.",
        people: [
          { name: "Harold's father", detail: "Not yet identified", status: "open" },
          { name: "Harold's mother", detail: "Not yet identified", status: "open" },
        ],
      },
    ],
  },
  {
    slug: "iverson",
    name: "Iverson",
    relationship: "Second root · maternal grandmother",
    subtitle: "Rosa → recorded earlier as Róisín Iversen → father Niall Iversen",
    geography: "Kilnaray · Larkfield",
    state: "Name-variant join accepted on two independent bridges",
    researchTerms: ["Iverson", "Iversen", "Kilnaray"],
    summary:
      "Rosa Iverson appears in older records as Róisín Iversen. The join was not made on the name alone: her 1951 marriage record independently names her father Niall and her birthplace Kilnaray, matching the baptism register. Two bridges, so the identity chain holds — but her birth stays probable until the civil (not parish) entry is obtained.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "The deceased grandparent who opens this line. The living connecting generation is unnamed here.",
        people: [{ name: "Rosa Iverson", detail: "1929–2010 · baptized as Róisín Iversen", status: "probable", personSlug: "rosa-iverson" }],
      },
      {
        label: "Her parents",
        explanation: "Her father is named on both bridge records; her mother is not yet identified.",
        people: [
          { name: "Niall Iversen", detail: "Named on the baptism entry and the 1951 marriage record", status: "probable", personSlug: "niall-iversen" },
          { name: "Rosa's mother", detail: "Not yet identified", status: "open" },
        ],
      },
    ],
  },
  {
    slug: "beckwith",
    name: "Beckwith",
    relationship: "First root · paternal grandmother",
    subtitle: "Alice → parents unknown",
    geography: "Locality not yet established",
    state: "Resting · no viable next record identified yet",
    researchTerms: ["Beckwith"],
    summary:
      "Alice Beckwith's line is established as a research lane, but no original record has been reviewed yet. Her recorded dates remain a hypothesis carried from the imported family tree.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "Carried from the seed import; nothing above her has been searched yet.",
        people: [{ name: "Alice Beckwith", detail: "1924–2009 · dates carried from the imported tree", status: "hypothesis", personSlug: "alice-beckwith" }],
      },
    ],
  },
  {
    slug: "cardew",
    name: "Cardew",
    relationship: "First root · maternal grandfather",
    subtitle: "Arthur → parents unknown",
    geography: "Locality not yet established",
    state: "Resting · no viable next record identified yet",
    researchTerms: ["Cardew"],
    summary:
      "Arthur Cardew's line is a research lane awaiting its first cycle. His recorded dates remain a hypothesis from the imported tree.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "Carried from the seed import; nothing above him has been searched yet.",
        people: [{ name: "Arthur Cardew", detail: "1919–1990 · dates carried from the imported tree", status: "hypothesis", personSlug: "arthur-cardew" }],
      },
    ],
  },
  {
    slug: "delmore",
    name: "Delmore",
    relationship: "First root · maternal grandmother",
    subtitle: "Maud → parents unknown",
    geography: "Locality not yet established",
    state: "Resting · no viable next record identified yet",
    researchTerms: ["Delmore"],
    summary:
      "Maud Delmore's line is a research lane awaiting its first cycle. Her recorded dates remain a hypothesis from the imported tree.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "Carried from the seed import; nothing above her has been searched yet.",
        people: [{ name: "Maud Delmore", detail: "1923–2001 · dates carried from the imported tree", status: "hypothesis", personSlug: "maud-delmore" }],
      },
    ],
  },
  {
    slug: "grantham",
    name: "Grantham",
    relationship: "Second root · paternal grandmother",
    subtitle: "Edith → parents unknown",
    geography: "Locality not yet established",
    state: "Resting · one negative search logged",
    researchTerms: ["Grantham"],
    summary:
      "Edith Grantham's line has one honest result so far: a newspaper-index search that found nothing, logged as a nil result so the record set is closed rather than silently forgotten.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "Carried from the seed import; a negative search is the only completed work.",
        people: [{ name: "Edith Grantham", detail: "1920–1995 · dates carried from the imported tree", status: "hypothesis", personSlug: "edith-grantham" }],
      },
    ],
  },
  {
    slug: "holloway",
    name: "Holloway",
    relationship: "Second root · maternal grandfather",
    subtitle: "Frank → married Rosa Iverson in 1951 → parents unknown",
    geography: "Larkfield",
    state: "Marriage documented · birth still resting",
    researchTerms: ["Holloway", "Larkfield"],
    summary:
      "Frank Holloway's 1951 Larkfield marriage to Rosa Iverson is documented on the civil record — the same record that served as a bridge for the Iversen/Iverson name-variant join. His own birth and parents have not yet been worked.",
    generations: [
      {
        label: "Starting ancestor",
        explanation: "His marriage record doubles as evidence for the Iverson line's identity join.",
        people: [{ name: "Frank Holloway", detail: "1926–2003 · 1951 marriage documented", status: "probable", personSlug: "frank-holloway" }],
      },
    ],
  },
];

export function getFamilyLine(slug: string) {
  return familyLines.find((line) => line.slug === slug);
}
