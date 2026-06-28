import { PricePoint } from '../types';
import { format } from 'date-fns';

export async function getYahooHistoricalData(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<PricePoint[]> {
  const period1 = Math.floor(new Date(startDate).getTime() / 1000);
  const period2 = Math.floor(new Date(endDate).getTime() / 1000);
  
  // Build URL for Yahoo Chart API
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1mo`;

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
