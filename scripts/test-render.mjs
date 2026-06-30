import { renderVideoOnLambda, getRenderProgress, speculateFunctionName } from '@remotion/lambda/client';

process.env.REMOTION_AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
process.env.REMOTION_AWS_SECRET_ACCESS_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;


const REGION = 'us-east-2';
const BUCKET = 'remotionlambda-useast2-uevgmoavwb';
const SERVE_URL = 'https://remotionlambda-useast2-uevgmoavwb.s3.us-east-2.amazonaws.com/sites/4ny83noeq6/index.html';
const FN_NAME = speculateFunctionName({ remotionVersion: '4.0.484', memorySizeInMb: 2048, diskSizeInMb: 2048, timeoutInSeconds: 120 });

async function fullRender() {
  console.log('🚀 Starting fresh render...');
  console.log('  Function:', FN_NAME);
  console.log('  ServeURL:', SERVE_URL);
  console.log('  Region:', REGION);

  const { renderId, bucketName } = await renderVideoOnLambda({
    region: REGION,
    functionName: FN_NAME,
    composition: 'SimulationVideo',
    inputProps: {
      assets: ['AAPL', 'TSLA'],
      amount: 1000,
      startDate: '2020-01-01',
      endDate: '2026-06-29',
    },
    codec: 'h264',
    serveUrl: SERVE_URL,
    framesPerLambda: 200,
    maxRetries: 1,
  });

  console.log(`\n🎬 Render triggered: ${renderId} in bucket ${bucketName}`);

  let tries = 0;
  while (tries++ < 60) {
    await new Promise(r => setTimeout(r, 3000));
    const progress = await getRenderProgress({
      region: REGION,
      bucketName,
      renderId,
      functionName: FN_NAME,
    });

    const pct = Math.round((progress.overallProgress || 0) * 100);
    process.stdout.write(`\r  [${tries}] ${pct}% complete...`);

    if (progress.done) {
      console.log('\n\n✅ RENDER COMPLETE!');
      console.log('🔗 Output URL:', progress.outputFile);
      return;
    }
    if (progress.fatalErrorEncountered) {
      console.error('\n\n❌ FATAL RENDER ERROR:');
      console.error(progress.errors?.[0]?.message || 'unknown error');
      return;
    }
  }
  console.log('\n⏰ Timed out waiting for render');
}

fullRender().catch(e => {
  console.error('\n💥 Uncaught error:', e.message);
  process.exit(1);
});
