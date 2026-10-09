import { createHmac, timingSafeEqual } from 'crypto'

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

const COOKIE_NAME = 'bpt_rl'
const SECRET = process.env.RATE_LIMIT_SECRET || process.env.AIRTABLE_API_KEY || 'dev-secret'

const sign = (value: string): string =>
  createHmac('sha256', SECRET).update(value).digest('base64url')

export const makeRateLimitCookie = (now: number): string => {
  const value = String(now)
  return `${value}.${sign(value)}`
}

export const checkRateLimitCookie = (
  cookieHeader: string | null,
  minIntervalMs: number
): { allowed: boolean; retryAfterSec: number } => {
  if (!cookieHeader) return { allowed: true, retryAfterSec: 0 }
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const idx = c.indexOf('=')
      return idx === -1 ? [c.trim(), ''] : [c.slice(0, idx).trim(), c.slice(idx + 1)]
    })
  )
  const raw = cookies[COOKIE_NAME]
  if (!raw) return { allowed: true, retryAfterSec: 0 }
  const dotIdx = raw.lastIndexOf('.')
  if (dotIdx === -1) return { allowed: true, retryAfterSec: 0 }
  const value = raw.slice(0, dotIdx)
  const sig = raw.slice(dotIdx + 1)
  const expected = sign(value)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { allowed: true, retryAfterSec: 0 }
  }
  const last = Number(value)
  if (!Number.isFinite(last)) return { allowed: true, retryAfterSec: 0 }
  const elapsed = Date.now() - last
  if (elapsed < minIntervalMs) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((minIntervalMs - elapsed) / 1000),
    }
  }
  return { allowed: true, retryAfterSec: 0 }
}

export const rateLimitCookieOptions = (maxAgeSec: number): string =>
  `${COOKIE_NAME}=PLACEHOLDER; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSec}; Path=/`
