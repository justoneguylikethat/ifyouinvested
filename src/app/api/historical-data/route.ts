import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const type = searchParams.get('type');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  let lookupSymbol = symbol;
  if (type === 'crypto' && !lookupSymbol.endsWith('-USD')) {
    lookupSymbol = `${lookupSymbol}-USD`;
  }

  // Fetch 10 years of daily data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 10);

  const period1 = Math.floor(startDate.getTime() / 1000);
  const period2 = Math.floor(endDate.getTime() / 1000);

  // Use interval=1d for daily data to calculate volatility accurately
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${lookupSymbol}?period1=${period1}&period2=${period2}&interval=1d`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error(`Yahoo API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result || !result.timestamp) {
      return NextResponse.json({ prices: [] });
    }

    const timestamps = result.timestamp;
    const adjCloses = result.indicators?.adjclose?.[0]?.adjclose || result.indicators?.quote?.[0]?.close;

    const prices = [];
    for (let i = 0; i < timestamps.length; i++) {
      const price = adjCloses[i];
      if (price !== null && price !== undefined) {
        prices.push({
          date: format(new Date(timestamps[i] * 1000), 'yyyy-MM-dd'),
          close: price,
        });
      }
    }

    return NextResponse.json({ prices });
  } catch (error: any) {
    console.error('Error in /api/historical-data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
