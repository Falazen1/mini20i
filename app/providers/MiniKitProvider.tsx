'use client';

import { MiniKitProvider as MKProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';
import { base } from 'viem/chains';

export function MiniKitProvider({ children }: { children: ReactNode }) {
  return (
    <MKProvider
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
      {children}
    </MKProvider>
  );
}
