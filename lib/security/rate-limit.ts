type Entry = { count: number; resetAt: number };

const bucket = new Map<string, Entry>();

export function checkRateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const current = bucket.get(key);

  if (!current || current.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  bucket.set(key, current);
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
