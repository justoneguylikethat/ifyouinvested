import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

// Fix for Yahoo Finance 2 error:
const yf = typeof yahooFinance === 'function' ? new (yahooFinance as any)() : yahooFinance;

// Revalidate every 60 seconds (Next.js App Router Cache)
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');
  
  if (!symbolsParam) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
  }

  // To prevent rate limits or timeout, limit to 50 at a time
  const symbols = symbolsParam.split(',').filter(Boolean).slice(0, 50);
  
  try {
    const results = await Promise.all(symbols.map(async (symbol) => {
      try {
        const quote = await yf.quote(symbol);
        
        // Fetch 30-day sparkline
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        const history = await yf.historical(symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });

        const sparkline = history.map(h => h.close);

        return {
          symbol: quote.symbol,
          name: quote.shortName || quote.longName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChangePercent,
          marketCap: quote.marketCap,
          volume: quote.regularMarketVolume,
          sector: quote.sector || 'N/A',
          type: quote.quoteType || 'UNKNOWN',
          sparkline
        };
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
        return null;
      }
    }));

    // Filter out any failed requests
    const validResults = results.filter(Boolean);

    return NextResponse.json({ results: validResults });
  } catch (error) {
    console.error("Global API error:", error);
    return NextResponse.json({ error: 'Failed to fetch asset details' }, { status: 500 });
  }
}
