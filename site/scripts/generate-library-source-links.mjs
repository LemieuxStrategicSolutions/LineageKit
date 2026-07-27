// Regenerates app/library/source-links.json: for every source ID (S000123)
// referenced by a published library document, look the source up in the
// project's source register CSV and record its title + URL so the site can
// render live "open the original" links.
//
// The register path defaults to the synthetic example register; point
// SOURCE_REGISTER_CSV at your own project's register when adapting this.
import { readFile, writeFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const registerPath = process.env.SOURCE_REGISTER_CSV ?? "../examples/sample-source-register.csv";
const documents = JSON.parse(await readFile(new URL("app/library/research-documents.json", projectRoot), "utf8"));
const csv = await readFile(new URL(registerPath, projectRoot), "utf8");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function normalizeUrl(value) {
  // Accept full URLs; also accept bare host/path register entries
  // (e.g. "archives.example/dir1913/p88") by assuming https.
  if (/^https?:\/\//.test(value)) return value;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+\//i.test(value)) return `https://${value}`;
  return null;
}

const referencedSourceIds = new Set(
  documents.flatMap((document) => document.content.match(/S\d{6}/g) ?? []),
);
const [headers, ...rows] = parseCsv(csv);
const sourceIdIndex = headers.indexOf("source_id");
const titleIndex = headers.indexOf("title");
const locationIndex = headers.indexOf("url_or_file");
if (sourceIdIndex === -1 || titleIndex === -1 || locationIndex === -1) {
  throw new Error(`Source register at ${registerPath} must have source_id, title, and url_or_file columns.`);
}
const sourceLinks = {};

for (const row of rows) {
  const sourceId = row[sourceIdIndex];
  if (!referencedSourceIds.has(sourceId)) continue;
  const url = (row[locationIndex] ?? "")
    .split(/\s+;\s+/)
    .map(normalizeUrl)
    .find((value) => value !== null);
  if (!url) continue;
  sourceLinks[sourceId] = { title: row[titleIndex], url };
}

await writeFile(
  new URL("app/library/source-links.json", projectRoot),
  `${JSON.stringify(sourceLinks, null, 2)}\n`,
);

console.log(`Generated ${Object.keys(sourceLinks).length} live library source links.`);
