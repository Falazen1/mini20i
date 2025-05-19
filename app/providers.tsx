'use client';

import { PropsWithChildren, useEffect } from 'react';
import { config } from './helpers/wagmiConfig';
import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { base } from 'viem/chains';

const queryClient = new QueryClient();

function BaseNetworkEnforcer() {
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) return;

    const eth = (window as {
      ethereum?: {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      };
    }).ethereum;

    if (!eth?.request) return;

    const BASE_CHAIN_ID_HEX = '0x2105';

    (async () => {
      try {
        const currentChainId = (await eth.request({ method: 'eth_chainId' })) as string;

        if (currentChainId !== BASE_CHAIN_ID_HEX) {
          try {
            await eth.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: BASE_CHAIN_ID_HEX }],
            });
          } catch (switchError: unknown) {
            // @ts-expect-error allow access to .code
            if (switchError.code === 4902) {
              await eth.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: BASE_CHAIN_ID_HEX,
                    chainName: 'Base',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org'],
                  },
                ],
              });
            }
          }
        }
      } catch (err) {
        console.error('Failed to enforce Base network:', err);
      }
    })();
  }, [isConnected]);

  return null;
}

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
          <MiniKitProvider chain={base}>
            <BaseNetworkEnforcer />
            {children}
          </MiniKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
