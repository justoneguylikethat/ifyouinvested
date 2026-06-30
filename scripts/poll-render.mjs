import { getRenderProgress } from '@remotion/lambda/client';

// Credentials are read from env vars: REMOTION_AWS_ACCESS_KEY_ID / REMOTION_AWS_SECRET_ACCESS_KEY

const params = {
  region: 'us-east-2',
  bucketName: 'remotionlambda-useast2-uevgmoavwb',
  renderId: 'oh3is78hiy',
  functionName: 'remotion-render-4-0-484-mem2048mb-disk2048mb-120sec',
};

async function poll() {
  let tries = 0;
  while (tries++ < 40) {
    const progress = await getRenderProgress(params);
    const pct = Math.round((progress.overallProgress || 0) * 100);
    console.log(`[${tries}] Progress: ${pct}% | Done: ${progress.done} | Fatal: ${progress.fatalErrorEncountered}`);

    if (progress.done) {
      console.log('\n✅ RENDER COMPLETE!');
      console.log('Output URL:', progress.outputFile);
      break;
    }
    if (progress.fatalErrorEncountered) {
      console.error('\n❌ FATAL ERROR:', progress.errors?.[0]?.message || 'unknown');
      break;
    }
    await new Promise(r => setTimeout(r, 2500));
  }
}

poll().catch(e => console.error('ERROR:', e.message));
