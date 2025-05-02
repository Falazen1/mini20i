import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { Buffer } from 'buffer';

export const WC_PROJECT_ID = '9b70fa1fe3feb6b21e9af826661a3e17';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/h_Eo8VfIkLqa6vLqzrt023fm073ncKxJ'),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: WC_PROJECT_ID,
    }),
    coinbaseWallet({
      appName: 'mini20i',
      chainId: base.id,
    }),
  ],
});

// Delay Web3Modal init until client-side, and avoid top-level import
if (typeof window !== 'undefined') {
  if (!window.Buffer) {
    window.Buffer = Buffer;
  }

  import('@web3modal/wagmi/react').then(({ createWeb3Modal }) => {
    createWeb3Modal({
      wagmiConfig: config,
      projectId: WC_PROJECT_ID,
    });
  });
}
