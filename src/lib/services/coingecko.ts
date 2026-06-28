import { PricePoint } from '../types';
import { format } from 'date-fns';

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

export async function getCoinGeckoHistoricalData(
  coinId: string,
  startDate: string,
  endDate: string
): Promise<PricePoint[]> {
  const startUnix = Math.floor(new Date(startDate).getTime() / 1000);
  const endUnix = Math.floor(new Date(endDate).getTime() / 1000);

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${startUnix}&to=${endUnix}`;
  
  const headers: Record<string, string> = {};
  if (COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
  }

  // Use a cache bust query param if we need to retry without key
  let response = await fetch(url, { headers, next: { revalidate: 3600 } });
  
  // If unauthorized with key, try without key
  if (response.status === 401 && COINGECKO_API_KEY) {
    response = await fetch(url + "&fallback=true", { next: { revalidate: 3600 } });
  }

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.prices || data.prices.length === 0) {
    return [];
  }

  // Filter to roughly monthly data to match Polygon (or weekly if short)
  const sampledData: PricePoint[] = [];
  let lastMonth = -1;

  for (const [timestamp, price] of data.prices) {
    const date = new Date(timestamp);
    const month = date.getMonth();
    
    // Simple sampling: take the first price of each month
    if (month !== lastMonth) {
      sampledData.push({
        date: format(date, 'yyyy-MM-dd'),
        price: price,
      });
      lastMonth = month;
    }
  }

  return sampledData;
}
