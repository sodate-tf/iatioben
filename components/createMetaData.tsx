// components/MetaData.tsx
import { Metadata } from 'next';

interface MetaDataProps {
  title: string;
  description: string;
  url: string;
  image: string;
}

export default function createMetaData({ title, description, url, image }: MetaDataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}
