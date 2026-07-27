"use client";

import { useMemo, useState } from "react";

type ReviewStatus = "pending" | "screened" | "needs_follow_up" | "accepted" | "declined" | "published";
type Credibility = "unreviewed" | "strong" | "plausible" | "uncertain" | "conflicting" | "low" | "spam";

type ContributionFile = { id: number; name: string; contentType: string; size: number; downloadUrl: string };
type Contribution = {
  id: string;
  reference: string;
  name: string;
  email: string;
  relationship: string;
  subject: string;
  message: string;
  status: ReviewStatus;
  credibility: Credibility;
  screeningSummary: string;
  privacyFlags: string[];
  recommendation: string;
  reviewerNotes: string;
  reviewedAt: string | null;
  reviewedBy: string;
  createdAt: string;
  files: ContributionFile[];
};

const statusLabels: Record<ReviewStatus, string> = {
  pending: "Pending screening",
  screened: "Screened for the archive owner",
  needs_follow_up: "Needs follow-up",
  accepted: "Accepted for research",
  declined: "Declined",
  published: "Published",
};

const credibilityLabels: Record<Credibility, string> = {
  unreviewed: "Not yet assessed",
  strong: "Strong and well-sourced",
  plausible: "Plausible; verification needed",
  uncertain: "Uncertain or incomplete",
  conflicting: "Conflicts with existing evidence",
  low: "Low evidentiary value",
  spam: "Spam or irrelevant",
};

