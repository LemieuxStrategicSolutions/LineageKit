import Link from "next/link";
import { ClearButton, Confidence, Footer, Header, Kicker, RouteCard } from "./site-components";
import { TimelineExplorer } from "./timeline/TimelineExplorer";

export const metadata = {
  title: "The Family Archive",
  description: "A documented family archive. Synthetic example data: every person, place, and record is invented.",
};

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero shell">
        <div className="hero-copy">
          <Kicker>Family archive · work in progress</Kicker>
          <h1>A family<br />archive</h1>
          <p className="hero-deck">
            Meet the people, follow their journeys, and hear the family story as it can now be told.
            Every chapter remains connected to the records and research that support it — and every claim
            keeps its evidence label: confirmed, probable, hypothesis, conflicting, or disproved.
          </p>
          <div className="hero-actions">
            <ClearButton href="/timeline">Explore the family timeline</ClearButton>
            <ClearButton href="/branches">Choose a family line</ClearButton>
            <ClearButton href="/library" secondary>Open all research</ClearButton>
          </div>
        </div>
        <div className="hero-archive" aria-label="Selected documents from the family archive">
          <div className="paper paper-back"><img className="archive-image" src="/placeholder-record.svg" alt="Placeholder for an archival record image" /></div>
          <div className="paper paper-front"><img className="archive-image" src="/placeholder-record.svg" alt="Placeholder for a family photograph" /></div>
          <p className="caption-tag">This example archive ships with placeholder images. Your real archive replaces them with reviewed record scans.</p>
        </div>
      </section>

      <section className="statement shell">
        <Kicker>What the evidence now says</Kicker>
        <div className="statement-grid">
          <h2>Two names.<br />One life.</h2>
          <div>
            <p className="lead">The strongest identity finding is that <strong>Róisín Iversen of the Kilnaray register and Rosa Iverson were the same woman.</strong></p>
            <p>The proof is not a name guess. Her 1951 marriage record independently names the same father and the same townland as the baptism entry — two bridges, so the join holds.</p>
            <Confidence level="probable">Two-bridge identity join</Confidence>
          </div>
        </div>
      </section>

      <section className="routes shell">
        <RouteCard eyebrow="Eight starting branches" title="Family lines" text="Choose one grandparent surname line, then follow only its direct parents generation by generation." href="/branches" image="/placeholder-record.svg" />
        <RouteCard eyebrow="Narrative history" title="Family stories" text="Follow the human stories the records reveal — including the duplicate that was not merged and the birthplace that disagrees with itself." href="/stories" image="/placeholder-record.svg" />
        <RouteCard eyebrow="Complete research notes" title="Research library" text="Read the complete public research record — including negative searches, competing evidence, disproofs, and open questions." href="/library" image="/placeholder-record.svg" />
      </section>

      <section className="branch-preview shell">
        <div className="branch-preview-heading">
          <div><Kicker>Beyond the first exhibit</Kicker><h2>A growing archive of ancestral branches</h2></div>
          <Link className="button text-button" href="/branches">View all branches <span>→</span></Link>
        </div>
        <div className="branch-preview-grid">
          <Link href="/branches/ashford"><span>First root · paternal grandfather</span><h3>Ashford</h3><p>Edmund Ashford → Thomas Ashford and Margaret Quill → Stonebridge.</p></Link>
          <Link href="/branches/beckwith"><span>First root · paternal grandmother</span><h3>Beckwith</h3><p>Alice Beckwith → parents not yet identified.</p></Link>
          <Link href="/branches/cardew"><span>First root · maternal grandfather</span><h3>Cardew</h3><p>Arthur Cardew → parents not yet identified.</p></Link>
          <Link href="/branches/delmore"><span>First root · maternal grandmother</span><h3>Delmore</h3><p>Maud Delmore → parents not yet identified.</p></Link>
          <Link href="/branches/fenwick"><span>Second root · paternal grandfather</span><h3>Fenwick</h3><p>Harold Fenwick → birthplace in open conflict → Dunmore Cross or Larkfield.</p></Link>
          <Link href="/branches/grantham"><span>Second root · paternal grandmother</span><h3>Grantham</h3><p>Edith Grantham → one negative search logged.</p></Link>
          <Link href="/branches/holloway"><span>Second root · maternal grandfather</span><h3>Holloway</h3><p>Frank Holloway → 1951 marriage documented at Larkfield.</p></Link>
          <Link href="/branches/iverson"><span>Second root · maternal grandmother</span><h3>Iverson</h3><p>Rosa Iverson → baptized Róisín Iversen → father Niall Iversen → Kilnaray.</p></Link>
        </div>
      </section>

      <section className="timeline-section consolidated-home-timeline">
        <div className="shell">
          <div className="timeline-feature-heading"><div><Kicker>The archive’s central chronology</Kicker><h2 className="section-title">Eight lines.<br />One shared timeline.</h2><p>Choose any surname to show only that family’s events. Every event opens the research behind it.</p></div><ClearButton href="/timeline">Open the complete timeline</ClearButton></div>
          <TimelineExplorer compact />
        </div>
      </section>

      <section className="principles shell">
        <div>
          <Kicker>How to read this archive</Kicker>
          <h2>The story in front.<br />The evidence underneath.</h2>
        </div>
        <div className="principle-list">
          <p><span className="number">01</span><strong>Begin with the person.</strong> Ancestor pages tell the human story in clear language, with places, family connections, and surviving records.</p>
          <p><span className="number">02</span><strong>Follow how we know.</strong> Every important chapter leads back to the original records, source notes, and research analysis.</p>
          <p><span className="number">03</span><strong>Never fill the silence with fiction.</strong> Uncertainty stays visible. A hypothesis stays labeled a hypothesis, a conflict stays labeled a conflict, and a disproof is recorded as a win.</p>
          <p><span className="number">04</span><strong>Living people stay private.</strong> The generation connecting these lines to the present is represented without names, dates, or photographs.</p>
        </div>
      </section>
      <section className="contribution-banner">
        <div className="shell"><div><Kicker>Help build the archive</Kicker><h2>Have a photograph, correction, or story?</h2><p>Contributions are saved privately and reviewed before anything becomes public.</p></div><ClearButton href="/contribute">Contribute to the archive</ClearButton></div>
      </section>
      <Footer />
    </main>
  );
}
