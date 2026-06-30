import { PricePoint } from '../types';
import { format } from 'date-fns';

export async function getYahooHistoricalData(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<PricePoint[]> {
  // Map conflicted meme tokens to correct Yahoo Finance suffix symbols
  const cleanSymbol = symbol.toUpperCase();
  if (cleanSymbol === 'PEPE' || cleanSymbol === 'PEPE-USD') {
    symbol = 'PEPE24478-USD';
  } else if (cleanSymbol === 'POPCAT' || cleanSymbol === 'POPCAT-USD') {
    symbol = 'POPCAT28782-USD';
  }

  // Determine optimal interval: daily resolution if date range is <= 90 days
  const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const interval = diffDays <= 90 ? '1d' : '1mo';

  let adjustedStartDate = new Date(startDate);
  if (diffDays <= 7) {
    // Lookback an extra 10 days to guarantee at least 2 trading days are covered (handles weekends/holidays)
    adjustedStartDate.setDate(adjustedStartDate.getDate() - 10);
  }
  const period1 = Math.floor(adjustedStartDate.getTime() / 1000);
  const period2 = Math.floor(new Date(endDate).getTime() / 1000);
  
  // Build URL for Yahoo Chart API
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}`;

  const response = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data.chart?.result?.[0];

  if (!result || !result.timestamp) {
    console.error(`Yahoo Finance Error for ${symbol}:`, data);
    return [];
  }

  const timestamps = result.timestamp;
  const adjCloses = result.indicators?.adjclose?.[0]?.adjclose || result.indicators?.quote?.[0]?.close;

  const pricePoints: PricePoint[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];
    const price = adjCloses[i];
    
    if (price !== null && price !== undefined) {
      pricePoints.push({
        date: format(new Date(ts * 1000), 'yyyy-MM-dd'),
        price: price,
      });
    }
  }

  return pricePoints;
}
