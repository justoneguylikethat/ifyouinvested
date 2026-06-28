import { NextResponse } from 'next/server';
import { Asset } from '@/lib/types';
import { POPULAR_ASSETS } from '@/lib/assets';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const typeFilter = searchParams.get('type')?.split(',');

  if (!q) {
    let results = POPULAR_ASSETS;
    if (typeFilter) {
      results = results.filter(a => typeFilter.includes(a.type));
    }
    return NextResponse.json({ results });
  }

  const query = q.toLowerCase();
  
  // 1. Search our popular assets (stocks + crypto)
  let localResults = POPULAR_ASSETS.filter(a => 
    a.symbol.toLowerCase().includes(query) || 
    a.name.toLowerCase().includes(query)
  );
  if (typeFilter) {
    localResults = localResults.filter(a => typeFilter.includes(a.type));
  }

  let yhAssets: Asset[] = [];

  try {
    const yhRes = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (yhRes.ok) {
      const yhData = await yhRes.json();
      yhAssets = (yhData.quotes || [])
        .filter((q: any) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'CRYPTOCURRENCY')
        .slice(0, 15)
        .map((q: any) => {
          // If it's a crypto from Yahoo, it often ends in -USD (e.g. DOGE-USD).
          // We can clean it up for display but keep the internal symbol correct.
          let cleanSymbol = q.symbol.toUpperCase();
          if (q.quoteType === 'CRYPTOCURRENCY' && cleanSymbol.endsWith('-USD')) {
            cleanSymbol = cleanSymbol.replace('-USD', '');
          }
          return {
            symbol: cleanSymbol,
            name: q.shortname || q.longname || q.symbol,
            type: q.quoteType === 'CRYPTOCURRENCY' ? 'crypto' : (q.quoteType === 'ETF' ? 'etf' : 'stock' as const)
          };
        });
    }

    if (typeFilter) {
      yhAssets = yhAssets.filter(a => typeFilter.includes(a.type));
    }
  } catch (err) {
    console.error("Search API error", err);
  }

  // Merge results: Local -> Yahoo
  const allResults = [...localResults, ...yhAssets];
  
  // Deduplicate by symbol + type combo
  const uniqueResults = allResults.filter((asset, index, self) =>
    index === self.findIndex((t) => t.symbol === asset.symbol && t.type === asset.type)
  );

  return NextResponse.json({ results: uniqueResults.slice(0, 20) });
}
