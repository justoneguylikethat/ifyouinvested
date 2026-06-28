import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const title = searchParams.get('title') || 'Invested Now';
    const subtitle = searchParams.get('subtitle') || 'Time Travel With Your Money';
    const amount = searchParams.get('amount');
    const asset = searchParams.get('asset');
    const roi = searchParams.get('roi');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0B1220',
            fontFamily: 'sans-serif',
            backgroundImage: 'linear-gradient(to bottom right, #0B1220, #0f172a)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          {/* Logo or App Name */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              fontSize: '32px',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '-1px',
            }}
          >
            Invested.today
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '20px',
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>

            {roi && (
              <div
                style={{
                  fontSize: '96px',
                  fontWeight: 900,
                  color: roi.startsWith('-') ? '#f87171' : '#34d399',
                  marginBottom: '20px',
                }}
              >
                {roi.startsWith('-') ? '' : '+'}{roi}
              </div>
            )}

            <p
              style={{
                fontSize: '36px',
                color: '#94a3b8',
                maxWidth: '800px',
                fontWeight: 500,
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
