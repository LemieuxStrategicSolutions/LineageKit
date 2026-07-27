import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exposes the archive through clear, linked routes", async () => {
  const [header, primaryNav, home, branches, people, stories, library, contribute, timelinePage, timelineClient, timelineData] = await Promise.all([
    readFile(new URL("app/site-components.tsx", root), "utf8"),
    readFile(new URL("app/PrimaryNav.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/branches/page.tsx", root), "utf8"),
    readFile(new URL("app/people/page.tsx", root), "utf8"),
    readFile(new URL("app/stories/page.tsx", root), "utf8"),
    readFile(new URL("app/library/page.tsx", root), "utf8"),
    readFile(new URL("app/contribute/page.tsx", root), "utf8"),
    readFile(new URL("app/timeline/page.tsx", root), "utf8"),
    readFile(new URL("app/timeline/TimelineExplorer.tsx", root), "utf8"),
    readFile(new URL("app/timeline/timeline-data.ts", root), "utf8"),
  ]);

  assert.match(header, /<PrimaryNav \/>/);
  for (const route of ["/", "/timeline", "/branches", "/stories", "/library", "/contribute"]) assert.match(primaryNav, new RegExp(`href: \\"${route}\\"`));
  assert.match(primaryNav, /nav-home/);
  assert.match(primaryNav, /nav-timeline/);
  assert.match(primaryNav, /aria-current/);
  // /people is deliberately reachable but not in the nav; /letters does not exist.
  assert.doesNotMatch(primaryNav, /href: "\/people"/);
  assert.doesNotMatch(primaryNav, /href: "\/letters"/);
  assert.match(home, /Choose a family line/);
  assert.match(home, /Open all research/);
  assert.match(home, /Eight lines/);
  assert.match(home, /TimelineExplorer compact/);
  assert.match(branches, /Eight separate starting lines/);
  assert.match(branches, /unnamed connecting generation/i);
  assert.match(people, /Choose a line first/);
  assert.match(stories, /Duplicate resolved by evidence, not by merge/);
  assert.match(library, /library-section/);
  assert.match(library, /<details/);
  assert.doesNotMatch(library, /<details[^>]*\sopen/);
  assert.match(contribute, /Contribute to the archive/);
  assert.match(timelinePage, /Every event is clickable/);
  assert.match(timelineClient, /aria-pressed/);
  assert.match(timelineClient, /visibleEvents/);
  assert.match(timelineClient, /availableEvents\.filter/);
  assert.match(timelineClient, /Showing only/);
  assert.match(timelineClient, /event\.href/);
  for (const line of ["ashford", "beckwith", "cardew", "delmore", "fenwick", "grantham", "holloway", "iverson"]) assert.match(timelineData, new RegExp(`"${line}"`));
  assert.match(timelineData, /timelineEvents/);
});

test("keeps grandparent lines isolated and supports direct-parent drill-down", async () => {
  const [branchData, branchPage, peopleIndex, profilePage, journeyMap] = await Promise.all([
    readFile(new URL("app/branches/branch-data.ts", root), "utf8"),
    readFile(new URL("app/branches/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/people/page.tsx", root), "utf8"),
    readFile(new URL("app/people/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/people/AncestorJourneyMap.tsx", root), "utf8"),
  ]);

  for (const line of ["Ashford", "Beckwith", "Cardew", "Delmore", "Fenwick", "Grantham", "Holloway", "Iverson"]) assert.match(branchData, new RegExp(line));
  // The living roots stay unnamed everywhere.
  assert.match(branchData, /First root · paternal grandfather/);
  assert.match(branchData, /Second root · maternal grandmother/);
  assert.match(branchData, /Thomas Ashford/);
  assert.match(branchData, /Margaret Quill/);
  assert.match(branchData, /Róisín Iversen/);
  assert.match(branchPage, /parents of the generation below/);
  assert.match(branchPage, /Open person and parents/);
  assert.match(profilePage, /Direct parents/);
  assert.match(profilePage, /Open this parent/);
  assert.match(profilePage, /Ancestor Passport/);
  assert.match(profilePage, /No verified portrait has been identified/);
  assert.match(profilePage, /AncestorJourneyMap/);
  assert.match(journeyMap, /aria-pressed/);
  assert.match(journeyMap, /google\.com\/maps/);
  assert.match(journeyMap, /Open the complete journey in Maps/);
  assert.doesNotMatch(peopleIndex, /people\.map/);
});

