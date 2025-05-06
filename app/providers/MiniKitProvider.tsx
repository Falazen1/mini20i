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
          logo: "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg",
          theme: "default",
          mode: "auto",
        },
      }}
    >
      {children}
    </MKProvider>
  );
}
