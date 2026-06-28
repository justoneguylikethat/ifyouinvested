import { PricePoint } from '../types';
import { format } from 'date-fns';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

export async function getPolygonHistoricalData(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<PricePoint[]> {
  // Fetch monthly aggregates to reduce data size for long periods
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/month/${startDate}/${endDate}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
  
  const response = await fetch(url, { next: { revalidate: 86400 } });
  
  if (!response.ok) {
    throw new Error(`Polygon API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((result: any) => ({
    date: format(new Date(result.t), 'yyyy-MM-dd'),
    price: result.c, // Closing price
  }));
}
