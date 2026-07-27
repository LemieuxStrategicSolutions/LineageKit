import { env } from "cloudflare:workers";

const reviewColumns = [
  ["credibility", "TEXT NOT NULL DEFAULT 'unreviewed'"],
  ["screening_summary", "TEXT NOT NULL DEFAULT ''"],
  ["privacy_flags", "TEXT NOT NULL DEFAULT ''"],
  ["recommendation", "TEXT NOT NULL DEFAULT ''"],
  ["reviewer_notes", "TEXT NOT NULL DEFAULT ''"],
  ["reviewed_at", "TEXT"],
  ["reviewed_by", "TEXT NOT NULL DEFAULT ''"],
] as const;

export async function ensureContributionTables() {
  const db = env.DB;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS contributions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      relationship TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      requester_hash TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS contribution_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contribution_id TEXT NOT NULL,
      object_key TEXT NOT NULL,
      original_name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS contributions_created_idx ON contributions(created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS contribution_files_contribution_idx ON contribution_files(contribution_id)"),
  ]);

  const columnResult = await db.prepare("PRAGMA table_info(contributions)").all<{ name: string }>();
  const existing = new Set((columnResult.results ?? []).map((column) => column.name));
  for (const [name, definition] of reviewColumns) {
    if (!existing.has(name)) await db.prepare(`ALTER TABLE contributions ADD COLUMN ${name} ${definition}`).run();
  }
}

export type ContributionRow = {
  id: string;
  name: string;
  email: string;
  relationship: string;
  subject: string;
  message: string;
  status: string;
  credibility: string;
  screening_summary: string;
  privacy_flags: string;
  recommendation: string;
  reviewer_notes: string;
  reviewed_at: string | null;
  reviewed_by: string;
  created_at: string;
};

export type ContributionFileRow = {
  id: number;
  contribution_id: string;
  object_key: string;
  original_name: string;
  content_type: string;
  size: number;
};
