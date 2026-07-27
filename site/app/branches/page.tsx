import Link from "next/link";
import { Footer, Header, Kicker, PageIntro } from "../site-components";
import { familyLines } from "./branch-data";

export const metadata = { title: "Choose a Family Line" };

export default function BranchesPage() {
  return (
    <main>
      <Header />
      <PageIntro
        kicker="Eight separate starting lines"
        title="Choose a family line"
        deck="Each line begins with one deceased grandparent of the archive's two living roots. Open one surname line to see only that ancestor, their parents, and the parents before them."
      />
      <section className="line-rule shell">
        <Kicker>How this is organized</Kicker>
        <p><strong>One line at a time.</strong> Ashford, Beckwith, Cardew, Delmore, Fenwick, Grantham, Holloway, and Iverson each have their own path. Marriage connects two people; it does not merge their upstream ancestors into one group.</p>
      </section>
      <section className="line-rule shell">
        <Kicker>The unnamed connecting generation</Kicker>
        <p><strong>Their children · living.</strong> The generation between these grandparents and the present is intentionally represented without names, dates, or photographs. Where a living person connects two published people, the archive says only that the connection exists.</p>
      </section>
      <section className="family-lines-grid shell" aria-label="Family lines">
        {familyLines.map((line, index) => (
          <Link className="family-line-card" href={`/branches/${line.slug}`} key={line.slug}>
            <span className="family-line-number">0{index + 1}</span>
            <Kicker>{line.relationship}</Kicker>
            <h2>{line.name}</h2>
            <p className="family-line-card-subtitle">{line.subtitle}</p>
            <p className="family-line-card-place">{line.geography}</p>
            <span className="route-link">Open this family line <span>→</span></span>
          </Link>
        ))}
      </section>
      <section className="privacy-principle shell">
        <Kicker>Public-edition rule</Kicker>
        <h2>The deceased tree can grow here.<br />Living-family privacy stays intact.</h2>
        <p>Living relatives are not profiled with dates, contact information, or private family-tree details. The archive starts at the deceased grandparent generation and moves backward.</p>
      </section>
      <Footer />
    </main>
  );
}
