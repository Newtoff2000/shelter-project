import type { H3Event } from 'h3'

/**
 * Reject cross-site POSTs by comparing the request's Origin (fallback Referer)
 * host to the request's own host. Host-only comparison means it works across
 * production, Vercel preview deploys (*.vercel.app), a future custom domain, and
 * localhost with no env coupling and no client changes — browsers always attach
 * Origin on the form's fetch POSTs. A request with neither header is not a normal
 * first-party browser submit, so it's rejected.
 */
export function assertSameOrigin(event: H3Event): void {
  const target = getRequestHost(event, { xForwardedHost: true })

  const sourceHost = (() => {
    const origin = getHeader(event, 'origin')
    if (origin && origin !== 'null') {
      try { return new URL(origin).host } catch { /* malformed → treat as missing */ }
    }
    const referer = getHeader(event, 'referer')
    if (referer) {
      try { return new URL(referer).host } catch { /* malformed → treat as missing */ }
    }
    return undefined
  })()

  if (!sourceHost || sourceHost !== target) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-origin request rejected' })
  }
}

const WINDOW_MS = 600_000 // 10 minutes
const LIMIT = 5 // submissions per window per IP
const MAX_KEYS = 5000 // global memory cap (best-effort)

// Module-scoped, per-instance only — NOT shared across serverless instances, so
// this is a best-effort throttle. The honeypot + field validation + same-origin
// check + the Resend send are the real defenses; this just blunts a single
// warm-instance flood loop. Date.now() is fine here (real server runtime).
const hits = new Map<string, number[]>()

export function checkRateLimit(event: H3Event): void {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()

  // Bound memory: clear wholesale if the map grows unexpectedly large.
  if (hits.size > MAX_KEYS) hits.clear()

  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }
  recent.push(now)
  hits.set(ip, recent)
}
