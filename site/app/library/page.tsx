import Link from "next/link";
import { Footer, Header, Kicker, PageIntro } from "../site-components";
import { librarySections } from "./library-sections";
import documents from "./research-documents.json";

export const metadata = { title: "Research Library" };

export default function LibraryPage() {
  return (
    <main>
      <Header />
      <PageIntro kicker="The evidence, not just the conclusion" title="Research library" deck={`${documents.length} public-safe research notes. Open any item to read the full research — not a teaser. Only documents listed in the redaction manifest are published here.`} />
      <section className="library-notice shell">
        <Kicker>What “all research” means here</Kicker>
        <p>This library exposes the genealogy work that can responsibly be public. Administrative request drafts, private contact details, credentials, and detailed information about living people are excluded. Uncertainty and negative searches remain visible.</p>
      </section>
      <section className="library shell" aria-label="Research library sections">
        {librarySections.map((section) => {
          const sectionDocuments = documents.filter((document) => section.categories.some((category) => category === document.category));
          if (!sectionDocuments.length) return null;
          return <details className="library-section" key={section.title}>
            <summary><span>{section.title}</span><small>{sectionDocuments.length} {sectionDocuments.length === 1 ? "item" : "items"}</small><span className="library-expander" aria-hidden="true">+</span></summary>
            <ul className="library-list">
              {sectionDocuments.map((document) => (
                <li key={document.slug}>
                  <Link href={`/library/${document.slug}`}>
                    <span>{document.branch}</span>
                    <strong>{document.title}</strong>
                    <span className="library-open" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>;
        })}
      </section>
      <Footer />
    </main>
  );
}
