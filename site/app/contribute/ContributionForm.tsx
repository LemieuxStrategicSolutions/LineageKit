"use client";

import { useState } from "react";

export function ContributionForm() {
  const [state, setState] = useState<{ kind: "idle" | "sending" | "success" | "error"; message?: string }>({ kind: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending" });
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/contributions", { method: "POST", body: new FormData(form) });
      const data = await response.json() as { error?: string; reference?: string };
      if (!response.ok) throw new Error(data.error ?? "The contribution could not be saved.");
      form.reset();
      setState({ kind: "success", message: `Thank you. Your contribution is private and awaiting review. Reference: ${data.reference}` });
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "The contribution could not be saved." });
    }
  }

  return (
    <form className="contribution-form" onSubmit={submit}>
      <div className="form-grid">
        <label><span>Your name *</span><input name="name" required autoComplete="name" /></label>
        <label><span>Your email *</span><input name="email" type="email" required autoComplete="email" /></label>
      </div>
      <label><span>Your relationship to the family or research</span><input name="relationship" placeholder="Example: great-grandchild of…" /></label>
      <label><span>What are you contributing? *</span><select name="subject" required defaultValue=""><option value="" disabled>Choose one</option><option>Correction to the archive</option><option>Family story or oral history</option><option>Names, dates, or relationships</option><option>Photograph</option><option>Letter or document</option><option>Research lead or source</option><option>Something else</option></select></label>
      <label><span>Tell us what you know *</span><textarea name="message" required rows={9} placeholder="Please include who told you, how you know it, names and spellings, approximate dates, and anything written on the back of a photograph." /></label>
      <label className="file-field"><span>Attach photographs or documents</span><input name="files" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,text/plain" multiple /><small>Up to 5 files, 10 MB each, 25 MB total. JPEG, PNG, WebP, HEIC, PDF, or text.</small></label>
      <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="consent"><input type="checkbox" name="consent" value="yes" required /><span>I have the right to share this material. I understand it will be reviewed before publication and may be quoted, summarized, or displayed in this family archive with source attribution.</span></label>
      <button className="button primary submit-button" type="submit" disabled={state.kind === "sending"}>{state.kind === "sending" ? "Saving contribution…" : "Submit for private review →"}</button>
      {state.kind !== "idle" && state.kind !== "sending" && <p className={`form-result ${state.kind}`} role="status">{state.message}</p>}
    </form>
  );
}
