import sourceLinks from "./source-links.json";

export type DocumentImage = {
  src: string;
  alt: string;
  caption: string;
  sourceHref?: string;
};

export type SourceLink = { title: string; url: string };

// Map library-document slugs to the reviewed record images that accompany
// them. The example archive ships without record scans, so this starts empty;
// a real archive adds entries as images clear the redaction review.
const mediaBySlug: Record<string, DocumentImage[]> = {};

const sourceLinkMap = sourceLinks as Record<string, SourceLink>;

export function getDocumentImages(slug: string) {
  return mediaBySlug[slug] ?? [];
}

export function getDocumentLinks(content: string) {
  const links: Array<{ label: string; href: string }> = [];
  const seen = new Set<string>();
  const add = (label: string, href: string) => {
    const cleanHref = href.replace(/[.,;:)]+$/, "");
    if (!cleanHref.startsWith("http") || seen.has(cleanHref)) return;
    seen.add(cleanHref);
    links.push({ label, href: cleanHref });
  };

  for (const line of content.split("\n")) {
    const lineLabel = line.replace(/^[-*]\s+/, "").split(":")[0].replace(/[*`]/g, "").trim();
    for (const match of line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) add(match[1], match[2]);
    for (const match of line.matchAll(/<(https?:\/\/[^>]+)>/g)) add(lineLabel || "Open original source", match[1]);
    for (const match of line.matchAll(/(?<![<(])(https?:\/\/[^\s<>]+)/g)) add(lineLabel || "Open original source", match[1]);
  }

  for (const sourceId of new Set(content.match(/S\d{6}/g) ?? [])) {
    const source = sourceLinkMap[sourceId];
    if (source) add(`${sourceId} · ${source.title}`, source.url.split(/\s+;\s+/)[0]);
  }
  return links;
}

export function getSourceLink(sourceId: string) {
  return sourceLinkMap[sourceId];
}
