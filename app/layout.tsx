import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#282c34",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mini-20i",
    description: "ERC20i inscriptions simplified",
    applicationName: "mini-20i",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "Mini-20i",
      description: "Explore ERC20i inscriptions with mini20i",
      url: "https://mini-20i.app",
      siteName: "mini-20i",
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        appIcon: "/favicon.png",
        appLogoUrl: "https://mini-20i.app/logo.png",
        logo: "/logo.png",
        imageUrl: "https://mini-20i.app/favicon.png",
        button: {
          title: "Launch Mini-20i",
          action: {
            type: "launch_frame",
            name: "mini-20i",
            url: "https://mini-20i.app",
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
