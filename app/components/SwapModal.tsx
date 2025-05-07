"use client";

import { useAccount } from "wagmi";
import { useState, useEffect, useRef } from "react";
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
import { useTransaction } from "../helpers/useTransaction";

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
  inscriptionList,
}: {
  tokenKey: "froggi" | "fungi" | "pepi";
  onClose: () => void;
  onSuccess: () => void;
  inscriptionList: {
    id: string;
    svg: string;
    seed: string;
    type: "Dynamic" | "Stable";
  }[]; 
}) {
  const { address } = useAccount();
  const token = TOKENS[tokenKey];
  const [debounced, setDebounced] = useState(false);
  const [swapDone, setSwapDone] = useState(false);
  const [newInscription, setNewInscription] = useState<string | null>(null);
  const [inscriptionId, setInscriptionId] = useState<string | null>(null);
  const [fadeInButtons, setFadeInButtons] = useState(false); 
  const prevSvgRef = useRef<string | null>(null);
  const { stabilizeInscription, destabilizeInscription, combineInscriptions } = useTransaction();

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(true), 500);
    return () => {
      setDebounced(false);
      clearTimeout(timer);
    };
  }, [tokenKey]);

  useEffect(() => {
    if (!swapDone) {
      const before = inscriptionList.find(i => i.type === "Dynamic");
      prevSvgRef.current = before?.svg ?? null;
    }
  }, [swapDone, inscriptionList]);

  useEffect(() => {
    if (!swapDone) return;
    const latest = inscriptionList.find(i => i.type === "Dynamic");
    const isNew = latest && latest.svg !== prevSvgRef.current;

    if (isNew) {
      const delay = setTimeout(() => {
        setNewInscription(latest.svg);
        setInscriptionId(latest.id);
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [inscriptionList, swapDone]);

  useEffect(() => {
    if (newInscription) {
      setFadeInButtons(true); 
    }
  }, [newInscription]);
  
  const handleSuccess = () => {
    setSwapDone(true);
    onSuccess();
  };

  const handleStabilize = () => {
    if (inscriptionId && address) {
      const seed = BigInt(inscriptionList.find(i => i.id === inscriptionId)?.seed || "0");
      stabilizeInscription(address, seed);
    }
  };

  const handleReroll = () => {
    if (inscriptionId && address) {
      const seed = BigInt(inscriptionList.find(i => i.id === inscriptionId)?.seed || "0");
      destabilizeInscription(address, seed);
    }
  };

  const handleCombine = () => {
    if (inscriptionId && address) {
      const seed = BigInt(inscriptionList.find(i => i.id === inscriptionId)?.seed || "0");
      combineInscriptions(address, [seed]);
    }
  };

  const seedValue = inscriptionList.find(i => i.id === inscriptionId)?.seed;

  if (!address || !token || !debounced) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-[#1c1e24] rounded-xl shadow-2xl p-6 w-full max-w-md text-white border border-white/10">
        {/* X Button (top-right corner, no fade-in) */}
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
          <>
            <div className="mb-4 text-center text-sm">
              {!newInscription
                ? tokenKey === "froggi"
                  ? "Your Froggi is evolving..."
                  : tokenKey === "fungi"
                  ? "Your Fungi is growing..."
                  : "Your Pepi is transforming..."
                : tokenKey === "froggi"
                ? "Your Froggi has evolved!"
                : tokenKey === "fungi"
                ? "Your Fungi has grown!"
                : "Your Pepi has transformed!"}
            </div>

            <div className="w-full aspect-square rounded bg-[#0f1014] flex items-center justify-center relative mb-2">
              {!newInscription ? (
                <p className="text-sm opacity-70 absolute text-center">
                  {tokenKey === "froggi"
                    ? "Your Froggi is evolving..."
                    : tokenKey === "fungi"
                    ? "Your Fungi is growing..."
                    : "Your Pepi is transforming..."}
                </p>
              ) : (
                <div
                  className="w-full h-full absolute top-0 left-0 animate-fade-in2"
                  dangerouslySetInnerHTML={{ __html: newInscription }}
                />
              )}
            </div>

            {seedValue && (
              <div className="text-sm text-white text-left mb-3 space-y-1">
                <div><span className="font-semibold">Tokens:</span> {seedValue}</div>
                <div><span className="font-semibold">Type:</span> Dynamic</div>
              </div>
            )}

              <div className="w-full pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className={`flex space-x-2 ${fadeInButtons ? 'animate-fade-in2' : 'opacity-0'}`}>
                  <button
                    onClick={handleStabilize}
                    className="bg-green-100 text-green-900 px-4 py-2 rounded hover:bg-green-200"
                  >
                    Stabilize
                  </button>
                  <button
                    onClick={handleReroll}
                    className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded hover:bg-yellow-200"
                  >
                    Re-roll
                  </button>
                  <button
                    onClick={handleCombine}
                    className="bg-indigo-100 text-indigo-900 px-4 py-2 rounded hover:bg-indigo-200"
                  >
                    Combine
                  </button>
                </div>

                {/* Close button remains at the bottom-right and is not part of the fade-in */}
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={onClose}
                    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>

          </>
        ) : (
          <OnchainKitProvider
            apiKey="3KA49gYhtfR0hrw5L7L0nPVYlO1z4tyE"
            chain={base}
            config={{
              appearance: {
                mode: "dark",
                theme: "default",
                name: "mini20i",
                logo: `https://mini20i.vercel.app/logo.png`,
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
