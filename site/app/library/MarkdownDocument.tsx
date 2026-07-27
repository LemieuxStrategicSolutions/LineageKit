import type { ReactNode } from "react";
import { getSourceLink } from "./document-media";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|<https?:\/\/[^>]+>|https?:\/\/[^\s<]+)/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const code = part.match(/^`(.+)`$/);
    if (code) {
      const source = getSourceLink(code[1]);
      return source ? <a className="source-reference" key={index} href={source.url.split(/\s+;\s+/)[0]} title={source.title} target="_blank" rel="noreferrer">{code[1]} ↗</a> : <code key={index}>{code[1]}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]} ↗</a>;
    const angleLink = part.match(/^<(https?:\/\/[^>]+)>$/);
    if (angleLink) return <a key={index} href={angleLink[1]} target="_blank" rel="noreferrer">Open source ↗</a>;
    if (/^https?:\/\//.test(part)) {
      const href = part.replace(/[.,;:)]+$/, "");
      return <a key={index} href={href} target="_blank" rel="noreferrer">Open source ↗</a>;
    }
    return part;
  });
}

export function MarkdownDocument({ content }: { content: string }) {
  const lines = content.replace(/^#\s+.+\n+/, "").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push(<p key={`p-${blocks.length}`}>{inline(paragraph.join(" "))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(<Tag key={`l-${blocks.length}`}>{list.items.map((item) => <li key={item}>{inline(item)}</li>)}</Tag>);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(/^(##|###|####)\s+(.+)$/);
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    const quote = line.match(/^>\s*(.+)$/);
    if (!line) { flushParagraph(); flushList(); continue; }
    if (heading) {
      flushParagraph(); flushList();
      const Tag = heading[1].length === 2 ? "h2" : heading[1].length === 3 ? "h3" : "h4";
      blocks.push(<Tag key={`h-${blocks.length}`}>{inline(heading[2])}</Tag>);
    } else if (bullet || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (!list || list.ordered !== isOrdered) flushList();
      list ??= { ordered: isOrdered, items: [] };
      list.items.push((bullet ?? ordered)![1]);
    } else if (quote) {
      flushParagraph(); flushList();
      blocks.push(<blockquote key={`q-${blocks.length}`}>{inline(quote[1])}</blockquote>);
    } else if (/^---+$/.test(line)) {
      flushParagraph(); flushList(); blocks.push(<hr key={`hr-${blocks.length}`} />);
    } else {
      flushList(); paragraph.push(line);
    }
  }
  flushParagraph(); flushList();
  return <div className="markdown-document">{blocks}</div>;
}
