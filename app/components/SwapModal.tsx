"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Token } from "@coinbase/onchainkit/token";
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToast,
} from "@coinbase/onchainkit/swap";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";

const ethBase: Token = {
  name: "Ethereum",
  address: "",
  symbol: "ETH",
  decimals: 18,
  image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  chainId: 8453,
};

const TOKENS: Record<"froggi" | "fungi" | "pepi", Token> = {
  froggi: {
    name: "Froggi",
    address: "0x88A78C5035BdC8C9A8bb5c029e6cfCDD14B822FE",
    symbol: "FROGGI",
    decimals: 9,
    chainId: 8453,
    image: "https://d38ulo0p1ibxtf.cloudfront.net/fit-in/2560x1600/companies/4616/websites/images/original_image_34477546-d02c-4110-915a-26ab6914bcc3.png",
  },
  fungi: {
    name: "Fungi",
    address: "0x7d9ce55d54ff3feddb611fc63ff63ec01f26d15f",
    symbol: "FUNGI",
    decimals: 9,
    chainId: 8453,
    image: "https://www.dextools.io/resources/tokens/logos/base/0x7d9ce55d54ff3feddb611fc63ff63ec01f26d15f.png?1711917415936",
  },
  pepi: {
    name: "Pepi",
    address: "0x28a5e71BFc02723eAC17E39c84c5190415C0de9F",
    symbol: "PEPI",
    decimals: 9,
    chainId: 8453,
    image: "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/pepi_logo.jpg",
  },
};

export default function SwapModal({
  tokenKey,
  onClose,
}: {
  tokenKey: "froggi" | "fungi" | "pepi";
  onClose: () => void;
}) {
  const { address } = useAccount();
  const token = TOKENS[tokenKey];
  const [debounced, setDebounced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(true), 500);
    return () => {
      setDebounced(false);
      clearTimeout(timer);
    };
  }, [tokenKey]);

  if (!address || !token || !debounced) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4 text-center">
          Swap ETH → {token.name}
        </h3>

        <OnchainKitProvider
          apiKey="3KA49gYhtfR0hrw5L7L0nPVYlO1z4tyE"
          chain={base}
          config={{
            appearance: {
              mode: "auto",
              theme: "default",
              name: "Mini20i",
              logo: "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/main/logo512.png",
            },
          }}
        >
          <Swap>
            <SwapAmountInput label="Sell" token={ethBase} type="from" />
            <SwapAmountInput label="Buy" token={token} type="to" />
            <SwapButton />
            <SwapMessage />
            <SwapToast />
          </Swap>
        </OnchainKitProvider>
      </div>
    </div>
  );
}
