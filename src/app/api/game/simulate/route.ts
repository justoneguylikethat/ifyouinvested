import { NextResponse } from 'next/server';
import { getYahooHistoricalData } from '@/lib/services/yahoo';
import { PricePoint } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startYear, endYear, initialCash, holdings } = body;

    const startDate = `${startYear}-01-01`;
    const endDate = `${endYear}-12-31`;

    let totalCashAllocated = 0;
    const assetsData: { symbol: string; shares: number; history: PricePoint[] }[] = [];

    // Fetch data for each holding
    for (const holding of holdings) {
      const allocatedAmount = (holding.weight / 100) * initialCash;
      totalCashAllocated += allocatedAmount;

      let lookupSymbol = holding.symbol;
      if (!lookupSymbol.endsWith('-USD') && ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA'].includes(lookupSymbol)) {
        lookupSymbol = `${lookupSymbol}-USD`;
      }

      try {
        const history = await getYahooHistoricalData(lookupSymbol, startDate, endDate, '1mo');
        if (history && history.length > 0) {
          const startPrice = history[0].price;
          const shares = allocatedAmount / startPrice;
          assetsData.push({ symbol: holding.symbol, shares, history });
        }
      } catch (err) {
        console.error(`Error fetching game data for ${lookupSymbol}:`, err);
        // If an asset fails (e.g. didn't exist), just ignore it and return cash
      }
    }

    const uninvestedCash = initialCash - totalCashAllocated;

    // Combine into a single portfolio timeline (monthly)
    // We will align by dates
    const timelineMap = new Map<string, number>(); // date -> portfolio value
    
    // Initialize map with dates from the first asset (or just generate dates)
    const allDates = new Set<string>();
    assetsData.forEach(asset => {
      asset.history.forEach(pt => allDates.add(pt.date));
    });

    const sortedDates = Array.from(allDates).sort();

    const timeline = sortedDates.map(date => {
      let investedValue = 0;
      assetsData.forEach(asset => {
        // find closest price for this date, or previous known price
        const pt = asset.history.find(p => p.date === date);
        if (pt) {
          investedValue += pt.price * asset.shares;
        } else {
          // Fallback to previous known price if missing
          const prevPts = asset.history.filter(p => p.date < date);
          if (prevPts.length > 0) {
            investedValue += prevPts[prevPts.length - 1].price * asset.shares;
          }
        }
      });

      return {
        date,
        value: investedValue + uninvestedCash
      };
    });

    if (timeline.length === 0) {
      // Fallback if no assets selected or all failed
      timeline.push({ date: startDate, value: initialCash });
      timeline.push({ date: endDate, value: initialCash });
    }

    return NextResponse.json({ timeline, uninvestedCash });
  } catch (error) {
    console.error('Simulation API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
