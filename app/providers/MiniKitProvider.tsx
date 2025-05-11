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
          logo: "https://mini-20i.app/logo.png",
          theme: "default",
          mode: "auto",
        },
      }}
    >
      {children}
    </MKProvider>
  );
}
