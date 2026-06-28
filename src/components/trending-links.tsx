import React from 'react';
import Link from 'next/link';

export function TrendingLinks() {
  const trending = [
    { label: '$1,000 in Bitcoin in 2010', url: '/invest/bitcoin/1000/2010' },
    { label: '$10,000 in Tesla in 2020', url: '/invest/tesla/10000/2020' },
    { label: '$500 in Ethereum in 2015', url: '/invest/ethereum/500/2015' },
    { label: '$5,000 in Apple in 2010', url: '/invest/apple/5000/2010' },
    { label: 'Bitcoin vs Ethereum', url: '/compare/bitcoin/ethereum' },
    { label: 'SPY vs QQQ', url: '/compare/spy/qqq' },
  ];

  return (
    <div className="mt-24 pt-8 border-t border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-slate-300">Trending Comparisons</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trending.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
