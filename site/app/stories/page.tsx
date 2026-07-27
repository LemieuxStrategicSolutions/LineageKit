import { ClearButton, Confidence, Footer, Header, Kicker, PageIntro } from "../site-components";

export const metadata = { title: "Family Stories" };

const chapters = [
  {
    date: "1921",
    title: "Two Edmunds in one register",
    status: "confirmed" as const,
    label: "Duplicate resolved by evidence, not by merge",
    text: "The Stonebridge baptism register holds two boys named Edmund Ashford, baptized nine months apart in the same town. The imported tree had carried them as one floating duplicate. The register settled it: one Edmund's parents are Thomas Ashford and Margaret Quill — matching the seed exactly — and the other's are Henry Ashford and Jane Corbett. Same name, same year, same town, still two people. The archive recorded a second individual with a cousin hypothesis instead of merging, because same-name-same-date is not an identity.",
    links: [
      { label: "Read the full research notes", href: "/library/all-lines-sample-cycle-1-report" },
      { label: "View Edmund’s profile", href: "/people/edmund-ashford" },
    ],
  },
  {
    date: "1918 · 1989",
    title: "The birthplace that disagrees with itself",
    status: "conflicting" as const,
    label: "Two records in open conflict",
    text: "Harold Fenwick's civil birth certificate — made near the event — says he was born at Dunmore Cross. Seventy-one years later, his death record says Larkfield, on the word of a grandson who never knew Dunmore Cross. The archive holds both assertions, cross-linked as a conflict, and explains why the certificate outweighs the informant without erasing the disagreement. A baptism or school registration is the record that could break the tie.",
    links: [{ label: "Read Harold’s profile", href: "/people/harold-fenwick" }],
  },
  {
    date: "1912 · 1913",
    title: "The emigration that never happened",
    status: "disproved" as const,
    label: "A disproof recorded as a win",
    text: "Family memory said Thomas Ashford emigrated in 1912. The 1913 Stonebridge trade directory lists him still resident on Mill Lane — after the supposed departure. The hypothesis is disproved, and the archive treats that as progress: a closed question stops consuming future research cycles, and the memory itself is preserved as testimony about what the family believed.",
    links: [
      { label: "Read the disproof analysis", href: "/library/all-lines-sample-cycle-1-report" },
      { label: "View Thomas’s profile", href: "/people/thomas-ashford" },
    ],
  },
];

export default function StoriesPage() {
  return (
    <main>
      <Header />
      <PageIntro kicker="Documents become a human story" title="Family stories" deck="A duplicate that refused to merge, a birthplace that disagrees with itself, and an emigration that never happened. Every chapter below shows where evidence ends and interpretation begins." />
      <section className="story-chapters shell">
        {chapters.map((chapter, index) => (
          <article className="story-chapter" key={chapter.title}>
            <div className="story-number">0{index + 1}</div>
            <div className="story-copy">
              <Kicker>{chapter.date}</Kicker>
              <h2>{chapter.title}</h2>
              <Confidence level={chapter.status}>{chapter.label}</Confidence>
              <p>{chapter.text}</p>
              <div className="story-actions">
                {chapter.links.map((link) => <ClearButton key={link.label} href={link.href} secondary>{link.label}</ClearButton>)}
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="story-cta shell">
        <Kicker>Family knowledge still matters</Kicker>
        <h2>Does your family remember another part of this story?</h2>
        <p>A recollection can become a lead without being mistaken for proof. Share the memory, who told it, and any photograph or paper that traveled with it.</p>
        <ClearButton href="/contribute">Contribute to this story</ClearButton>
      </section>
      <Footer />
    </main>
  );
}
