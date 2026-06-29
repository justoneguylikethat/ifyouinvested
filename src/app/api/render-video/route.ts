import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

export const maxDuration = 300; // Allow long-running renders

// Cache the bundle URL so we don't run Webpack on every request (prevents OOM crashes)
let cachedBundleUrl: string | null = null;

export async function POST(req: Request) {
  try {
    const props = await req.json();
    const sessionId = Math.random().toString(36).substring(7);
    const outPath = path.join(os.tmpdir(), `out-${sessionId}.mp4`);
    
    const compositionId = props.templateId ? 'StudioVideo' : 'SimulationVideo';
    console.log(`Rendering video for composition: ${compositionId}...`);
    
    // Bundle the remotion project only once
    if (!cachedBundleUrl) {
      console.log("Bundling Remotion project for the first time...");
      cachedBundleUrl = await bundle(path.join(process.cwd(), "src/remotion/index.ts"));
    }
    
    // Select the composition with props
    const composition = await selectComposition({
      serveUrl: cachedBundleUrl,
      id: compositionId,
      inputProps: props,
    });
    
    // Render the video with memory limits
    await renderMedia({
      composition,
      serveUrl: cachedBundleUrl,
      codec: 'h264',
      outputLocation: outPath,
      inputProps: props,
      concurrency: 1, // Limit concurrency to prevent OOM on small servers
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
    
    // Read the rendered video
    const videoBuffer = await fs.readFile(outPath);
    
    // Cleanup
    await fs.unlink(outPath).catch(console.error);
    
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="simulation.mp4"',
      },
    });

  } catch (error) {
    console.error("Failed to render video:", error);
    return NextResponse.json(
      { error: 'Failed to render video', details: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }, 
      { status: 500 }
    );
  }
}

