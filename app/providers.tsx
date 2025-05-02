"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      projectId="8db55de0-70b8-44fa-8bc0-f8c6dda24ed6"
      apiKey="7c181787-70f4-44ef-972d-5bc3c3ed2bde"
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: "Mini20i",
          logo: "https://froggi.app/logo.png",
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
