export type AssetType = 'stock' | 'crypto' | 'etf' | 'index' | 'commodity';

export interface Asset {
  id?: string; // Internal ID for coingecko
  symbol: string;
  name: string;
  type: AssetType;
  logoUrl?: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface InvestmentResult {
  asset: Asset;
  initialInvestment: number;
  startValue: number; // Price of 1 share at start
  endValue: number; // Price of 1 share at end
  finalValue: number; // Value of initialInvestment at end
  startDate: string;
  endDate: string;
  sharesPurchased: number;
  totalReturn: number; // Value difference (finalValue - initialInvestment)
  percentageReturn: number; // Percentage
  cagr: number; // Compound Annual Growth Rate
  history: PricePoint[]; // For chart
}
