import { notFound } from "next/navigation";
import { ArchiveImage, ClearButton, Confidence, evidenceLabels, Footer, Header, Kicker } from "../../site-components";
import { AncestorJourneyMap } from "../AncestorJourneyMap";
import { getPerson, people } from "../people-data";

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();
  const journeyStops = person.placeLine.split("→").map((place) => place.trim()).filter(Boolean);
  const initials = person.name
    .split(/\s+/)
    .filter((word) => !["and", "of"].includes(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const archiveId = `${person.lineSlug.slice(0, 3).toUpperCase()}-${person.slug.replaceAll("-", "").slice(0, 8).toUpperCase()}`;

  return (
    <main>
      <Header />
      <article className="profile shell">
        <div className="profile-line-return"><ClearButton href={`/branches/${person.lineSlug}`} secondary>Back to this family line</ClearButton></div>
        <header className={`ancestor-passport line-${person.lineSlug}`}>
          <section className="passport-page passport-portrait-page">
            <div className="passport-book-title"><span className="passport-monogram">FA</span><p>Family Archive<br /><strong>Ancestor Passport</strong></p></div>
            {person.image ? (
              <figure className="passport-photo">
                <ArchiveImage src={person.image} alt={person.imageAlt ?? person.name} />
                <figcaption>{person.imageCaption}</figcaption>
              </figure>
            ) : (
              <div className="passport-photo passport-no-photo">
                <strong>{initials}</strong>
                <span>No verified portrait has been identified</span>
              </div>
            )}
            <div className="passport-seal" aria-hidden="true"><span>{person.lineSlug}</span><strong>Family<br />Archive</strong></div>
            <p className="passport-disclaimer">A narrative identity page built from family evidence. Not an official government document.</p>
          </section>
          <section className="passport-page passport-identity-page">
            <div className="passport-classification"><span>Direct ancestry archive</span><strong>{archiveId}</strong></div>
            <Kicker>{person.branch}</Kicker>
            <h1>{person.name}</h1>
            {person.alternateNames && <p className="alternate-names">{person.alternateNames}</p>}
            <dl className="passport-fields">
              <div><dt>Life</dt><dd>{person.lifespan}</dd></div>
              <div><dt>Family line</dt><dd>{person.branch}</dd></div>
              <div className="passport-field-wide"><dt>Journey recorded so far</dt><dd>{person.placeLine}</dd></div>
              <div><dt>Evidence status</dt><dd>{person.statusLabel}</dd></div>
              <div><dt>Archive ID</dt><dd>{archiveId}</dd></div>
            </dl>
            <Confidence level={person.status}>{person.statusLabel}</Confidence>
            <div className="profile-actions" aria-label={`Explore ${person.name}`}>
              <a className="profile-story-link" href="#story">Read their story <span aria-hidden="true">↓</span></a>
              <a className="profile-evidence-link" href="#evidence">How we know this <span aria-hidden="true">↓</span></a>
            </div>
            <div className="passport-machine-line" aria-hidden="true">{`FAM<${person.lineSlug.toUpperCase()}<${person.slug.toUpperCase().replaceAll("-", "<")}`}</div>
          </section>
        </header>
        <section className="profile-lead"><p>{person.summary}</p></section>
        <section className="profile-journey" aria-labelledby="journey-title">
          <div className="profile-journey-heading">
            <Kicker>Journey through the record</Kicker>
            <h2 id="journey-title">The places that carry the story</h2>
            <p>These are documented or carefully qualified places associated with this life. They are not guesses added for atmosphere.</p>
          </div>
          <AncestorJourneyMap places={journeyStops} personName={person.name} />
        </section>
        <section className="profile-parents">
          <div className="profile-parents-heading">
            <Kicker>Move one generation back</Kicker>
            <h2>Direct parents</h2>
            <p>These cards stay inside the same ancestral line. Open a named parent to continue backward.</p>
          </div>
          <div className={`parent-grid parents-${person.parents?.length ?? 0}`}>
            {person.parents?.length ? person.parents.map((parent) => {
              const content = <><h3>{parent.name}</h3><p>{parent.detail}</p><Confidence level={parent.status}>{evidenceLabels[parent.status]}</Confidence>{parent.slug && <span className="tree-open">Open this parent →</span>}</>;
              return parent.slug
                ? <a className="parent-card clickable" href={`/people/${parent.slug}`} key={parent.name}>{content}</a>
                : <article className="parent-card" key={parent.name}>{content}</article>;
            }) : <article className="parent-card open-parent"><h3>Parents not yet identified</h3><p>The direct line currently stops here. No imported-tree guess is being substituted for proof.</p><Confidence level="open">Open research</Confidence></article>}
          </div>
        </section>
        <div className="profile-columns" id="story">
          <section className="profile-story"><Kicker>Their story</Kicker><h2>What the surviving record lets us tell</h2>{person.narrative.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <aside className="profile-facts"><Kicker>At a glance</Kicker><dl>{person.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></aside>
        </div>
        {person.gallery?.length && <section className="profile-gallery">
          <header><Kicker>Family photo archive</Kicker><h2>{person.galleryTitle ?? "Family photographs"}</h2>{person.galleryDescription && <p>{person.galleryDescription}</p>}</header>
          <div className="profile-gallery-grid">{person.gallery.map((photo) => <figure key={photo.src}><ArchiveImage src={photo.src} alt={photo.alt} /><figcaption>{photo.caption}</figcaption></figure>)}</div>
        </section>}
        <section className="profile-evidence" id="evidence">
          <div><Kicker>How we know this</Kicker><h2>Research and sources</h2><p className="evidence-intro">The story above is built from these records and assessments. Open the technical research for citations, contradictions, corrections, and unresolved evidence.</p><ul>{person.sources.map((source) => <li key={source}>{source}</li>)}</ul>{person.records?.length ? <div className="profile-record-links" aria-label={`Record links for ${person.name}`}>{person.records.map((record) => <div key={record.href}><ClearButton href={record.href} external={record.href.startsWith("http")}>{record.label}</ClearButton>{record.note && <p>{record.note}</p>}</div>)}</div> : person.originalRecord && <ClearButton href={person.originalRecord.href} external>{person.originalRecord.label}</ClearButton>}<ClearButton href={`/branches/${person.lineSlug}#research`} secondary={Boolean(person.records?.length || person.originalRecord)}>Open technical research</ClearButton></div>
          <div><Kicker>Questions still open</Kicker><ul>{person.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul><ClearButton href="/contribute" secondary>Contribute information</ClearButton></div>
        </section>
      </article>
      <Footer />
    </main>
  );
}
