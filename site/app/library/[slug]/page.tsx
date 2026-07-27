import { notFound } from "next/navigation";
import { ArchiveImage, ClearButton, Footer, Header, Kicker } from "../../site-components";
import { getDocumentImages, getDocumentLinks } from "../document-media";
import { librarySectionTitle } from "../library-sections";
import { MarkdownDocument } from "../MarkdownDocument";
import documents from "../research-documents.json";

export function generateStaticParams() {
  return documents.map((document) => ({ slug: document.slug }));
}

export default async function ResearchDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = documents.find((item) => item.slug === slug);
  if (!document) notFound();
  const images = getDocumentImages(document.slug);
  const links = getDocumentLinks(document.content);
  const sectionTitle = librarySectionTitle(document.category);

  return (
    <main>
      <Header />
      <article className="research-document shell">
        <header>
          <Kicker>{sectionTitle} · {document.branch}</Kicker>
          <h1>{document.title}</h1>
          <p>This is the complete public research note. It may contain unresolved hypotheses, negative searches, and next steps because the archive exposes the reasoning as well as the answer.</p>
          <ClearButton href="/library" secondary>Back to research library</ClearButton>
        </header>
        {(images.length > 0 || links.length > 0) && <section className="record-access">
          <div className="record-access-heading"><Kicker>Original material</Kicker><h2>See the records behind the research</h2><p>Photographs and document images open at full size. Source buttons open the live repository record whenever one is available.</p></div>
          {images.length > 0 && <div className={`record-media-grid media-${Math.min(images.length, 4)}`}>
            {images.map((image) => <figure key={image.src}><a href={image.sourceHref ?? image.src} target="_blank" rel="noreferrer"><ArchiveImage src={image.src} alt={image.alt} /><span>Open {image.sourceHref ? "source record" : "full image"} ↗</span></a><figcaption>{image.caption}</figcaption></figure>)}
          </div>}
          {links.length > 0 && <div className="record-source-links"><h3>Live source links</h3><ul>{links.slice(0, 10).map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><strong>Open source ↗</strong></a></li>)}</ul>{links.length > 10 && <p>{links.length - 10} additional source links are clickable in the research note below.</p>}</div>}
        </section>}
        <MarkdownDocument content={document.content} />
      </article>
      <Footer />
    </main>
  );
}
