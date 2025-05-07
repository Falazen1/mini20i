import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { Buffer } from 'buffer';

export const WC_PROJECT_ID = '150a8dd59fc17ad01ad57503669c735f';

// Image must be HTTPS, public, and CORS-safe -- NO IPFS or GITHUB IMAGE HOSTING!
const APP_NAME = 'mini20i';
const APP_LOGO_URL = 'https://mini20i.vercel.app/logo.png';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/9qMBmGtkKgEUQkdQlEpq0GhMtfly2mzS'),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: APP_NAME,
        description: 'Swap and manage mini20i tokens',
        url: 'https://mini20i.vercel.app',
        icons: [APP_LOGO_URL], 
      },
    }),
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
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
    });
  });
}
