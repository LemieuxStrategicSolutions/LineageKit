import { env } from "cloudflare:workers";
import { ensureContributionTables, type ContributionFileRow } from "../../../contributions/storage";
import { getAuthorizedReviewer, reviewerConfigurationReady } from "../../reviewer";

function safeDownloadName(value: string) {
  return value.replace(/[\r\n"\\]/g, "-").slice(0, 180) || "family-contribution";
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!reviewerConfigurationReady()) return new Response("Reviewer not configured", { status: 503 });
  const reviewer = await getAuthorizedReviewer(request);
  if (!reviewer) return new Response("Reviewer authorization required", { status: 401 });

  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return new Response("Invalid file", { status: 400 });
  await ensureContributionTables();
  const file = await env.DB.prepare("SELECT id, contribution_id, object_key, original_name, content_type, size FROM contribution_files WHERE id = ?")
    .bind(Number(id)).first<ContributionFileRow>();
  if (!file) return new Response("File not found", { status: 404 });

  const object = await env.ARCHIVE_UPLOADS.get(file.object_key);
  if (!object?.body) return new Response("Stored file not found", { status: 404 });
  const filename = safeDownloadName(file.original_name);
  return new Response(object.body, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(file.original_name)}`,
      "Content-Length": String(file.size),
      "Content-Type": file.content_type || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
