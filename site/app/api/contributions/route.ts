import { env } from "cloudflare:workers";
import { ensureContributionTables } from "./storage";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "application/pdf", "text/plain",
]);

function clean(value: FormDataEntryValue | null, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeFilename(name: string) {
  return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-120) || "upload";
}

async function hashRequester(request: Request) {
  const source = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    if (clean(form.get("website"), 200)) return Response.json({ ok: true, reference: "received" });

    const name = clean(form.get("name"), 160);
    const email = clean(form.get("email"), 254);
    const relationship = clean(form.get("relationship"), 300);
    const subject = clean(form.get("subject"), 200);
    const message = clean(form.get("message"), 12000);
    const consent = clean(form.get("consent"), 20);

    if (!name || !email || !subject || !message || consent !== "yes") {
      return Response.json({ error: "Please complete the required fields and confirm the contribution terms." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });

    const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
    if (files.length > MAX_FILES) return Response.json({ error: `Please attach no more than ${MAX_FILES} files.` }, { status: 400 });
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
      if (file.size > MAX_FILE_SIZE) return Response.json({ error: `${file.name} is larger than 10 MB.` }, { status: 400 });
      if (!allowedTypes.has(file.type)) return Response.json({ error: `${file.name} is not an accepted photo or document type.` }, { status: 400 });
    }
    if (totalSize > MAX_TOTAL_SIZE) return Response.json({ error: "The combined attachments are larger than 25 MB." }, { status: 400 });

    await ensureContributionTables();
    const requesterHash = await hashRequester(request);
    const recent = await env.DB.prepare("SELECT COUNT(*) AS count FROM contributions WHERE requester_hash = ? AND created_at >= datetime('now', '-1 hour')").bind(requesterHash).first<{ count: number }>();
    if ((recent?.count ?? 0) >= 5) return Response.json({ error: "Too many recent submissions. Please try again later." }, { status: 429 });

    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO contributions (id, name, email, relationship, subject, message, status, requester_hash) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)")
      .bind(id, name, email, relationship, subject, message, requesterHash).run();

    for (const file of files) {
      const key = `contributions/${id}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
      await env.ARCHIVE_UPLOADS.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { contributionId: id } });
      await env.DB.prepare("INSERT INTO contribution_files (contribution_id, object_key, original_name, content_type, size) VALUES (?, ?, ?, ?, ?)")
        .bind(id, key, file.name.slice(0, 255), file.type, file.size).run();
    }

    return Response.json({ ok: true, reference: id.split("-")[0].toUpperCase() });
  } catch (error) {
    console.error("Contribution intake failed", error);
    return Response.json({ error: "The archive could not save this contribution. Please try again." }, { status: 500 });
  }
}
