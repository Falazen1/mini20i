// app/layout.tsx
import './theme.css';
import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const PROJECT_NAME = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? 'Mini20i';
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? 'raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg';
const SPLASH_IMAGE_URL = process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL ?? 'raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg';
const SPLASH_BG = `#${process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR ?? 'FFFFFF'}`;
const URL = process.env.NEXT_PUBLIC_URL ?? 'mini20i.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: PROJECT_NAME,
    description: 'Mini20i – View, manage, and swap ERC-20i inscriptions on Base.',
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': IMAGE_URL,
      'fc:frame:button:1': `Launch ${PROJECT_NAME}`,
      'fc:frame:post_url': URL,
      'fc:frame:splash': SPLASH_IMAGE_URL,
      'fc:frame:splash_background': SPLASH_BG,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
