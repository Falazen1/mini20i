// app/providers.tsx
"use client";

import { PropsWithChildren } from "react";
import { config } from "../app/helpers/wagmiConfig";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey="e1a10bfd-a677-4efd-9fe1-88c400e9587b"
          chain={base}
          config={{
            appearance: {
              name: "Mini20i",
              logo: "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/frog-token.png",
              theme: "default",
              mode: "auto",
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
