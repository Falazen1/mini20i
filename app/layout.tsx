import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "mini20i",
    description: "Base Inscriptions Viewer",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        appIcon: "https://mini20i.vercel.app/favicon.png",
        appLogoUrl: "https://mini20i.vercel.app/logo.png",
        logo: "https://mini20i.vercel.app/logo.png",
        imageUrl: "https://mini20i.vercel.app/favicon.png",
        button: {
          title: "Launch Mini20i",
          action: {
            type: "launch_frame",
            name: "mini20i",
            url: "https://mini20i.vercel.app",
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
