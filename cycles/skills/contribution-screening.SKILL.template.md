---
name: contribution-screening
description: Screen new family-archive contribution submissions and prepare a moderation summary. Never approves or publishes on its own.
schedule: "0 18 * * *"   # daily 6pm — adapt to your harness's schedule syntax
---

# Contribution screening

The family archive site at {{SITE_URL}} has a contribution inbox (`/contribute`) feeding a review queue (`/review`). You screen; {{USER_NAME}} moderates.

1. Fetch pending contributions via the review API using the reviewer token from the platform secret store (never from a file): `GET {{SITE_URL}}/api/review/contributions` with `Authorization: Bearer <token>`.
2. For each pending item, assess and record via the API's screening fields:
   - **credibility**: does the claimed relationship and story cohere with the published tree?
   - **privacy_flags**: does the submission name or depict living people, addresses, or contact details?
   - **recommendation**: publish-candidate / needs-follow-up / decline — with one sentence of reasoning.
3. Never change a contribution's status to approved, and never move material into the site content — screening output is advisory.
4. Surface a short summary to {{USER_NAME}} conversationally: how many new, anything remarkable, anything with privacy flags.
5. Genuine research leads inside a contribution go to `RESEARCH-QUESTIONS.md` as hypotheses — a relative's memory is oral history, a lead, not proof.
