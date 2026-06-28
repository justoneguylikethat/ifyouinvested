import { Asset, InvestmentResult, PricePoint } from './types';
import { getYahooHistoricalData } from './services/yahoo';
import { getCoinGeckoHistoricalData } from './services/coingecko';

export async function calculateInvestment(
  asset: Asset,
  amount: number,
  startDate: string,
  endDate: string
): Promise<InvestmentResult> {
  let history: PricePoint[] = [];

  try {
    let lookupSymbol = asset.symbol;
    if (asset.type === 'crypto' && !lookupSymbol.endsWith('-USD')) {
      lookupSymbol = `${lookupSymbol}-USD`;
    }
    history = await getYahooHistoricalData(lookupSymbol, startDate, endDate);
  } catch (error) {
    console.error(`Error fetching data for ${asset.symbol}:`, error);
    throw new Error(`Failed to fetch historical data for ${asset.name}`);
  }

  if (history.length < 2) {
    throw new Error(`Not enough historical data found for ${asset.name} in this date range.`);
  }

  const startPrice = history[0].price;
  const endPrice = history[history.length - 1].price;
  
  const sharesPurchased = amount / startPrice;
  const finalValue = sharesPurchased * endPrice;
  const totalReturn = finalValue - amount;
  const percentageReturn = (totalReturn / amount) * 100;

  // Calculate CAGR
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const years = Math.max(1, endYear - startYear + (new Date(endDate).getMonth() - new Date(startDate).getMonth()) / 12);
  const cagr = (Math.pow(finalValue / amount, 1 / years) - 1) * 100;

  // Scale the history to represent the portfolio value over time, not just the single asset price
  const portfolioHistory = history.map(point => ({
    date: point.date,
    price: point.price * sharesPurchased
  }));

  return {
    asset,
    initialInvestment: amount,
    startValue: startPrice,
    endValue: endPrice,
    finalValue,
    startDate,
    endDate,
    sharesPurchased,
    totalReturn,
    percentageReturn,
    cagr,
    history: portfolioHistory,
  };
}
