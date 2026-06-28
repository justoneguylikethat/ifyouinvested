import { Asset, PricePoint } from '../types';
import { format } from 'date-fns';

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function getAlphaVantageHistoricalData(
  asset: Asset,
  startDate: string,
  endDate: string
): Promise<PricePoint[]> {
  const isCrypto = asset.type === 'crypto';
  
  let url = "";
  if (isCrypto) {
    url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=${asset.symbol}&market=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
  } else {
    url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${asset.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  }
  
  const response = await fetch(url, { next: { revalidate: 86400 } });
  
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }

  const data = await response.json();
  
  const timeSeries = isCrypto 
    ? data['Time Series (Digital Currency Monthly)']
    : data['Monthly Adjusted Time Series'];
  
  if (!timeSeries) {
    // Possibly rate limited or invalid symbol
    console.error(`Alpha Vantage Error for ${asset.symbol}:`, data);
    if (data['Information'] && data['Information'].includes('rate limit')) {
        throw new Error(`API Rate Limit Exceeded for ${asset.symbol}. Please try again later.`);
    }
    return [];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const pricePoints: PricePoint[] = [];

  for (const [dateStr, values] of Object.entries(timeSeries)) {
    const date = new Date(dateStr);
    if (date >= start && date <= end) {
      const priceKey = isCrypto ? '4b. close (USD)' : '5. adjusted close';
      const priceStr = (values as any)[priceKey];
      
      // Fallback for crypto if 4b is missing, sometimes Alpha Vantage changes keys
      let price = parseFloat(priceStr);
      if (isNaN(price) && isCrypto) {
        price = parseFloat((values as any)['4a. close (USD)'] || (values as any)['4. close']);
      }

      if (!isNaN(price)) {
        pricePoints.push({
          date: dateStr,
          price,
        });
      }
    }
  }

  // Alpha Vantage returns data descending (newest first). 
  // Reverse to make it ascending (oldest first).
  return pricePoints.reverse();
}