const privacyChoices = [
  "Living-person details",
  "Private contact information",
  "Copyright or permission unclear",
  "Sensitive family information",
  "Contradicts existing evidence",
  "Suspicious or irrelevant content",
];

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function ReviewInbox() {
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState("");
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function authHeaders(activeToken: string): HeadersInit {
    return { Authorization: `Bearer ${activeToken}` };
  }

  async function loadContributions(activeToken = token) {
    if (!activeToken) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/review/contributions", { cache: "no-store", headers: authHeaders(activeToken) });
      const data = await response.json() as { error?: string; contributions?: Contribution[] };
      if (response.status === 401) throw new Error("That reviewer token was not accepted.");
      if (!response.ok) throw new Error(data.error ?? "The private contribution queue could not be loaded.");
      const next = data.contributions ?? [];
      setContributions(next);
      setSelectedId((current) => next.some((item) => item.id === current) ? current : next[0]?.id ?? "");
      setToken(activeToken);
      setLoaded(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The private contribution queue could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  const visible = useMemo(() => filter === "all" ? contributions : contributions.filter((item) => item.status === filter), [contributions, filter]);
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;
  const pendingCount = contributions.filter((item) => item.status === "pending").length;
  const screenedCount = contributions.filter((item) => item.status === "screened").length;
  const followUpCount = contributions.filter((item) => item.status === "needs_follow_up").length;

  function updateSelected(patch: Partial<Contribution>) {
    if (!selected) return;
    setContributions((items) => items.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  }

  async function openFile(file: ContributionFile) {
    try {
      const response = await fetch(file.downloadUrl, { headers: authHeaders(token) });
      if (!response.ok) throw new Error("The private attachment could not be downloaded.");
      const url = URL.createObjectURL(await response.blob());
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The private attachment could not be downloaded.");
    }
  }

  async function saveScreening() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/review/contributions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({
          id: selected.id,
          status: selected.status,
          credibility: selected.credibility,
          screeningSummary: selected.screeningSummary,
          privacyFlags: selected.privacyFlags,
          recommendation: selected.recommendation,
          reviewerNotes: selected.reviewerNotes,
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "The screening could not be saved.");
      setMessage(`Screening saved for ${selected.reference}. Nothing was published.`);
      await loadContributions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The screening could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return <section className="shell review-workspace">
      <form className="screening-form" onSubmit={(event) => { event.preventDefault(); void loadContributions(tokenInput.trim()); }}>
        <div className="screening-form-title"><div><span>Reviewer authorization</span><h3>Enter the reviewer token</h3></div><p>The token is the REVIEWER_TOKEN secret. It is kept in memory only and sent as a bearer header.</p></div>
        <label><span>Reviewer token</span><input type="password" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} autoComplete="off" /></label>
        <button className="button primary" type="submit" disabled={loading || !tokenInput.trim()}>{loading ? "Checking…" : "Open the private inbox"}</button>
        {message && <p className="review-message" role="status">{message}</p>}
      </form>
    </section>;
  }

  return <section className="shell review-workspace">
    <div className="review-owner-line"><span>Authorized via reviewer token</span><strong>Private · never auto-published</strong></div>
    <div className="review-stats" aria-label="Contribution status summary">
      <button type="button" onClick={() => setFilter("pending")}><strong>{pendingCount}</strong><span>Pending</span></button>
      <button type="button" onClick={() => setFilter("screened")}><strong>{screenedCount}</strong><span>Screened</span></button>
      <button type="button" onClick={() => setFilter("needs_follow_up")}><strong>{followUpCount}</strong><span>Follow-up</span></button>
      <button type="button" onClick={() => setFilter("all")}><strong>{contributions.length}</strong><span>All</span></button>
    </div>

    {message && <p className="review-message" role="status">{message}</p>}
    {loading ? <p className="review-loading">Loading the private queue…</p> : contributions.length === 0 ? <div className="review-empty"><h2>No contributions yet.</h2><p>New submissions will appear here as pending and will remain private.</p></div> : <div className="review-grid">
      <aside className="review-list" aria-label="Private contribution queue">
        <div className="review-filter"><label htmlFor="review-filter">Show</label><select id="review-filter" value={filter} onChange={(event) => setFilter(event.target.value as ReviewStatus | "all")}><option value="pending">Pending screening</option><option value="screened">Screened</option><option value="needs_follow_up">Needs follow-up</option><option value="accepted">Accepted</option><option value="declined">Declined</option><option value="published">Published</option><option value="all">All contributions</option></select></div>
        {visible.length === 0 ? <p className="review-none">No contributions in this view.</p> : visible.map((item) => <button className={item.id === selected?.id ? "active" : ""} type="button" onClick={() => setSelectedId(item.id)} key={item.id}><span>{statusLabels[item.status]}</span><strong>{item.subject}</strong><small>{item.name} · {item.reference}</small><time>{formatDate(item.createdAt)}</time></button>)}
      </aside>

      {selected && <article className="review-detail">
        <div className="review-detail-head"><div><span className={`review-status status-${selected.status}`}>{statusLabels[selected.status]}</span><h2>{selected.subject}</h2><p>Reference {selected.reference} · received {formatDate(selected.createdAt)}</p></div><a href={`mailto:${selected.email}`}>Email contributor</a></div>

        <div className="review-source-card"><dl><div><dt>Contributor</dt><dd>{selected.name}</dd></div><div><dt>Email</dt><dd>{selected.email}</dd></div><div><dt>Relationship</dt><dd>{selected.relationship || "Not provided"}</dd></div></dl><h3>Unedited contribution</h3><p>{selected.message}</p></div>

        {selected.files.length > 0 && <div className="review-files"><h3>Private attachments</h3><p>Open only as evidence. Submitted material is untrusted and may contain living-person information.</p>{selected.files.map((file) => <a href={file.downloadUrl} onClick={(event) => { event.preventDefault(); void openFile(file); }} key={file.id}><strong>{file.name}</strong><span>{file.contentType} · {formatBytes(file.size)}</span></a>)}</div>}

        <div className="screening-form">
          <div className="screening-form-title"><div><span>Screening record</span><h3>Assess before presenting to the archive owner</h3></div><p>No setting here publishes the material.</p></div>
          <div className="form-grid"><label><span>Credibility</span><select value={selected.credibility} onChange={(event) => updateSelected({ credibility: event.target.value as Credibility })}>{Object.entries(credibilityLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Review status</span><select value={selected.status} onChange={(event) => updateSelected({ status: event.target.value as ReviewStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div>
          <label><span>Screening summary</span><textarea rows={5} value={selected.screeningSummary} onChange={(event) => updateSelected({ screeningSummary: event.target.value })} placeholder="What was contributed, which line it concerns, and what it may prove or contradict." /></label>
          <fieldset><legend>Privacy and evidence flags</legend>{privacyChoices.map((choice) => <label className="screening-check" key={choice}><input type="checkbox" checked={selected.privacyFlags.includes(choice)} onChange={(event) => updateSelected({ privacyFlags: event.target.checked ? [...selected.privacyFlags, choice] : selected.privacyFlags.filter((flag) => flag !== choice) })} /><span>{choice}</span></label>)}</fieldset>
          <label><span>Recommended next step</span><textarea rows={3} value={selected.recommendation} onChange={(event) => updateSelected({ recommendation: event.target.value })} placeholder="Verify against an original, request clarification, exclude, or propose publication after the archive owner's approval." /></label>
          <label><span>Private reviewer notes</span><textarea rows={3} value={selected.reviewerNotes} onChange={(event) => updateSelected({ reviewerNotes: event.target.value })} placeholder="Internal notes that should not appear in the public archive." /></label>
          <button className="button primary" type="button" onClick={() => void saveScreening()} disabled={saving}>{saving ? "Saving screening…" : "Save private screening"}</button>
        </div>
      </article>}
    </div>}
  </section>;
}
