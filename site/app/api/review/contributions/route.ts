import { env } from "cloudflare:workers";
import { ensureContributionTables, type ContributionFileRow, type ContributionRow } from "../../contributions/storage";
import { getAuthorizedReviewer, reviewerConfigurationReady } from "../reviewer";

const allowedStatuses = new Set(["pending", "screened", "needs_follow_up", "accepted", "declined", "published"]);
const allowedCredibility = new Set(["unreviewed", "strong", "plausible", "uncertain", "conflicting", "low", "spam"]);

function noStoreJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

function clean(value: unknown, max = 8000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  if (!reviewerConfigurationReady()) return noStoreJson({ error: "The reviewer is not configured." }, 503);
  const reviewer = await getAuthorizedReviewer(request);
  if (!reviewer) return noStoreJson({ error: "Reviewer authorization required." }, 401);

  await ensureContributionTables();
  const requestedStatus = new URL(request.url).searchParams.get("status") ?? "";
  if (requestedStatus && !allowedStatuses.has(requestedStatus)) return noStoreJson({ error: "Unknown review status." }, 400);

  const query = requestedStatus
    ? env.DB.prepare("SELECT id, name, email, relationship, subject, message, status, credibility, screening_summary, privacy_flags, recommendation, reviewer_notes, reviewed_at, reviewed_by, created_at FROM contributions WHERE status = ? ORDER BY created_at ASC LIMIT 100").bind(requestedStatus)
    : env.DB.prepare("SELECT id, name, email, relationship, subject, message, status, credibility, screening_summary, privacy_flags, recommendation, reviewer_notes, reviewed_at, reviewed_by, created_at FROM contributions ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'screened' THEN 1 WHEN 'needs_follow_up' THEN 2 ELSE 3 END, created_at DESC LIMIT 100");
  const contributions = await query.all<ContributionRow>();
  const files = await env.DB.prepare("SELECT id, contribution_id, object_key, original_name, content_type, size FROM contribution_files ORDER BY id").all<ContributionFileRow>();
  const filesByContribution = new Map<string, Array<Record<string, unknown>>>();
  for (const file of files.results ?? []) {
    const publicFile = {
      id: file.id,
      name: file.original_name,
      contentType: file.content_type,
      size: file.size,
      downloadUrl: `/api/review/files/${file.id}`,
    };
    filesByContribution.set(file.contribution_id, [...(filesByContribution.get(file.contribution_id) ?? []), publicFile]);
  }

  return noStoreJson({
    reviewer: { displayName: reviewer.displayName, mode: reviewer.mode },
    contributions: (contributions.results ?? []).map((contribution) => ({
      id: contribution.id,
      reference: contribution.id.split("-")[0].toUpperCase(),
      name: contribution.name,
      email: contribution.email,
      relationship: contribution.relationship,
      subject: contribution.subject,
      message: contribution.message,
      status: contribution.status,
      credibility: contribution.credibility,
      screeningSummary: contribution.screening_summary,
      privacyFlags: contribution.privacy_flags ? contribution.privacy_flags.split("|").filter(Boolean) : [],
      recommendation: contribution.recommendation,
      reviewerNotes: contribution.reviewer_notes,
      reviewedAt: contribution.reviewed_at,
      reviewedBy: contribution.reviewed_by,
      createdAt: contribution.created_at,
      files: filesByContribution.get(contribution.id) ?? [],
    })),
  });
}

export async function PATCH(request: Request) {
  if (!reviewerConfigurationReady()) return noStoreJson({ error: "The reviewer is not configured." }, 503);
  const reviewer = await getAuthorizedReviewer(request);
  if (!reviewer) return noStoreJson({ error: "Reviewer authorization required." }, 401);

  const body = await request.json() as Record<string, unknown>;
  const id = clean(body.id, 80);
  const status = clean(body.status, 40);
  const credibility = clean(body.credibility, 40);
  const screeningSummary = clean(body.screeningSummary, 5000);
  const recommendation = clean(body.recommendation, 3000);
  const reviewerNotes = clean(body.reviewerNotes, 5000);
  const privacyFlags = Array.isArray(body.privacyFlags)
    ? body.privacyFlags.map((flag) => clean(flag, 80)).filter(Boolean).slice(0, 12)
    : [];

  if (!id || !allowedStatuses.has(status) || !allowedCredibility.has(credibility)) {
    return noStoreJson({ error: "The screening update is incomplete or invalid." }, 400);
  }

  await ensureContributionTables();
  const result = await env.DB.prepare(`UPDATE contributions
    SET status = ?, credibility = ?, screening_summary = ?, privacy_flags = ?, recommendation = ?, reviewer_notes = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
    WHERE id = ?`)
    .bind(status, credibility, screeningSummary, privacyFlags.join("|"), recommendation, reviewerNotes, reviewer.id, id).run();
  if (!result.meta.changes) return noStoreJson({ error: "Contribution not found." }, 404);

  return noStoreJson({ ok: true, id, status, reviewedBy: reviewer.id });
}
