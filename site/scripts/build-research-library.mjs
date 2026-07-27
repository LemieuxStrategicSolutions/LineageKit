// Builds app/library/research-documents.json from the redaction manifest.
//
// Publication is allowlist-driven: only documents listed in
// scripts/redaction-manifest.json are ever rendered on the site. See
// docs/publishing-guide.md at the repository root for the manifest schema and
// the living-person rule. The generated JSON is committed so the site builds
// without re-running this script; re-run it (npm run library:build) whenever
// the manifest or a listed document changes.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const siteRoot = process.cwd();
const manifestPath = path.join(siteRoot, "scripts", "redaction-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const documentsList = manifest.documents ?? [];
const redactions = manifest.redactions ?? [];

if (!Array.isArray(documentsList)) {
  throw new Error("redaction-manifest.json: `documents` must be an array.");
}
if (!Array.isArray(redactions)) {
  throw new Error("redaction-manifest.json: `redactions` must be an array.");
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// The one denylist in the system, and it sits behind the allowlist, not
// instead of it: string replacements for listed documents that mention a
// living person in passing.
function applyRedactions(content) {
  let result = content;
  for (const redaction of redactions) {
    if (!redaction || typeof redaction.match !== "string" || typeof redaction.replace !== "string") {
      throw new Error("redaction-manifest.json: each redaction needs string `match` and `replace` fields.");
    }
    result = result.split(redaction.match).join(redaction.replace);
  }
  return result;
}

const documents = [];
const seenSlugs = new Set();
for (const entry of documentsList) {
  const { category, path: relativePath, line } = entry;
  if (!category || !relativePath) {
    throw new Error(`redaction-manifest.json: document entry is missing \`category\` or \`path\`: ${JSON.stringify(entry)}`);
  }
  if (entry.living_people_checked !== true) {
    throw new Error(`Refusing to publish "${relativePath}": living_people_checked is not true. Review the document, then record the check in the manifest.`);
  }
  const content = await readFile(path.resolve(siteRoot, relativePath), "utf8");
  const firstHeading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const filename = path.basename(relativePath, ".md");
  const slug = slugify(line ? `${line}-${filename}` : filename);
  if (seenSlugs.has(slug)) throw new Error(`Duplicate library slug: ${slug}`);
  seenSlugs.add(slug);
  documents.push({
    slug,
    title: firstHeading ?? filename,
    category,
    branch: line ?? "Unassigned",
    content: applyRedactions(content),
  });
}

await writeFile(path.join(siteRoot, "app/library/research-documents.json"), JSON.stringify(documents, null, 2) + "\n");
console.log(`Prepared ${documents.length} public-safe research documents from the redaction manifest.`);
