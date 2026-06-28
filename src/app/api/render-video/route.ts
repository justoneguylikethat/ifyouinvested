import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// Allow long-running renders (up to 5 mins if deployed)
export const maxDuration = 300; 

export async function POST(req: Request) {
  try {
    const props = await req.json();
    
    // Create a temporary file for props
    const tmpDir = os.tmpdir();
    const sessionId = Math.random().toString(36).substring(7);
    const propsPath = path.join(tmpDir, `props-${sessionId}.json`);
    const outPath = path.join(tmpDir, `out-${sessionId}.mp4`);
    
    await fs.writeFile(propsPath, JSON.stringify(props));

    console.log("Rendering video...");
    // Run remotion CLI
    const { stdout, stderr } = await execAsync(`npx remotion render src/remotion/index.ts SimulationVideo "${outPath}" --props="${propsPath}"`);
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    // Read the rendered video
    const videoBuffer = await fs.readFile(outPath);
    
    // Cleanup
    await fs.unlink(propsPath).catch(console.error);
    await fs.unlink(outPath).catch(console.error);
    
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="simulation.mp4"',
      },
    });

  } catch (error) {
    console.error("Failed to render video:", error);
    return NextResponse.json({ error: 'Failed to render video' }, { status: 500 });
  }
}
