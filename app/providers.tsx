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
              logo: "https://raw.githubusercontent.com/Falazen1/mini20i/247d458041f9aaa57982f1250fbd27074517684d/public/ERC20i%20ecosystem.png?token=GHSAT0AAAAAADDK3QQH4PJT64J6HPSXTOUG2AZBS7A",
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
