'use client';

import { PropsWithChildren } from 'react';
import { config } from './helpers/wagmiConfig';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKitProvider } from './providers/MiniKitProvider';
import { base } from 'viem/chains';

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey="3KA49gYhtfR0hrw5L7L0nPVYlO1z4tyE"
          chain={base}
          config={{
            appearance: {
              name: "mini20i",
              logo: "https://mini-20i.app/logo.png",
              theme: "default",
              mode: "auto",
            },
          }}
        >
          <MiniKitProvider>{children}</MiniKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
