import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

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

  console.log('[render] No pre-built bundle found. Building Remotion bundle at runtime (this may take a moment)...');
  cachedBundleUrl = await bundle({
    entryPoint: path.join(process.cwd(), 'src/remotion/index.ts'),
    onProgress: (p) => process.stdout.write(`\r[render] Bundling... ${Math.round(p * 100)}%`),
  });
  process.stdout.write('\n');
  console.log('[render] Runtime bundle complete:', cachedBundleUrl);
  return cachedBundleUrl;
}

export async function POST(req: Request) {
  try {
    const props = await req.json();
    const sessionId = Math.random().toString(36).substring(7);
    const outPath = path.join(os.tmpdir(), `out-${sessionId}.mp4`);
    
    const compositionId = props.templateId ? 'StudioVideo' : 'SimulationVideo';
    console.log(`[render] Rendering composition: ${compositionId}...`);
    
    const serveUrl = await getBundleUrl();
    
    // Select the composition with props
    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps: props,
    });
    
    // Render the video with memory-saving settings
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
          '--js-flags=--max-old-space-size=512'
        ],
        executablePath: process.env.NODE_ENV === 'production' ? '/usr/bin/chromium' : undefined,
      },
    });
    
    // Read the rendered video and return it
    const videoBuffer = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(console.error);
    
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="simulation.mp4"',
      },
    });

  } catch (error) {
    console.error('[render] Failed to render video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to render video', 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
