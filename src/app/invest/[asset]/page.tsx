import { Metadata } from 'next';
import { POPULAR_ASSETS } from '@/lib/assets';
import { constructMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';

interface PageProps {
  params: {
    asset: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const asset = POPULAR_ASSETS.find(a => a.symbol.toLowerCase() === params.asset.toLowerCase()) || 
               { symbol: params.asset.toUpperCase(), name: params.asset.toUpperCase(), type: 'stock' as const };
  
  const title = `${asset.name} Historical Returns | Invested Now`;
  const description = `Analyze the historical return on investment (ROI) for ${asset.name}. Simulate how much money you could have made.`;

  return constructMetadata({
    title,
    description,
    image: `/api/og?title=${encodeURIComponent(title)}`,
    alternates: {
      canonical: `https://invested.today/invest/${asset.symbol.toLowerCase()}`,
    }
  });
}

export default function AssetIndexPage({ params }: PageProps) {
  const asset = POPULAR_ASSETS.find(a => a.symbol.toLowerCase() === params.asset.toLowerCase()) || 
               { symbol: params.asset.toUpperCase(), name: params.asset.toUpperCase(), type: 'stock' as const };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `${asset.name} Investment Simulator`,
    "description": `Historical return and ROI simulator for ${asset.name} (${asset.symbol}).`,
    "provider": {
      "@type": "Organization",
      "name": "Invested-Now",
      "url": "https://invested.today"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the historical return of ${asset.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The historical return of ${asset.name} varies depending on your holding period. You can use our simulator to calculate the exact ROI for any time frame.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I simulate a ${asset.name} investment?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Simply enter your initial investment amount and your start/end dates into our calculator. The simulator will instantly show you how your money would have grown with ${asset.name}.`
        }
      }
    ]
  };

  return (
    <>
      <JsonLd data={financialProductSchema} />
      <JsonLd data={faqSchema} />
      
      <main className="min-h-screen bg-[#0B1220] flex flex-col items-center p-6 text-center">
        {/* Minimalist Header Section - Drives Conversions */}
        <div className="max-w-md w-full min-h-[80vh] flex flex-col justify-center items-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-none">
            <span className="text-blue-500 block">{asset.name}</span>
            <span className="text-white block">Historical</span>
            <span className="text-white block">Returns</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            Welcome to the {asset.name} historical investment simulator. Choose a time and an amount to see exactly how your money would have grown.
          </p>
          
          <a 
            href={`/invest/${asset.symbol.toLowerCase()}/1000/2020`}
            className="bg-blue-600 hover:bg-blue-500 text-white w-full py-4 rounded-xl font-bold text-xl transition-all inline-block shadow-lg shadow-blue-500/20"
          >
            Run a Simulation
          </a>
        </div>

        {/* Below the Fold SEO Content - Drives Organic Traffic */}
        <div className="max-w-4xl w-full text-left py-16 border-t border-slate-800">
          <h2 className="text-3xl font-bold text-white mb-6">About {asset.name} ({asset.symbol})</h2>
          <div className="prose prose-invert prose-lg text-slate-400 max-w-none">
            <p>
              {asset.name} has been one of the most closely watched assets in the market. Understanding its historical price action is crucial for investors looking to analyze past performance and contextualize future growth.
            </p>
            <p>
              Whether you are backtesting a dollar-cost averaging (DCA) strategy, analyzing a lump-sum investment during a bear market, or simply curious about the "what ifs" of investing, our simulator provides accurate, historically-adjusted ROI calculations for {asset.symbol}.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6 text-slate-400">
            <div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">What is the historical return of {asset.name}?</h3>
              <p>The historical return of {asset.name} varies depending on your holding period. You can use our simulator to calculate the exact ROI for any time frame.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">How do I simulate a {asset.name} investment?</h3>
              <p>Simply click the "Run a Simulation" button above, or navigate to our calculator. Enter your initial investment amount and your dates to instantly see how your money would have grown.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
