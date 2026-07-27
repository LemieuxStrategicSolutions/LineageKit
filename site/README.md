# LineageKit archive site

A public-facing family-archive website that publishes **only** what a redaction
manifest allowlists: deceased ancestors, reviewed research notes, and evidence
labels kept honest (`confirmed` / `probable` / `hypothesis` / `conflicting` /
`disproved`). It ships filled with the invented example family from
[`../examples/`](../examples/README.md) — every person, place, and record on the
site is synthetic.

Stack: Next.js App Router running on [vinext](https://www.npmjs.com/package/vinext)
(Vite + `@cloudflare/vite-plugin`), React 19, Tailwind 4, Drizzle + Cloudflare D1
for private contributions, and R2 for private attachment uploads. Deploys as a
single Cloudflare Worker.

## Setup

Prerequisites: Node.js ≥ 22.13, a Cloudflare account, and `wrangler` (installed
as a dev dependency — use `npx wrangler …` if it is not on your PATH).

```bash
cd site
npm install

# 1. Create the D1 database and paste the printed database_id into
#    wrangler.jsonc (replacing the 00000000-… placeholder):
npx wrangler d1 create family-archive-db

# 2. Apply the schema migrations (drizzle/ is the migrations dir):
npx wrangler d1 migrations apply family-archive-db --remote
#    (add --local instead of --remote to prime your local dev database)

# 3. Create the R2 bucket for private contribution uploads:
npx wrangler r2 bucket create family-archive-uploads

# 4. Set the reviewer secret. /review and the review API accept ONLY
#    `Authorization: Bearer <this value>` — there is no other sign-in:
npx wrangler secret put REVIEWER_TOKEN

# Local development (miniflare provides local D1/R2 from wrangler.jsonc):
npm run dev

# Deploy (builds, then deploys the generated dist/server/wrangler.json):
npm run deploy
```

`npm test` builds the site and runs the structural test suite, including a
sweep that fails if any real-family string ever lands in the source tree.

Notes:

- The Cloudflare **Images** binding is optional. Without it the worker serves
  original, untransformed images — a graceful fallback, no config needed.
- Migrations are applied with `wrangler d1 migrations apply` (step 2 above);
  there is no build-time migration shipping. After changing `db/schema.ts`,
  run `npm run db:generate` and re-apply.
- The site sets `robots: noindex` by default. Remove that in `app/layout.tsx`
  only when you intend the archive to be searchable.

## The redaction-manifest workflow

The research library publishes **only** documents listed in
[`scripts/redaction-manifest.json`](scripts/redaction-manifest.json). The full
schema and rationale live in [`../docs/publishing-guide.md`](../docs/publishing-guide.md);
the shape is:

```json
{
  "documents": [
    {
      "category": "Cycle report",
      "path": "../examples/sample-cycle-1-report.md",
      "line": "All lines",
      "reviewed_by": "example-maintainer",
      "reviewed_on": "2031-03-09",
      "living_people_checked": true
    }
  ],
  "people_allowlist": ["P000004"],
  "redactions": [
    { "match": "exact string to replace", "replace": "a living family informant" }
  ]
}
```

- `documents[]` — every markdown file the library renders. Not listed → not
  built. The build **refuses** any entry whose `living_people_checked` is not
  `true`.
- `people_allowlist[]` — person IDs eligible for person pages and timeline
  entries. In this template the person pages are hand-written synthetic data;
  when you wire the site to your own data pipeline, gate person-page generation
  on this list (and on `living_status = deceased` — belt and suspenders).
- `redactions[]` — string replacements applied to listed documents, for the
  case where a publishable document mentions a living person in passing. This
  is the one denylist in the system, and it sits *behind* the allowlist.

After editing the manifest (or any listed document), regenerate the committed
library JSON:

```bash
npm run library:build
```

That runs `scripts/build-research-library.mjs` (manifest → `app/library/research-documents.json`)
and `scripts/generate-library-source-links.mjs` (source register CSV →
`app/library/source-links.json`, matching every `S000123`-style source ID the
published documents cite). Both generated files are committed so the site
builds without re-running the scripts. Point `SOURCE_REGISTER_CSV` at your own
register when you adapt the template:

```bash
SOURCE_REGISTER_CSV=../Data/Source-Register.csv node scripts/generate-library-source-links.mjs
```

Before every deploy, run the pre-publish sweep from the publishing guide and
skim the generated JSON for anything that should not be public.

## The living-person rule

Living people are **never** published — no names, no birth dates, no photos,
no contact details. In this template:

- The two living roots of the example family are represented only as "first
  root" and "second root"; the branches page shows the connecting generation as
  *"their children · living"* — the unnamed-connecting-generation pattern.
- Person pages exist only for deceased ancestors.
- Evidence labels are preserved in public: a hypothesis stays labeled a
  hypothesis, a conflict stays visible, and a disproof is displayed as a win.
  The archive's credibility *is* the labeling.

Visitor contributions are the other half of the rule: submissions land in a
private D1 table (attachments in private R2), are visible only through the
token-gated `/review` inbox, and nothing a visitor submits can ever
auto-publish. The screening identity (`screening-automation`) can annotate;
only a human moving content into the research corpus *and* the manifest makes
it public.
