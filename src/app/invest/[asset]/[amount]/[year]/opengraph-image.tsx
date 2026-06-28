import { ImageResponse } from 'next/og';
import { POPULAR_ASSETS } from '@/lib/assets';
import { calculateInvestment } from '@/lib/calculator';

export const runtime = 'nodejs'; // Use Node.js runtime for calculating since it hits external API
export const alt = 'Historical Investment Return Calculation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { asset: string, amount: string, year: string } }) {
  const asset = POPULAR_ASSETS.find((a) => a.symbol.toLowerCase() === params.asset.toLowerCase()) || 
                POPULAR_ASSETS.find((a) => a.id.toLowerCase() === params.asset.toLowerCase());

  const name = asset ? asset.name : params.asset.toUpperCase();
  const symbol = asset ? asset.symbol : params.asset.toUpperCase();
  
  const amount = parseFloat(params.amount) || 1000;
  const year = parseInt(params.year) || 2010;
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  let finalValueStr = "Loading...";
  let isProfitable = true;
  let multiplier = "";

  try {
    if (asset) {
      const today = new Date().toISOString().split('T')[0];
      const result = await calculateInvestment(asset, amount, `${year}-01-01`, today);
      finalValueStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.finalValue);
      isProfitable = result.finalValue >= amount;
      multiplier = `(${result.percentageReturn >= 0 ? '+' : ''}${result.percentageReturn.toFixed(0)}%)`;
    }
  } catch (error) {
    console.error("OG Image Calculation Error:", error);
    finalValueStr = "Calculate Now";
    multiplier = "";
  }

  const color = isProfitable ? '#10b981' : '#ef4444'; // emerald or red

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
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '30px' }}>
             <p style={{ fontSize: '42px', color: '#94a3b8', margin: 0 }}>
               If you invested <strong style={{ color: 'white' }}>{formattedAmount}</strong> in
             </p>
          </div>

          <h1 style={{ fontSize: '84px', fontWeight: '900', color: 'white', margin: '0 0 20px 0', lineHeight: 1 }}>
            {name} ({symbol})
          </h1>

          <p style={{ fontSize: '42px', color: '#94a3b8', margin: '0 0 40px 0' }}>
            in <strong style={{ color: 'white' }}>{year}</strong>, today it would be worth:
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${color}`,
              borderRadius: '40px',
              padding: '30px 80px',
              boxShadow: `0 0 60px ${color}33`,
            }}
          >
            <p style={{ fontSize: '96px', fontWeight: '900', color: color, margin: 0, lineHeight: 1 }}>
              {finalValueStr}
            </p>
          </div>
          
          {multiplier && (
             <p style={{ fontSize: '32px', fontWeight: 'bold', color: color, marginTop: '20px' }}>
                {multiplier}
             </p>
          )}

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
