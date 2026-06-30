import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { enqueueRender } from '@/lib/render-queue';
import { 
  renderVideoOnLambda, 
  getRenderProgress, 
  speculateFunctionName 
} from '@remotion/lambda/client';

export const maxDuration = 300; // Allow long-running renders

// Cache the bundle URL in memory so we only bundle once per server lifecycle
let cachedBundleUrl: string | null = null;

async function getBundleUrl(): Promise<string> {
  // 1. Use pre-built static bundle in public/ directory (set during `npm run build`)
  const staticBundlePath = path.join(process.cwd(), 'public', 'remotion-bundle', 'index.html');
  try {
    await fs.access(staticBundlePath);
    const bundleUrl = path.join(process.cwd(), 'public', 'remotion-bundle');
    console.log('[render] Using pre-built static bundle:', bundleUrl);
    return bundleUrl;
  } catch {
    // Static bundle not available — fall through to runtime bundling
  }

  // 2. Runtime bundle (cached in memory per server instance)
  if (cachedBundleUrl) {
    console.log('[render] Using cached runtime bundle.');
    return cachedBundleUrl;
  }

  console.log('[render] No pre-built bundle found. Building Remotion bundle at runtime...');
  cachedBundleUrl = await bundle({
    entryPoint: path.join(process.cwd(), 'src/remotion/index.ts'),
    onProgress: (p) => process.stdout.write(`\r[render] Bundling... ${Math.round(p * 100)}%`),
  });
  process.stdout.write('\n');
  console.log('[render] Runtime bundle complete:', cachedBundleUrl);
  return cachedBundleUrl;
}

export async function POST(req: Request) {
  // Trim environment variables to prevent TypeError [ERR_INVALID_CHAR] in authorization header
  if (process.env.REMOTION_AWS_ACCESS_KEY_ID) {
    process.env.REMOTION_AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID.trim();
  }
  if (process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
    process.env.REMOTION_AWS_SECRET_ACCESS_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY.trim();
  }
  if (process.env.AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID.trim();
  }
  if (process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY.trim();
  }
  if (process.env.REMOTION_AWS_SERVE_URL) {
    process.env.REMOTION_AWS_SERVE_URL = process.env.REMOTION_AWS_SERVE_URL.trim();
  }
  if (process.env.REMOTION_AWS_REGION) {
    process.env.REMOTION_AWS_REGION = process.env.REMOTION_AWS_REGION.trim();
  }

  // Extract client IP for rate limiting
  const forwarded = req.headers.get('x-forwarded-for');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  const isAwsConfigured = !!(
    (process.env.REMOTION_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID) && 
    (process.env.REMOTION_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY) &&
    process.env.REMOTION_AWS_SERVE_URL
  );

  const result = await enqueueRender(clientIp, async () => {
    const props = await req.json();
    const compositionId = props.templateId ? 'StudioVideo' : 'SimulationVideo';
    console.log(`[render] Rendering composition: ${compositionId} for IP: ${clientIp}`);

    if (isAwsConfigured) {
      console.log('[render] Running render on AWS Lambda...');
      const region = (process.env.REMOTION_AWS_REGION || 'us-east-1') as any;
      const functionName = speculateFunctionName({
        remotionVersion: '4.0.484',
        memorySizeInMb: 2048,
        diskSizeInMb: 2048,
        timeoutInSeconds: 120,
      });

      // 1. Trigger the render on Lambda
      // Video is 600-960 frames. framesPerLambda=200 → max 5 concurrent lambdas,
      // well under the AWS default account limit of 10. Increase this limit via
      // AWS Service Quotas if you need higher throughput.
      const { renderId, bucketName } = await renderVideoOnLambda({
        region,
        functionName,
        composition: compositionId,
        inputProps: props,
        codec: 'h264',
        serveUrl: process.env.REMOTION_AWS_SERVE_URL!,
        framesPerLambda: 200,
        maxRetries: 1,
      });

      // 2. Poll for progress until complete
      let progress = await getRenderProgress({
        region,
        bucketName,
        renderId,
        functionName,
      });

      while (!progress.done && !progress.fatalErrorEncountered) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        progress = await getRenderProgress({
          region,
          bucketName,
          renderId,
          functionName,
        });
      }

      if (progress.fatalErrorEncountered) {
        throw new Error(`Lambda render failed: ${progress.errors[0]?.message || 'Unknown error'}`);
      }

      if (!progress.outputUrl) {
        throw new Error('Lambda render complete but no outputUrl returned.');
      }

      console.log(`[render] AWS Lambda render complete! Output: ${progress.outputUrl}`);

      // 3. Fetch finished video and return buffer
      const videoRes = await fetch(progress.outputUrl);
      if (!videoRes.ok) {
        throw new Error(`Failed to fetch rendered video from S3: ${videoRes.statusText}`);
      }
      const arrayBuffer = await videoRes.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    // -- LOCAL RUNTIME RENDER FALLBACK --
    const sessionId = Math.random().toString(36).substring(7);
    const outPath = path.join(os.tmpdir(), `out-${sessionId}.mp4`);
    const serveUrl = await getBundleUrl();

    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps: props,
    });

    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outPath,
      inputProps: props,
      concurrency: 1,
      chromiumOptions: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--single-process',
          '--no-zygote',
          '--js-flags=--max-old-space-size=512',
        ],
        executablePath:
          process.env.NODE_ENV === 'production' ? '/usr/bin/chromium' : undefined,
      },
    });

    const videoBuffer = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(console.error);
    return videoBuffer;
  }, isAwsConfigured);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }

  return new NextResponse(result.value, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': 'attachment; filename="simulation.mp4"',
    },
  });
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Render server is warm' });
}

