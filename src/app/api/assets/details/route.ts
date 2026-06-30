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

  // Map conflicted meme tokens to correct Yahoo Finance symbols and track original requested name
  const originalMappings = new Map<string, string>();
  const symbols = symbolsParam.split(',').filter(Boolean).slice(0, 50).map(s => {
    const upper = s.toUpperCase();
    if (upper === 'PEPE' || upper === 'PEPE-USD') {
      originalMappings.set('PEPE24478-USD', s);
      return 'PEPE24478-USD';
    }
    if (upper === 'POPCAT' || upper === 'POPCAT-USD') {
      originalMappings.set('POPCAT28782-USD', s);
      return 'POPCAT28782-USD';
    }
    return s;
  });
  
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
        const cleanSymbol = originalMappings.get(quote.symbol) || quote.symbol;

        return {
          symbol: cleanSymbol,
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