test("preserves all five evidence labels in the UI layer", async () => {
  const [components, branchData, peopleData, timelineData, research, css] = await Promise.all([
    readFile(new URL("app/site-components.tsx", root), "utf8"),
    readFile(new URL("app/branches/branch-data.ts", root), "utf8"),
    readFile(new URL("app/people/people-data.ts", root), "utf8"),
    readFile(new URL("app/timeline/timeline-data.ts", root), "utf8"),
    readFile(new URL("app/research/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  for (const level of ["confirmed", "probable", "hypothesis", "conflicting", "disproved"]) {
    assert.match(components, new RegExp(`${level}:`), `evidenceLabels must define ${level}`);
    assert.match(research, new RegExp(`level="${level}"`), `the research ledger must display ${level}`);
  }
  // "confirmed" is the base .confidence style; the others need explicit rules.
  for (const level of ["probable", "hypothesis", "conflicting", "disproved"]) {
    assert.match(css, new RegExp(`\\.confidence\\.${level}|evidence-${level}`), `globals.css must style ${level}`);
  }
  assert.match(branchData, /status: "hypothesis"/);
  assert.match(branchData, /status: "conflicting"/);
  assert.match(peopleData, /status: "conflicting"/);
  assert.match(timelineData, /evidence: "disproved"/);
  assert.match(timelineData, /evidence: "conflicting"/);
  assert.match(timelineData, /evidence: "hypothesis"/);
});

test("includes the synthetic family, research library, and consistent links", async () => {
  const [peopleData, timelineData, documents, librarySections, documentPage, markdown, sourceLinks, manifest] = await Promise.all([
    readFile(new URL("app/people/people-data.ts", root), "utf8"),
    readFile(new URL("app/timeline/timeline-data.ts", root), "utf8"),
    readFile(new URL("app/library/research-documents.json", root), "utf8").then(JSON.parse),
    readFile(new URL("app/library/library-sections.ts", root), "utf8"),
    readFile(new URL("app/library/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/library/MarkdownDocument.tsx", root), "utf8"),
    readFile(new URL("app/library/source-links.json", root), "utf8").then(JSON.parse),
    readFile(new URL("scripts/redaction-manifest.json", root), "utf8").then(JSON.parse),
  ]);

  assert.match(peopleData, /Edmund Ashford/);
  assert.match(peopleData, /Harold Fenwick/);
  assert.match(peopleData, /Rosa Iverson/);
  assert.match(peopleData, /Róisín Iversen/);
  assert.match(peopleData, /Niall Iversen/);
  assert.match(peopleData, /Frank Holloway/);
  assert.match(timelineData, /disproved/);
  assert.match(timelineData, /Dunmore Cross/);

  // The library only publishes what the redaction manifest lists.
  assert.equal(documents.length, manifest.documents.length);
  for (const entry of manifest.documents) assert.equal(entry.living_people_checked, true);
  assert.ok(documents.length >= 2);
  assert.match(librarySections, /Cycle Charters/);
  assert.match(librarySections, /Cycle Reports/);
  assert.match(documentPage, /Original material/);
  assert.match(documentPage, /Live source links/);
  assert.match(markdown, /source-reference/);
  assert.ok(Object.keys(sourceLinks).length >= 5);

  const publicDocuments = JSON.stringify(documents);
  assert.match(publicDocuments, /Synthetic example/);
  assert.match(publicDocuments, /disproved/i);
  assert.match(publicDocuments, /Negative searches are logged/);

  const slugs = documents.map((document) => document.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  const timelineLibrarySlugs = [...timelineData.matchAll(/href: "\/library\/([^"]+)"/g)].map((match) => match[1]);
  assert.ok(timelineLibrarySlugs.length >= 1);
  for (const slug of timelineLibrarySlugs) assert.ok(slugs.includes(slug), `Timeline links to missing library record: ${slug}`);
  const peopleLibrarySlugs = [...(await readFile(new URL("app/people/people-data.ts", root), "utf8")).matchAll(/href: "\/library\/([^"]+)"/g)].map((match) => match[1]);
  for (const slug of peopleLibrarySlugs) assert.ok(slugs.includes(slug), `Person page links to missing library record: ${slug}`);
});

test("keeps visitor contributions private and review-gated", async () => {
  const [route, form, reviewPage, reviewApi, reviewFile, reviewerAuth, reviewClient, worker] = await Promise.all([
    readFile(new URL("app/api/contributions/route.ts", root), "utf8"),
    readFile(new URL("app/contribute/ContributionForm.tsx", root), "utf8"),
    readFile(new URL("app/review/page.tsx", root), "utf8"),
    readFile(new URL("app/api/review/contributions/route.ts", root), "utf8"),
    readFile(new URL("app/api/review/files/[id]/route.ts", root), "utf8"),
    readFile(new URL("app/api/review/reviewer.ts", root), "utf8"),
    readFile(new URL("app/review/ReviewInbox.tsx", root), "utf8"),
    readFile(new URL("worker/index.ts", root), "utf8"),
  ]);

  assert.match(route, /status[^\n]+pending/);
  assert.match(route, /MAX_FILE_SIZE/);
  assert.match(route, /ARCHIVE_UPLOADS\.put/);
  assert.doesNotMatch(route, /export async function GET/);
  assert.match(form, /Submit for private review/);
  // Auth is bearer-token-only: no third-party SSO path anywhere.
  assert.match(reviewerAuth, /REVIEWER_TOKEN/);
  assert.match(reviewerAuth, /constantTimeMatch/);
  assert.match(reviewerAuth, /screening-automation/);
  assert.doesNotMatch(reviewerAuth, /oai-|sign-?in|sso/i);
  // No third-party SSO helper and no email-based reviewer identity remain.
  // (Pattern assembled from fragments so this file passes the banned-string sweep.)
  assert.doesNotMatch(reviewPage, new RegExp(["requireChat", "GPTUser"].join("") + "|REVIEWER_EMAIL"));
  assert.match(reviewApi, /getAuthorizedReviewer/);
  assert.match(reviewApi, /Reviewer authorization required/);
  assert.match(reviewApi, /screening_summary/);
  assert.match(reviewFile, /ARCHIVE_UPLOADS\.get/);
  assert.match(reviewFile, /private, no-store/);
  assert.match(reviewFile, /nosniff/);
  assert.match(reviewClient, /Nothing was published/);
  assert.match(reviewClient, /Living-person details/);
  assert.match(reviewClient, /Bearer/);
  assert.doesNotMatch(await readFile(new URL("app/site-components.tsx", root), "utf8"), /href="\/review"/);
  // The IMAGES binding is optional with a graceful fallback.
  assert.match(worker, /IMAGES\?:/);
  assert.match(worker, /if \(!images\)/);
});

test("contains no personal data from any real family", async () => {
  // Patterns are assembled from fragments so this file never contains the
  // banned strings itself (which would trip the pre-publish sweep).
  const fragments = [
    ["lem", "ieux"], ["\\bto", "dd\\b"], ["domi", "nique"], ["podg", "urski"], ["roman", "owski"], ["roman", "oski"],
    ["tab", "one"], ["azzo", "pardi"], ["sylv", "ester"], ["buona", "gurio"], ["dowie", "drion"], ["duch", "niak"],
    ["dawi", "dok"], ["chat", "gpt"], ["mass", "ena"], ["gab", "by"], ["gabri", "ella"], ["gia", "nna"],
  ];
  const banned = fragments.map(([a, b]) => new RegExp(a + b, "i"));
  banned.push(new RegExp("\\bLi" + "ght\\b"));
  const skipDirs = new Set(["node_modules", "dist", ".wrangler", ".vinext", ".next"]);

  async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) yield* walk(path.join(dir, entry.name));
      } else if (/\.(ts|tsx|mjs|json|css|md|svg|jsonc)$/.test(entry.name)) {
        yield path.join(dir, entry.name);
      }
    }
  }

  for await (const file of walk(new URL(".", root).pathname)) {
    const content = await readFile(file, "utf8");
    for (const pattern of banned) {
      assert.doesNotMatch(content, pattern, `${file} contains banned personal-data pattern ${pattern}`);
    }
  }
});
