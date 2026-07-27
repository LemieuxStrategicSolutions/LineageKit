import { Footer, Header, Kicker, PageIntro } from "../site-components";
import { ContributionForm } from "./ContributionForm";

export const metadata = { title: "Contribute" };

export default function ContributePage() {
  return (
    <main>
      <Header />
      <PageIntro kicker="Help the record grow" title="Contribute to the archive" deck="Family knowledge can survive only if someone shares it. Send a correction, a story, names and dates, a photograph, a letter, or a lead to an original record." />
      <section className="contribute-layout shell">
        <div className="contribute-guidance">
          <Kicker>What helps most</Kicker>
          <h2>Context is as valuable as the image.</h2>
          <ol>
            <li><strong>Name the people</strong> from left to right when you can.</li>
            <li><strong>Say who identified them</strong> and whether that person knew them.</li>
            <li><strong>Photograph the back</strong> of every picture or document too.</li>
            <li><strong>Keep uncertainty visible.</strong> “I think” is useful information.</li>
          </ol>
          <div className="review-policy"><strong>Private review first.</strong><p>Nothing submitted through this form appears publicly on its own. A researcher reviews the information, checks privacy and attribution, and decides whether it belongs in the public archive.</p></div>
        </div>
        <ContributionForm />
      </section>
      <Footer />
    </main>
  );
}
