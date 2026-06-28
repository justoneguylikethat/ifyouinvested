import { Metadata } from 'next';
import { POPULAR_ASSETS } from '@/lib/assets';
import { constructMetadata } from '@/lib/seo';
import { Simulator } from '@/components/simulator';
import { calculateInvestment } from '@/lib/calculator';

interface PageProps {
  params: {
    asset: string;
    amount: string;
    year: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const asset = POPULAR_ASSETS.find(a => a.symbol.toLowerCase() === params.asset.toLowerCase()) || 
               { symbol: params.asset.toUpperCase(), name: params.asset.toUpperCase(), type: 'stock' as const };
  
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(params.amount));
  
  let title = `If I invested ${formattedAmount} in ${asset.name} in ${params.year} | Invested Now`;
  let description = `Discover exactly how much ${formattedAmount} invested in ${asset.name} (${asset.symbol}) in ${params.year} would be worth today.`;

  try {
    const startDate = `${params.year}-01-01`;
    const endDate = new Date().toISOString().split('T')[0];
    const result = await calculateInvestment(asset, Number(params.amount), startDate, endDate);
    
    const finalValueFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.finalValue);
    const roiFormatted = result.percentageReturn.toFixed(0);
    
    title = `What if I invested ${formattedAmount} in ${asset.name} in ${params.year}? (Worth ${finalValueFormatted} Today)`;
    description = `An investment of ${formattedAmount} in ${asset.name} (${asset.symbol}) in ${params.year} would be worth ${finalValueFormatted} today. This represents a ${roiFormatted}% return on investment.`;
  } catch (error) {
    // Silently fallback to default metadata if the calculation fails (e.g. data not available yet)
    console.error('Metadata calc error:', error);
  }

  return constructMetadata({
    title,
    description,
    image: `/api/og?title=${encodeURIComponent(`What if I invested ${formattedAmount} in ${asset.symbol}?`)}`,
  });
}

export default async function SimulationPage({ params }: PageProps) {
  const asset = POPULAR_ASSETS.find(a => a.symbol.toLowerCase() === params.asset.toLowerCase()) || 
               { symbol: params.asset.toUpperCase(), name: params.asset.toUpperCase(), type: 'stock' as const };
  
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(params.amount));

  let initialResults = undefined;
  let seoText = null;

  try {
    const startDate = `${params.year}-01-01`;
    const endDate = new Date().toISOString().split('T')[0];
    const result = await calculateInvestment(asset, Number(params.amount), startDate, endDate);
    initialResults = [result];
    
    const finalValueFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.finalValue);
    const roiFormatted = result.percentageReturn.toFixed(2);
    const profitFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.totalReturn);

    seoText = (
      <div className="max-w-3xl mx-auto mt-12 mb-8 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Investment Return for {asset.name} from {params.year} to Today</h2>
        <p className="text-lg text-slate-300 leading-relaxed">
          If you had invested <strong className="text-white">{formattedAmount}</strong> in {asset.name} ({asset.symbol}) on January 1st, {params.year}, 
          your investment would be worth <strong className="text-emerald-400">{finalValueFormatted}</strong> today. 
          This is a total profit of <strong className="text-emerald-400">{profitFormatted}</strong>, representing a <strong className="text-emerald-400">{roiFormatted}%</strong> return on your initial investment.
        </p>
      </div>
    );
  } catch (error) {
    console.error('Page calc error:', error);
  }

  return (
    <>
      {seoText}
      <Simulator 
        title={`What if you invested ${formattedAmount} in ${asset.name}?`}
        subtitle={`See exactly how your ${params.year} investment in ${asset.name} would have performed.`}
        initialResults={initialResults}
      />
    </>
  );
}
