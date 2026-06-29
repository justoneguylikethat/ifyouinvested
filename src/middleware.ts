import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting map
// Note: In serverless environments, this will reset per isolate/cold start,
// but it is still highly effective against localized burst attacks.
const ipMap = new Map<string, { count: number; lastReset: number }>();

// Configure rate limits
const RATE_LIMIT = 50; // Max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

export function middleware(request: NextRequest) {
  // Apply rate limiting primarily to API routes to prevent backend abuse
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    let requestData = ipMap.get(ip);
    
    // Reset if window has passed or no data exists
    if (!requestData || requestData.lastReset < windowStart) {
      requestData = { count: 0, lastReset: now };
    }

    if (requestData.count >= RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too Many Requests', 
          message: 'You have exceeded the rate limit. Please try again later.' 
        }), 
        {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          },
        }
      );
    }

    // Increment request count
    requestData.count += 1;
    ipMap.set(ip, requestData);
    
    // Cleanup periodically to prevent memory leaks in long-running processes
    if (ipMap.size > 2000) {
      const entries = Array.from(ipMap.entries());
      for (const [key, val] of entries) {
         if (val.lastReset < windowStart) {
            ipMap.delete(key);
         }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
