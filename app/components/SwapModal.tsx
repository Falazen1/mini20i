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
  onSuccess,
}: {
  tokenKey: "froggi" | "fungi" | "pepi";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { address } = useAccount();
  const token = TOKENS[tokenKey];
  const [debounced, setDebounced] = useState(false);
  const [swapDone, setSwapDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(true), 500);
    return () => {
      setDebounced(false);
      clearTimeout(timer);
    };
  }, [tokenKey]);

  const handleSuccess = () => {
    setSwapDone(true);
    onSuccess(); // refresh inscriptions
  };

  const revealText =
    tokenKey === "froggi"
      ? "Reveal Frog"
      : tokenKey === "fungi"
      ? "Reveal Mushroom"
      : "Reveal Pepe";

  if (!address || !token || !debounced) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-[#1c1e24] rounded-xl shadow-2xl p-6 w-full max-w-md text-white border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-400"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Swap ETH → {token.symbol}
        </h2>

        {swapDone ? (
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg text-center">Swap successful!</p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-green-600 rounded-lg text-white text-lg hover:bg-green-700"
            >
              {revealText}
            </button>
          </div>
        ) : (
          <OnchainKitProvider
            apiKey="3KA49gYhtfR0hrw5L7L0nPVYlO1z4tyE"
            chain={base}
            config={{
              appearance: {
                mode: "dark",
                theme: "default",
                name: "Mini20i",
                logo:
                  "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/main/logo512.png",
              },
            }}
          >
            <Swap onSuccess={handleSuccess}>
              <div className="space-y-4">
                <SwapAmountInput label="From" token={ethBase} type="from" />
                <SwapAmountInput label="To" token={token} type="to" />
                <SwapButton />
                <SwapMessage />
                <SwapToast />
              </div>
            </Swap>
          </OnchainKitProvider>
        )}
      </div>
    </div>
  );
}
