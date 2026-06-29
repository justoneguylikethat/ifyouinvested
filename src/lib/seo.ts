import { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ifyouinvested.online';

export function constructMetadata({
  title = 'IfYouInvested.online | Time Travel With Your Money',
  description = 'Simulate historical returns across stocks and crypto. See what you missed out on, or what bullets you dodged.',
  image = '/api/og',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image.startsWith('http') ? image : `${defaultUrl}${image}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${defaultUrl}${image}`],
      creator: '@ifyouinvested',
    },
    metadataBase: new URL(defaultUrl),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
