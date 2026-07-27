import { env } from "cloudflare:workers";

type ReviewerEnv = typeof env & {
  REVIEWER_TOKEN?: string;
};

const reviewerEnv = env as ReviewerEnv;

async function constantTimeMatch(candidate: string, expected: string) {
  if (!candidate || !expected) return false;
  const encoder = new TextEncoder();
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const left = new Uint8Array(candidateHash);
  const right = new Uint8Array(expectedHash);
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left[index] ^ right[index];
  return mismatch === 0;
}

/**
 * Reviewer auth is bearer-token-only. Set the secret once with
 * `wrangler secret put REVIEWER_TOKEN`; every review request must carry
 * `Authorization: Bearer <token>`.
 */
export async function getAuthorizedReviewer(request?: Request) {
  const authorization = request?.headers.get("authorization") ?? "";
  const candidate = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (await constantTimeMatch(candidate, reviewerEnv.REVIEWER_TOKEN ?? "")) {
    return { id: "screening-automation", displayName: "Screening automation", mode: "token" as const };
  }

  return null;
}

export function reviewerConfigurationReady() {
  return Boolean(reviewerEnv.REVIEWER_TOKEN);
}
