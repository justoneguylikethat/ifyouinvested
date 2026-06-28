import { ImageResponse } from 'next/og';
import { POPULAR_ASSETS } from '@/lib/assets';

export const runtime = 'edge';
export const alt = 'Historical Investment Return';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { asset: string } }) {
  const asset = POPULAR_ASSETS.find((a) => a.symbol.toLowerCase() === params.asset.toLowerCase()) || 
                POPULAR_ASSETS.find((a) => a.id.toLowerCase() === params.asset.toLowerCase());

  const name = asset ? asset.name : params.asset.toUpperCase();
  const symbol = asset ? asset.symbol : params.asset.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #0A0F1C, #111827)',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              marginBottom: '40px',
              boxShadow: '0 0 80px rgba(59, 130, 246, 0.4)',
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{symbol[0]}</span>
          </div>

          <h1 style={{ fontSize: '72px', fontWeight: '900', color: 'white', marginBottom: '20px', lineHeight: 1.1 }}>
            If You Invested In {name}
          </h1>

          <p style={{ fontSize: '36px', color: '#94a3b8', maxWidth: '800px', lineHeight: 1.4, margin: 0 }}>
            Calculate the exact historical return of {name} ({symbol}) over time and see what you missed out on.
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '2px' }}>
            IFYOUINVESTED.ONLINE
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
