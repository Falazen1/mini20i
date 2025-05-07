import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { Buffer } from 'buffer';

export const WC_PROJECT_ID = "55155899d6b66f997fb6c8554991c47ae";

// Image must be HTTPS, public, and CORS-safe
// Upload 'logo2.png' to your /public directory

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/h_Eo8VfIkLqa6vLqzrt023fm073ncKxJ'),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: 'mini20i',
        description: 'Swap and manage mini20i tokens',
        url: 'https://mini20i.vercel.app',
        icons: ['https://mini20i.vercel.app/logo.png'], // ✅ updated image
      },
    }),
    coinbaseWallet({
      appName: 'mini20i',
      appLogoUrl: 'https://mini20i.vercel.app/logo.png', // ✅ updated image
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
      connectorImages: {
        injected: 'https://mini20i.vercel.app/logo.png', // ✅ consistent branding
        coinbaseWallet: 'https://mini20i.vercel.app/logo.png', // ✅ optional
        walletConnect: 'https://mini20i.vercel.app/logo.png', // ✅ optional
      },
    });
  });
}
