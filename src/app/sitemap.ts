import { MetadataRoute } from 'next';
import { POPULAR_ASSETS } from '@/lib/assets';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ifyouinvested.online';

// Generate sitemap permutations for all 100+ top assets
const assetSymbols = POPULAR_ASSETS.map(a => a.symbol.toLowerCase());
const POPULAR_AMOUNTS = [100, 1000, 10000];
// We calculate years relative to current year for SEO longevity, but since URL uses static years, we'll use a mix of fixed years
const POPULAR_YEARS = [2010, 2015, 2020, 2023];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/crypto`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stocks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/etfs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // PLAYGROUND TOOLS (HIGH PRIORITY FOR SITELINKS)
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/dca`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/lifestyle`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/best-finder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/crash-simulator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Generate dynamic permutations for the invest calculator
  assetSymbols.forEach((asset) => {
    // Add base asset pages if they exist
    sitemap.push({
      url: `${baseUrl}/invest/${asset}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    POPULAR_AMOUNTS.forEach((amount) => {
      POPULAR_YEARS.forEach((year) => {
        sitemap.push({
          url: `${baseUrl}/invest/${asset}/${amount}/${year}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    });
  });

  return sitemap;
}
