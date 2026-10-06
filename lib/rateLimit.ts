type Hit = { count: number; resetAt: number }

const hits = new Map<string, Hit>()

export const rateLimit = (
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } => {
  const now = Date.now()
  const hit = hits.get(key)

  if (!hit || now > hit.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSec: 0 }
  }

  if (hit.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((hit.resetAt - now) / 1000),
    }
  }

  hit.count += 1
  return { allowed: true, retryAfterSec: 0 }
}

export const getClientIp = (req: Request): string =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  req.headers.get('x-real-ip') ||
  'inconnu'
