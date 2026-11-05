import type { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(limit: number = 60, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = requestCounts.get(ip);

    if (!entry || now > entry.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again in a minute.',
        retryAfterMs: entry.resetTime - now
      });
    }

    entry.count += 1;
    next();
  };
}

// SSRF URL validator for API Playground
export function validateSafeUrl(rawUrl: string, allowedDomains: string[]): { safe: boolean; reason?: string; urlObj?: URL } {
  try {
    const parsed = new URL(rawUrl);

    // Only allow http and https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: `Disallowed protocol: ${parsed.protocol}. Only http and https are allowed.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, private IPs, loopbacks
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return { safe: false, reason: 'Access to loopback and local addresses is blocked for security (SSRF prevention).' };
    }

    // Block Cloud metadata services (AWS, GCP, Azure, DO)
    if (
      hostname === '169.254.169.254' ||
      hostname === 'metadata.google.internal' ||
      hostname.includes('metadata') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return { safe: false, reason: 'Access to private cloud metadata and internal subnets is strictly blocked.' };
    }

    // Domain check if configured (if '*' is allowed or matched in domain whitelist)
    const isDomainAllowed = allowedDomains.includes('*') || 
      allowedDomains.some(d => hostname === d || hostname.endsWith('.' + d));

    if (!isDomainAllowed && allowedDomains.length > 0 && !allowedDomains.includes('*')) {
      return { 
        safe: false, 
        reason: `Domain '${hostname}' is not in the allowed destination list. Allowed: ${allowedDomains.join(', ')}` 
      };
    }

    return { safe: true, urlObj: parsed };
  } catch {
    return { safe: false, reason: 'Malformed or invalid URL string.' };
  }
}

// Request logger middleware
export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}
