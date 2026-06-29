/**
 * Render Queue — limits concurrent Remotion renders and rate-limits per IP.
 * 
 * Why: Each Chromium render uses ~300-500MB RAM. Without limits,
 * simultaneous renders will OOM-crash the server (503 errors).
 * 
 * Limits:
 *  - MAX 2 renders running at the same time (configurable)
 *  - MAX queue depth of 8 waiting renders before rejecting
 *  - MAX 1 render per IP per 30 seconds
 */

const MAX_CONCURRENT = 2;
const MAX_QUEUE_DEPTH = 8;
const RATE_LIMIT_MS = 30_000; // 30 seconds per IP

let activeRenders = 0;
let queuedRenders = 0;

// IP → timestamp of last render start
const ipLastRender = new Map<string, number>();

// Clean up old IP rate limit entries every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_MS;
  for (const [ip, ts] of ipLastRender.entries()) {
    if (ts < cutoff) ipLastRender.delete(ip);
  }
}, 5 * 60 * 1000);

export type QueueResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: 429 | 503; message: string };

/**
 * Checks rate limit and queues work within the concurrency limit.
 * Returns the result of `work()` or an error response.
 */
export async function enqueueRender<T>(
  clientIp: string,
  work: () => Promise<T>
): Promise<QueueResult<T>> {
  // 1. Per-IP rate limit
  const lastRender = ipLastRender.get(clientIp);
  if (lastRender) {
    const elapsed = Date.now() - lastRender;
    if (elapsed < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
      return {
        ok: false,
        status: 429,
        message: `Rate limit: please wait ${waitSeconds}s before rendering again.`,
      };
    }
  }

  // 2. Queue depth check
  if (activeRenders >= MAX_CONCURRENT && queuedRenders >= MAX_QUEUE_DEPTH) {
    return {
      ok: false,
      status: 503,
      message: `Server is busy (${activeRenders} renders active, ${queuedRenders} queued). Please try again in a minute.`,
    };
  }

  // 3. Record this IP immediately to prevent duplicate rapid-fire requests
  ipLastRender.set(clientIp, Date.now());

  // 4. Wait for a slot if at concurrency limit
  if (activeRenders >= MAX_CONCURRENT) {
    queuedRenders++;
    await waitForSlot();
    queuedRenders--;
  }

  // 5. Run the render
  activeRenders++;
  try {
    const value = await work();
    return { ok: true, value };
  } catch (err) {
    throw err;
  } finally {
    activeRenders--;
    notifyWaiters();
  }
}

// ── Slot waiting mechanism ──────────────────────────────────────────────────

type Resolver = () => void;
const waiters: Resolver[] = [];

function waitForSlot(): Promise<void> {
  return new Promise<void>((resolve) => {
    waiters.push(resolve);
  });
}

function notifyWaiters(): void {
  if (waiters.length > 0 && activeRenders < MAX_CONCURRENT) {
    const next = waiters.shift();
    if (next) next();
  }
}

// ── Stats (for health endpoint) ────────────────────────────────────────────
export function getRenderQueueStats() {
  return { activeRenders, queuedRenders, maxConcurrent: MAX_CONCURRENT, maxQueueDepth: MAX_QUEUE_DEPTH };
}
