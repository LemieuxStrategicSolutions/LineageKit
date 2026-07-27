import Link from "next/link";
import type { ReactNode } from "react";
import { PrimaryNav } from "./PrimaryNav";

export type EvidenceLevel = "confirmed" | "probable" | "hypothesis" | "conflicting" | "disproved" | "open";

export const evidenceLabels: Record<EvidenceLevel, string> = {
  confirmed: "Confirmed",
  probable: "Probable",
  hypothesis: "Hypothesis",
  conflicting: "Conflicting evidence",
  disproved: "Disproved",
  open: "Open research",
};

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">FA</span>
          <span>The Family<br />Archive</span>
        </Link>
        <PrimaryNav />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">FA</span><span>The Family<br />Archive</span></div>
          <p>Preserving family voices while the documentary record grows. Every person, place, and record on this example site is invented.</p>
        </div>
        <div className="footer-note">
          <p><strong>Living-family privacy:</strong> this public edition intentionally excludes private details about living relatives. The generation connecting the published lines is represented without names.</p>
          <p>Built with LineageKit.</p>
          <Link className="footer-contribute" href="/contribute">Share a correction, story, or photograph →</Link>
        </div>
      </div>
    </footer>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

export function Confidence({ level, children }: { level: EvidenceLevel; children: ReactNode }) {
  return <span className={`confidence ${level}`}><span aria-hidden="true" />{children}</span>;
}

export function ArchiveImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img className={`archive-image ${className}`} src={src} alt={alt} loading="lazy" />;
}

export function ClearButton({ href, children, secondary = false, external = false }: { href: string; children: ReactNode; secondary?: boolean; external?: boolean }) {
  const className = `button ${secondary ? "secondary" : "primary"}`;
  if (external) return <a className={className} href={href} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a>;
  return <Link className={className} href={href}>{children} <span aria-hidden="true">→</span></Link>;
}

export function RouteCard({ eyebrow, title, text, href, image }: { eyebrow: string; title: string; text: string; href: string; image: string }) {
  return (
    <Link className="route-card" href={href}>
      <div className="route-image"><ArchiveImage src={image} alt="" /></div>
      <div className="route-body">
        <Kicker>{eyebrow}</Kicker>
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="route-link">Open this section <span>→</span></span>
      </div>
    </Link>
  );
}

export function PageIntro({ kicker, title, deck }: { kicker: string; title: string; deck: string }) {
  return (
    <section className="page-intro shell">
      <Kicker>{kicker}</Kicker>
      <h1>{title}</h1>
      <p>{deck}</p>
    </section>
  );
}
