import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearButton, Confidence, evidenceLabels, Footer, Header, Kicker } from "../../site-components";
import { familyLines, getFamilyLine } from "../branch-data";
import documents from "../../library/research-documents.json";

export function generateStaticParams() {
  return familyLines.map((line) => ({ slug: line.slug }));
}

export default async function FamilyLinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const line = getFamilyLine(slug);
  if (!line) notFound();
  const lineDocuments = documents.filter((document) =>
    line.researchTerms.some((term) =>
      document.branch.toLowerCase().includes(term.toLowerCase()) ||
      document.title.toLowerCase().includes(term.toLowerCase()) ||
      document.content.toLowerCase().includes(term.toLowerCase())));

  return (
    <main>
      <Header />
      <article className="family-line shell">
        <header className="family-line-header">
          <Kicker>{line.relationship}</Kicker>
          <h1>{line.name}</h1>
          <p className="family-line-subtitle">{line.subtitle}</p>
          <p>{line.summary}</p>
          <div className="family-line-actions"><ClearButton href="#direct-line">Begin this family story</ClearButton><ClearButton href="#research" secondary>Open technical research</ClearButton><ClearButton href="/branches" secondary>Choose a different family line</ClearButton></div>
        </header>

        <section className="ancestry-path" id="direct-line" aria-label={`${line.name} direct ancestry`}>
          {line.generations.map((generation, index) => (
            <div className="generation" key={generation.label}>
              {index > 0 && <div className="generation-arrow" aria-hidden="true">↑ parents of the generation below</div>}
              <div className="generation-heading"><span>Generation {index + 1}</span><h2>{generation.label}</h2><p>{generation.explanation}</p></div>
              <div className={`generation-people people-${generation.people.length}`}>
                {generation.people.map((person) => {
                  const content = <><h3>{person.name}</h3><p>{person.detail}</p><Confidence level={person.status}>{evidenceLabels[person.status]}</Confidence>{person.personSlug && <span className="tree-open">Open person and parents →</span>}</>;
                  return person.personSlug ? <Link className="tree-person clickable" href={`/people/${person.personSlug}`} key={person.name}>{content}</Link> : <article className="tree-person" key={person.name}>{content}</article>;
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="line-research" id="research">
          <header>
            <Kicker>The technical layer</Kicker>
            <h2>Research and sources</h2>
            <p>These are the complete public-safe working notes, including contradictions, negative searches, and unresolved questions — not just the conclusions shown in the tree.</p>
          </header>
          {lineDocuments.length ? <div className="line-research-grid">{lineDocuments.map((document) => <Link className="line-research-card" href={`/library/${document.slug}`} key={document.slug}><span>{document.category}</span><h3>{document.title}</h3><strong>Read full research →</strong></Link>)}</div> : <div className="line-research-empty"><h3>Evidence audit in progress</h3><p>The line is established as a research lane, but no complete public-safe note has been released yet. New findings will be published here as their evidence is checked.</p></div>}
        </section>
      </article>
      <Footer />
    </main>
  );
}
