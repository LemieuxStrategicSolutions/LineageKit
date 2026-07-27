import Link from "next/link";
import { Footer, Header, Kicker, PageIntro } from "../site-components";
import { familyLines } from "../branches/branch-data";

export const metadata = { title: "Choose a Family Line" };

export default function PeoplePage() {
  return (
    <main>
      <Header />
      <PageIntro
        kicker="Ancestors by family line"
        title="Choose a line first"
        deck="There is intentionally no blended list of every person. Choose one of the eight grandparent lines, then move from that ancestor to their parents and grandparents."
      />
      <section className="family-lines-grid compact shell" aria-label="Choose a family line">
        {familyLines.map((line, index) => (
          <Link className="family-line-card" href={`/branches/${line.slug}`} key={line.slug}>
            <span className="family-line-number">0{index + 1}</span>
            <Kicker>{line.state}</Kicker>
            <h2>{line.name}</h2>
            <p className="family-line-card-subtitle">{line.subtitle}</p>
            <span className="route-link">Open this family line <span>→</span></span>
          </Link>
        ))}
      </section>
      <Footer />
    </main>
  );
}
