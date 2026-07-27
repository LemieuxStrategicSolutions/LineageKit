// Synthetic example data. Every person, place, and record is invented — see
// examples/README.md at the repository root for the family this describes.

export const lineOrder = ["ashford", "beckwith", "cardew", "delmore", "fenwick", "grantham", "holloway", "iverson"] as const;

export type TimelineLine = (typeof lineOrder)[number];

export const lineLabels: Record<TimelineLine, string> = {
  ashford: "Ashford",
  beckwith: "Beckwith",
  cardew: "Cardew",
  delmore: "Delmore",
  fenwick: "Fenwick",
  grantham: "Grantham",
  holloway: "Holloway",
  iverson: "Iverson",
};

export type TimelineEvidence = "confirmed" | "probable" | "hypothesis" | "conflicting" | "disproved";

export const evidenceLabels: Record<TimelineEvidence, string> = {
  confirmed: "Documented event",
  probable: "Evidence-led event",
  hypothesis: "Hypothesis",
  conflicting: "Conflicting evidence",
  disproved: "Disproved claim",
};

export type TimelineEvent = {
  id: string;
  sortDate: string;
  displayDate: string;
  title: string;
  place: string;
  summary: string;
  lines: TimelineLine[];
  href: string;
  linkLabel: string;
  evidence: TimelineEvidence;
  landmark?: boolean;
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: "ashford-quill-marriage-hypothesis",
    sortDate: "1913-01-01",
    displayDate: "before 1921",
    title: "Thomas Ashford and Margaret Quill marry",
    place: "Locality not yet established",
    summary: "The marriage must predate Edmund's 1921 baptism, but no record has been located. It is the leading Cycle 2 target because the entry may name both earlier generations.",
    lines: ["ashford"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read the next-question queue",
    evidence: "hypothesis",
    landmark: true,
  },
  {
    id: "ashford-emigration-disproved-1913",
    sortDate: "1913-06-01",
    displayDate: "1913",
    title: "The 1912 emigration story is disproved",
    place: "Mill Lane, Stonebridge",
    summary: "The family story said Thomas Ashford emigrated in 1912. The 1913 Stonebridge trade directory lists him still resident on Mill Lane — the hypothesis is disproved, and the disproof is logged as a win.",
    lines: ["ashford"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read the disproof analysis",
    evidence: "disproved",
    landmark: true,
  },
  {
    id: "fenwick-birth-1918",
    sortDate: "1918-06-23",
    displayDate: "23 June 1918",
    title: "Harold Fenwick is born",
    place: "Dunmore Cross — disputed by his death record, which claims Larkfield",
    summary: "The civil birth certificate says Dunmore Cross; the 1989 death record, reported by a grandson, says Larkfield. Both assertions stand cross-linked as a conflict until a third record breaks the tie.",
    lines: ["fenwick"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read the conflict analysis",
    evidence: "conflicting",
    landmark: true,
  },
  {
    id: "ashford-second-edmund-baptism-1921",
    sortDate: "1921-02-14",
    displayDate: "14 February 1921",
    title: "A second Edmund Ashford is baptized",
    place: "Stonebridge",
    summary: "Same name, same year, same town — different parents (Henry Ashford and Jane Corbett). Recorded as a separate person with a cousin hypothesis, not merged. Same name plus same date is still not an identity.",
    lines: ["ashford"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read the duplicate resolution",
    evidence: "confirmed",
  },
  {
    id: "ashford-edmund-baptism-1921",
    sortDate: "1921-11-09",
    displayDate: "9 November 1921",
    title: "Edmund Ashford is baptized",
    place: "Stonebridge",
    summary: "The original register image names his parents as Thomas Ashford and Margaret Quill — matching the seed exactly — and promotes his birth from hypothesis to confirmed.",
    lines: ["ashford"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read the promote verdict",
    evidence: "confirmed",
    landmark: true,
  },
  {
    id: "iverson-roisin-baptism-1929",
    sortDate: "1929-12-20",
    displayDate: "20 December 1929",
    title: "Róisín Iversen is baptized in Kilnaray",
    place: "Kilnaray",
    summary: "The parish register names her father Niall Iversen. Decades later this entry joins to Rosa Iverson on two independent bridges: her father's name and her townland on the 1951 marriage record.",
    lines: ["iverson"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read the name-variant join",
    evidence: "probable",
    landmark: true,
  },
  {
    id: "holloway-iverson-marriage-1951",
    sortDate: "1951-06-03",
    displayDate: "3 June 1951",
    title: "Frank Holloway and Rosa Iverson marry",
    place: "Larkfield",
    summary: "The civil marriage record names the bride's father as Niall — the second, independent bridge that justified joining the Iversen and Iverson records.",
    lines: ["holloway", "iverson"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Open the bridge-record analysis",
    evidence: "confirmed",
    landmark: true,
  },
  {
    id: "fenwick-death-1989",
    sortDate: "1989-09-19",
    displayDate: "19 September 1989",
    title: "Harold Fenwick dies at Larkfield",
    place: "Larkfield",
    summary: "The death record is secure for the death itself — and is also the source of the conflicting Larkfield birthplace claim, supplied by a grandson informant who never knew Dunmore Cross.",
    lines: ["fenwick"],
    href: "/library/all-lines-sample-cycle-1-report",
    linkLabel: "Read why the certificate outweighs the informant",
    evidence: "confirmed",
    landmark: true,
  },
];
