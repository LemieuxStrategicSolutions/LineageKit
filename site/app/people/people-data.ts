// Synthetic example data. Every person, place, and record is invented — see
// examples/README.md at the repository root for the family this describes.

import type { EvidenceStatus } from "../branches/branch-data";

export type Person = {
  slug: string;
  name: string;
  alternateNames?: string;
  lifespan: string;
  branch: string;
  placeLine: string;
  status: EvidenceStatus;
  statusLabel: string;
  summary: string;
  narrative: string[];
  facts: { label: string; value: string }[];
  openQuestions: string[];
  sources: string[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  galleryTitle?: string;
  galleryDescription?: string;
  gallery?: { src: string; alt: string; caption: string }[];
  originalRecord?: { label: string; href: string };
  records?: { label: string; href: string; note?: string }[];
  lineSlug: "ashford" | "beckwith" | "cardew" | "delmore" | "fenwick" | "grantham" | "holloway" | "iverson";
  parents?: {
    name: string;
    detail: string;
    status: EvidenceStatus;
    slug?: string;
  }[];
};

export const people: Person[] = [
  {
    slug: "edmund-ashford",
    name: "Edmund Ashford",
    lifespan: "2 November 1921 – 14 March 1998",
    branch: "Ashford",
    lineSlug: "ashford",
    placeLine: "Stonebridge",
    status: "confirmed",
    statusLabel: "Birth confirmed on the original image",
    parents: [
      { name: "Thomas Ashford", detail: "Named on Edmund's baptism entry, matching the seed exactly", status: "confirmed", slug: "thomas-ashford" },
      { name: "Margaret Quill", detail: "Named on Edmund's baptism entry, matching the seed exactly", status: "confirmed", slug: "margaret-quill" },
    ],
    summary:
      "Edmund Ashford's baptism was located in the Stonebridge parish register: baptized 9 November 1921, parents Thomas Ashford and Margaret Quill. The original image moved his birth from hypothesis to confirmed — and exposed a same-name trap on the way.",
    narrative: [
      "The imported tree carried Edmund's birth as 2 November 1921 in Stonebridge, labeled a hypothesis because the only support was a register reference imported with the GEDCOM. Cycle 1 targeted the original image.",
      "The Stonebridge Parish Baptism Register 1900–1930 records Edmund Ashford, baptized 9 November 1921, parents Thomas Ashford and Margaret Quill. Parents matching the seed exactly is what promoted the birth to confirmed.",
      "The same register holds a second Edmund Ashford, baptized 14 February 1921, parents Henry Ashford and Jane Corbett. Same name, same year, same town — and still a different person, because the parents differ. He was recorded as a separate individual with a cousin hypothesis, not merged.",
    ],
    facts: [
      { label: "Birth", value: "2 November 1921, Stonebridge" },
      { label: "Baptism", value: "9 November 1921, Stonebridge parish" },
      { label: "Parents", value: "Thomas Ashford and Margaret Quill" },
      { label: "Death", value: "14 March 1998" },
    ],
    openQuestions: [
      "Can Thomas and Margaret's marriage record be located (the Cycle 2 candidate)?",
      "Is the second Edmund Ashford — parents Henry Ashford and Jane Corbett — a first cousin, as the register geography suggests?",
    ],
    sources: [
      "S000101 — Stonebridge Parish Baptism Register 1900–1930, image 44",
      "Seed GEDCOM register reference (superseded by the original image)",
    ],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report", note: "Includes the duplicate-Edmund resolution and the promote verdict." },
    ],
  },
  {
    slug: "thomas-ashford",
    name: "Thomas Ashford",
    lifespan: "c. 1890 – 1957",
    branch: "Ashford",
    lineSlug: "ashford",
    placeLine: "Stonebridge",
    status: "confirmed",
    statusLabel: "Relationship confirmed · one hypothesis disproved",
    parents: [],
    summary:
      "Thomas Ashford is confirmed as Edmund's father by the baptism entry. The family story that he emigrated in 1912 is disproved: the 1913 Stonebridge trade directory lists him still resident on Mill Lane.",
    narrative: [
      "Thomas appears on Edmund's 1921 baptism entry alongside Margaret Quill, which is the record that confirms the parent relationship.",
      "The imported tree carried a hypothesis that Thomas emigrated in 1912. The 1913 Stonebridge trade directory, page 88, lists Thomas Ashford resident on Mill Lane — after the supposed departure. The hypothesis is disproved, and the disproof is recorded as a win: a closed question is progress.",
      "His own birth, marriage, and parents remain open. The marriage record with Margaret Quill is the leading Cycle 2 target because it may name both earlier generations.",
    ],
    facts: [
      { label: "Birth", value: "c. 1890, locality not yet established" },
      { label: "Residence 1913", value: "Mill Lane, Stonebridge (trade directory)" },
      { label: "1912 emigration story", value: "Disproved by the 1913 directory entry" },
      { label: "Death", value: "1957" },
    ],
    openQuestions: [
      "When and where did Thomas marry Margaret Quill?",
      "Who were Thomas's parents?",
    ],
    sources: [
      "S000101 — Stonebridge Parish Baptism Register (names him as Edmund's father)",
      "S000106 — Stonebridge Trade Directory 1913, p. 88",
    ],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report", note: "Records the emigration disproof and the next-question queue." },
    ],
  },
  {
    slug: "margaret-quill",
    name: "Margaret Quill",
    lifespan: "c. 1894 – 1976",
    branch: "Ashford",
    lineSlug: "ashford",
    placeLine: "Stonebridge",
    status: "confirmed",
    statusLabel: "Relationship confirmed",
    parents: [],
    summary:
      "Margaret Quill is confirmed as Edmund's mother by the 1921 baptism entry. Everything earlier in her life — her own birth, her parents, her marriage date — is still open research.",
    narrative: [
      "Margaret's name on Edmund's baptism entry, matching the seed's parents exactly, is what confirmed both parent relationships in a single record.",
      "No record naming Margaret's own parents has been reviewed. The archive does not substitute an imported-tree guess for that missing proof.",
    ],
    facts: [
      { label: "Birth", value: "c. 1894, locality not yet established" },
      { label: "Recorded on", value: "Edmund Ashford's 1921 baptism entry" },
      { label: "Death", value: "1976" },
    ],
    openQuestions: [
      "When and where did Margaret marry Thomas Ashford?",
      "Who were Margaret's parents?",
    ],
    sources: ["S000101 — Stonebridge Parish Baptism Register 1900–1930, image 44"],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report" },
    ],
  },
  {
    slug: "harold-fenwick",
    name: "Harold Fenwick",
    lifespan: "23 June 1918 – 19 September 1989",
    branch: "Fenwick",
    lineSlug: "fenwick",
    placeLine: "Dunmore Cross → Larkfield",
    status: "conflicting",
    statusLabel: "Birthplace in open conflict",
    parents: [
      { name: "Father not yet identified", detail: "No parent-bearing record reviewed", status: "open" },
      { name: "Mother not yet identified", detail: "No parent-bearing record reviewed", status: "open" },
    ],
    summary:
      "Harold Fenwick's civil birth certificate says Dunmore Cross. His death record says Larkfield. Both assertions stand, cross-linked as a conflict, until a third record breaks the tie — the archive does not smooth disagreements over.",
    narrative: [
      "The civil birth certificate no. 1918/0342 records Harold's birth at Dunmore Cross on 23 June 1918. It is the original record made near the event.",
      "His 1989 death record states his birthplace as Larkfield. The informant was a grandson who never knew Dunmore Cross, which weakens the claim — but does not erase it. The two assertions are linked as a conflict and both remain visible.",
      "On the strength of the near-event certificate, Harold's birth is held at probable with the conflict labeled. A baptism or school registration is the tie-breaking record to find.",
    ],
    facts: [
      { label: "Birth (certificate)", value: "23 June 1918, Dunmore Cross" },
      { label: "Birth (death record)", value: "Larkfield — informant-supplied, conflicting" },
      { label: "Death", value: "19 September 1989, Larkfield" },
    ],
    openQuestions: [
      "Which birthplace does a third record — baptism or school registration — support?",
      "Who were Harold's parents?",
    ],
    sources: [
      "S000102 — Dunmore Cross civil birth certificate no. 1918/0342",
      "S000103 — Larkfield civil death record 1989/1107",
    ],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report", note: "Documents the conflict and why the certificate outweighs the informant." },
    ],
  },
  {
    slug: "rosa-iverson",
    name: "Rosa Iverson",
    alternateNames: "Róisín Iversen (baptismal record)",
    lifespan: "16 December 1929 – 2010",
    branch: "Iverson",
    lineSlug: "iverson",
    placeLine: "Kilnaray → Larkfield",
    status: "probable",
    statusLabel: "Identity join accepted · birth probable",
    parents: [
      { name: "Niall Iversen", detail: "Named on the baptism entry and, independently, on Rosa's 1951 marriage record", status: "probable", slug: "niall-iversen" },
      { name: "Mother not yet identified", detail: "Not named on the reviewed records", status: "open" },
    ],
    summary:
      "Rosa Iverson appears in older records as Róisín Iversen. The join rests on two independent bridges — her father's name and her townland — not on the name resemblance alone.",
    narrative: [
      "The Kilnaray parish baptism register records Róisín Iversen, baptized 20 December 1929, father Niall Iversen, townland Kilnaray.",
      "Rosa's 1951 civil marriage record to Frank Holloway independently names her father Niall and her birthplace Kilnaray. A name variant plus two independent bridges justified joining the records; either bridge alone would not have.",
      "Her birth stays probable, not confirmed, until the civil — not parish — birth entry is obtained.",
    ],
    facts: [
      { label: "Birth", value: "16 December 1929, Kilnaray" },
      { label: "Baptism", value: "20 December 1929, as Róisín Iversen" },
      { label: "Marriage", value: "3 June 1951, Larkfield, to Frank Holloway" },
      { label: "Death", value: "2010" },
    ],
    openQuestions: [
      "Can the civil birth entry for Róisín Iversen, Kilnaray, December 1929 be located?",
      "Who was Rosa's mother?",
    ],
    sources: [
      "S000104 — Kilnaray parish baptism register entry",
      "S000105 — Larkfield civil marriage record, 1951",
    ],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report", note: "Explains the two-bridge rule behind the name-variant join." },
    ],
  },
  {
    slug: "niall-iversen",
    name: "Niall Iversen",
    lifespan: "Dates not yet established",
    branch: "Iverson",
    lineSlug: "iverson",
    placeLine: "Kilnaray",
    status: "probable",
    statusLabel: "Named on two independent records",
    parents: [],
    summary:
      "Niall Iversen is Rosa's probable father, named on her baptism entry and — independently — on her 1951 marriage record. Nothing else about his life has yet been documented.",
    narrative: [
      "Niall appears twice in the reviewed record set: as father on the 1929 Kilnaray baptism of Róisín Iversen, and as the bride's father on the 1951 Larkfield marriage record. The double attestation is what carries the relationship to probable.",
      "His own birth, marriage, and death are unworked. No imported-tree dates are being substituted for records.",
    ],
    facts: [
      { label: "Townland", value: "Kilnaray" },
      { label: "Named on", value: "1929 baptism entry · 1951 marriage record" },
    ],
    openQuestions: ["Can any record establish Niall's own dates or his wife's name?"],
    sources: [
      "S000104 — Kilnaray parish baptism register entry",
      "S000105 — Larkfield civil marriage record, 1951",
    ],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report" },
    ],
  },
  {
    slug: "frank-holloway",
    name: "Frank Holloway",
    lifespan: "1926 – 2003",
    branch: "Holloway",
    lineSlug: "holloway",
    placeLine: "Larkfield",
    status: "probable",
    statusLabel: "Marriage documented · birth resting",
    parents: [],
    summary:
      "Frank Holloway married Rosa Iverson at Larkfield on 3 June 1951. The civil record of that marriage doubles as one of the two bridges supporting the Iversen/Iverson identity join.",
    narrative: [
      "The 1951 civil marriage record is the only original record yet reviewed for Frank. His own birth and parents have not been worked; the line is resting until a viable next record is identified.",
    ],
    facts: [
      { label: "Marriage", value: "3 June 1951, Larkfield, to Rosa Iverson" },
      { label: "Birth", value: "1926, locality not yet established" },
      { label: "Death", value: "2003" },
    ],
    openQuestions: ["Where was Frank born, and who were his parents?"],
    sources: ["S000105 — Larkfield civil marriage record, 1951"],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report" },
    ],
  },
  {
    slug: "alice-beckwith",
    name: "Alice Beckwith",
    lifespan: "1924 – 2009",
    branch: "Beckwith",
    lineSlug: "beckwith",
    placeLine: "Locality not yet established",
    status: "hypothesis",
    statusLabel: "Dates carried from the imported tree",
    parents: [],
    summary:
      "Alice Beckwith's dates come from the imported family tree and remain a hypothesis: no original record has been reviewed for this line yet.",
    narrative: [
      "The seed import carried Alice's 1924–2009 dates without a citation. The archive keeps them visible as a hypothesis rather than presenting them as fact, and the line waits for its first research cycle.",
    ],
    facts: [
      { label: "Birth", value: "1924 (imported, uncited)" },
      { label: "Death", value: "2009 (imported, uncited)" },
    ],
    openQuestions: ["What is the first viable record set for the Beckwith line?"],
    sources: ["Seed GEDCOM import (uncited)"],
  },
  {
    slug: "arthur-cardew",
    name: "Arthur Cardew",
    lifespan: "1919 – 1990",
    branch: "Cardew",
    lineSlug: "cardew",
    placeLine: "Locality not yet established",
    status: "hypothesis",
    statusLabel: "Dates carried from the imported tree",
    parents: [],
    summary:
      "Arthur Cardew's dates come from the imported family tree and remain a hypothesis: no original record has been reviewed for this line yet.",
    narrative: [
      "The seed import carried Arthur's 1919–1990 dates without a citation. The line is resting per the cycle charter until a viable next record is identified.",
    ],
    facts: [
      { label: "Birth", value: "1919 (imported, uncited)" },
      { label: "Death", value: "1990 (imported, uncited)" },
    ],
    openQuestions: ["What is the first viable record set for the Cardew line?"],
    sources: ["Seed GEDCOM import (uncited)"],
  },
  {
    slug: "maud-delmore",
    name: "Maud Delmore",
    lifespan: "1923 – 2001",
    branch: "Delmore",
    lineSlug: "delmore",
    placeLine: "Locality not yet established",
    status: "hypothesis",
    statusLabel: "Dates carried from the imported tree",
    parents: [],
    summary:
      "Maud Delmore's dates come from the imported family tree and remain a hypothesis: no original record has been reviewed for this line yet.",
    narrative: [
      "The seed import carried Maud's 1923–2001 dates without a citation. The line is resting per the cycle charter until a viable next record is identified.",
    ],
    facts: [
      { label: "Birth", value: "1923 (imported, uncited)" },
      { label: "Death", value: "2001 (imported, uncited)" },
    ],
    openQuestions: ["What is the first viable record set for the Delmore line?"],
    sources: ["Seed GEDCOM import (uncited)"],
  },
  {
    slug: "edith-grantham",
    name: "Edith Grantham",
    lifespan: "1920 – 1995",
    branch: "Grantham",
    lineSlug: "grantham",
    placeLine: "Locality not yet established",
    status: "hypothesis",
    statusLabel: "One negative search logged",
    parents: [],
    summary:
      "Edith Grantham's line has one honest result: a newspaper-index search that found nothing. The nil result is logged so the record set stays closed instead of being silently re-searched later.",
    narrative: [
      "The Cycle 1 research log records a Grantham newspaper-index search with a nil result. A negative search is a result — it closes a record set and keeps future cycles from repeating it.",
      "Edith's own dates remain a hypothesis from the imported tree.",
    ],
    facts: [
      { label: "Birth", value: "1920 (imported, uncited)" },
      { label: "Death", value: "1995 (imported, uncited)" },
      { label: "Newspaper index", value: "Searched — nil result, logged" },
    ],
    openQuestions: ["Which record set should the Grantham line try next?"],
    sources: ["Cycle 1 research log (negative search entry)"],
    records: [
      { label: "Read the Cycle 1 research report", href: "/library/all-lines-sample-cycle-1-report", note: "The attestation notes the logged negative search." },
    ],
  },
];

export function getPerson(slug: string) {
  return people.find((person) => person.slug === slug);
}
