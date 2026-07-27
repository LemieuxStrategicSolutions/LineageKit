import { Confidence, Footer, Header, Kicker, PageIntro } from "../site-components";

export const metadata = { title: "Research Ledger" };

const active = [
  { status: "Ashford", title: "Thomas and Margaret's marriage record", text: "Edmund's baptism is confirmed on the original image. The marriage of Thomas Ashford and Margaret Quill is the Cycle 2 candidate because it may name both earlier generations." },
  { status: "Fenwick", title: "A third record to break the birthplace tie", text: "The birth certificate says Dunmore Cross; the death record says Larkfield. A baptism or school registration is the tie-breaking target." },
  { status: "Iverson", title: "The civil birth entry for Róisín Iversen", text: "The parish baptism and the 1951 marriage bridge carry the identity join, but the birth stays probable until the civil entry is obtained." },
  { status: "Holloway", title: "Frank's own birth and parents", text: "The 1951 marriage record is documented; nothing above Frank has been worked. The line rests until a viable record set is identified." },
  { status: "Grantham", title: "A next record set after the nil result", text: "The newspaper index came back empty and the negative search is logged. The question is which record set to try next, not whether to re-run the same one." },
  { status: "Beckwith · Cardew · Delmore", title: "First viable record sets", text: "Three resting lines carried entirely on uncited imported-tree dates. Each needs its first original record before anything can be promoted past hypothesis." },
];

export default function ResearchPage() {
  return (
    <main>
      <Header />
      <PageIntro kicker="Transparent genealogy" title="The research ledger" deck="A public account of what supports the story, what is still uncertain, and exactly which record could change the conclusion." />

      <section className="status-board shell">
        <div className="status-header"><Kicker>Highest-value searches</Kicker><h2>What we are pursuing now</h2></div>
        <div className="status-list">
          {active.map((item, index) => (
            <article key={item.title}>
              <span className="status-number">{String(index + 1).padStart(2, "0")}</span>
              <div><span className="status-label">{item.status}</span><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="method shell">
        <div><Kicker>Research standard</Kicker><h2>No forced certainty</h2></div>
        <div className="method-grid">
          <article><Confidence level="confirmed">Confirmed</Confidence><h3>Converging original evidence</h3><p>Multiple independent records agree, or one original record directly resolves the identity.</p></article>
          <article><Confidence level="probable">Probable</Confidence><h3>The best current explanation</h3><p>The evidence strongly favors the claim, but a reasonable alternative or missing original remains.</p></article>
          <article><Confidence level="hypothesis">Hypothesis</Confidence><h3>A question, not a fact</h3><p>The clue is preserved for testing without being promoted into the family tree as settled ancestry.</p></article>
          <article><Confidence level="conflicting">Conflicting</Confidence><h3>Records that disagree</h3><p>Two or more assertions stand cross-linked. The disagreement stays visible until a further record breaks the tie.</p></article>
          <article><Confidence level="disproved">Disproved</Confidence><h3>A closed question is a win</h3><p>The claim was tested against a record and failed. The disproof is preserved so the search never repeats.</p></article>
          <article><Confidence level="open">Open</Confidence><h3>Not yet searched</h3><p>No viable record set has been identified. The archive says so plainly rather than filling the gap.</p></article>
        </div>
      </section>

      <section className="corrections shell">
        <Kicker>Important guardrails</Kicker>
        <h2>Claims we are not making</h2>
        <div className="correction-grid">
          <article><span>×</span><h3>The two Edmunds are not one person.</h3><p>Same name, same year, same town — but the parish register shows different parents. They are recorded as separate people, with a cousin relationship held as a hypothesis.</p></article>
          <article><span>×</span><h3>Harold's birthplace is not settled.</h3><p>The certificate favors Dunmore Cross, but the Larkfield claim on his death record has not been disproved — only outweighed. Both remain on the record.</p></article>
          <article><span>×</span><h3>The imported dates are not facts.</h3><p>Every uncited date carried in from the original family-tree export stays labeled a hypothesis until an original record supports it.</p></article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
