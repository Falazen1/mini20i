import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { Buffer } from 'buffer';

export const WC_PROJECT_ID = "5155899d6b66f997fb6c8554991c47ae";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/h_Eo8VfIkLqa6vLqzrt023fm073ncKxJ"),
  },
  connectors: [
    farcasterFrame(),
    injected(),
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: "mini20i",
        description: "Swap and manage mini20i tokens",
        url: "https://mini-20i.app",
        icons: ["https://mini-20i.app/logo.png"],
      },
    }),
    coinbaseWallet({
      appName: "mini20i",
      appLogoUrl: "https://mini-20i.app/logo.png",
      chainId: base.id,
    }),
  ],
});

// Delay Web3Modal init until client-side
if (typeof window !== 'undefined') {
  if (!window.Buffer) {
    window.Buffer = Buffer;
  }

  import('@web3modal/wagmi/react').then(({ createWeb3Modal }) => {
    createWeb3Modal({
      wagmiConfig: config,
      projectId: WC_PROJECT_ID,
      themeMode: 'dark',
      enableAnalytics: true,
      metadata: {
        name: "Mini-20i",
        description: "Collect and evolve ERC20i tokens",
        url: "https://mini-20i.app",
        icons: ["https://mini-20i.app/logo.png"],
      },
      featuredWalletIds: ['metaMask', 'coinbaseWallet'],
      allWallets: 'SHOW',
      enableOnramp: true,
    });
  });
}
