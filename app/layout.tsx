import './theme.css';
import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "mini20i",
    description:
      "Base Inscriptions Viewer",
    other: {
      "fc:frame": JSON.stringify({
        version: "vNext",
        imageUrl: "https://your-preview-image.png",
        button: {
          title: "Launch Mini20i",
          action: {
            type: "launch_frame",
            name: "mini20i",
          },
        },
      }),
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
