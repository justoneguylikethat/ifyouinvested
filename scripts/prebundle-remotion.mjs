/**
 * Pre-bundle the Remotion composition at build time.
 * Bundles to a TEMP directory first, then copies to public/remotion-bundle/
 * so the publicPath doesn't cause recursive self-copying.
 */

import { bundle } from '@remotion/bundler';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const publicOutDir = path.join(projectRoot, 'public', 'remotion-bundle');

// Bundle to a temp directory to avoid recursive self-copying
const tmpDir = path.join(os.tmpdir(), `remotion-build-${Date.now()}`);

// Clean old public bundle
if (fs.existsSync(publicOutDir)) {
  fs.rmSync(publicOutDir, { recursive: true, force: true });
  console.log('[prebundle] Cleaned old Remotion bundle.');
}

console.log('[prebundle] Bundling Remotion compositions to temp dir...');
console.log('[prebundle] Temp dir:', tmpDir);

try {
  const bundleUrl = await bundle({
    entryPoint: path.join(projectRoot, 'src/remotion/index.ts'),
    outDir: tmpDir,
    publicPath: '/remotion-bundle/',
    onProgress: (progress) => {
      process.stdout.write(`\r[prebundle] Bundling... ${Math.round(progress * 100)}%`);
    },
  });
  process.stdout.write('\n');
  console.log('[prebundle] Bundle written to temp dir:', tmpDir);
  
  // Copy from temp dir to public/remotion-bundle/
  fs.cpSync(tmpDir, publicOutDir, { recursive: true });
  console.log('[prebundle] ✅ Copied bundle to:', publicOutDir);
  
  // Clean temp dir
  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('[prebundle] Cleaned up temp dir.');

} catch (err) {
  process.stdout.write('\n');
  console.error('[prebundle] ❌ Bundling failed:', err.message);
  // Clean up temp if it exists
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
  // Don't fail the entire build
  process.exit(0);
}
