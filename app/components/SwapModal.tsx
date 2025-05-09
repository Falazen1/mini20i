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
import { useTokenStore } from "../helpers/useTokenStore";
import Image from "next/image";

const ethBase: Token = {
  name: "Ethereum",
  address: "",
  symbol: "ETH",
  decimals: 18,
  image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  chainId: 8453,
};

const LOADING_GIFS: Record<"froggi" | "fungi" | "pepi", string> = {
  froggi: "/frog_rolling_long.gif",
  fungi: "/fungi_rolling_long.gif",
  pepi: "/pepi_rolling_long.gif",
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
    type: "Growing" | "Safe";
  }[];
}) {
  const { address } = useAccount();
  const token = TOKENS[tokenKey];
  const loadingGif = LOADING_GIFS[tokenKey];
  const [debounced, setDebounced] = useState(false);
  const [swapDone, setSwapDone] = useState(false);
  const [newInscription, setNewInscription] = useState<string | null>(null);
  const [inscriptionId, setInscriptionId] = useState<string | null>(null);
  const [fadeInButtons, setFadeInButtons] = useState(false);
  const [justLeveledUp, setJustLeveledUp] = useState(false);
  const prevSvgRef = useRef<string | null>(null);
  const prevLevelRef = useRef<number | null>(null);
  const tokenStore = useTokenStore();
  const { stabilizeInscription } = useTransaction();
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  function getLevel(tokenKey: "froggi" | "fungi" | "pepi", amount: number): number {
    const thresholds: Record<typeof tokenKey, number[]> = {
      froggi: [0, 1000, 3000, 10000, 30000, 60000, 120000],
      fungi: [0, 21000, 525000, 1050000, 1575000, 2100000],
      pepi: [0, 11, 22, 33, 44, 56],
    };
    const levels = thresholds[tokenKey];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (amount >= levels[i]) return i;
    }
    return 0;
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(true), 500);
    return () => {
      setDebounced(false);
      clearTimeout(timer);
    };
  }, [tokenKey]);

  useEffect(() => {
    if (!swapDone) {
      const before = inscriptionList.find(i => i.type === "Growing");
      prevSvgRef.current = before?.svg ?? null;
      if (before) {
        prevLevelRef.current = getLevel(tokenKey, Number(before.seed));
      }
    }
  }, [swapDone, inscriptionList, tokenKey]);

  useEffect(() => {
    if (!swapDone) return;
    const latest = inscriptionList.find(i => i.type === "Growing");
    const isNew = latest && latest.svg !== prevSvgRef.current;

    if (isNew) {
      const delay = setTimeout(() => {
        setNewInscription(latest.svg);
        setInscriptionId(latest.id);

        const newSeed = Number(latest.seed);
        const newLevel = getLevel(tokenKey, newSeed);

        if (prevLevelRef.current !== null && newLevel > prevLevelRef.current) {
          setJustLeveledUp(true);
          setShowFinalMessage(false);
          setTimeout(() => {
            setShowFinalMessage(true);
          }, 2500);
        } else {
          setShowFinalMessage(true); // fallback if no level up
        }
        

        prevLevelRef.current = newLevel;
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [swapDone, inscriptionList, tokenKey]);

  useEffect(() => {
    if (newInscription) {
      setFadeInButtons(true);
    }
  }, [newInscription]);

  const handleSuccess = () => {
    setSwapDone(true);
    onSuccess();
  };

const handleStabilize = async () => {
  if (inscriptionId && address) {
    await tokenStore.setTokenByKey(tokenKey);
    const seed = BigInt(inscriptionList.find(i => i.id === inscriptionId)?.seed || "0");
    await stabilizeInscription(address, seed);
    onSuccess(); // trigger parent to reload list
    onClose();   // then close modal
  }
};



  const seedValue = inscriptionList.find(i => i.id === inscriptionId)?.seed;

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
{/*
{swapDone && (
  <div className="mt-4">
    <button
      onClick={() => {
        setJustLeveledUp(true);
        setTimeout(() => setJustLeveledUp(false), 2500);
      }}
      className="px-4 py-2 text-sm bg-purple-100 text-purple-900 rounded hover:bg-purple-200"
    >
      Test Level Up
    </button>
  </div>
)}
*/}


<h2 className={`text-2xl font-bold mb-6 text-center transition-opacity duration-700 ${showFinalMessage ? 'opacity-100' : 'opacity-0'}`}>
  {justLeveledUp
    ? tokenKey === "froggi"
      ? "Your Froggi has evolved!"
      : tokenKey === "fungi"
      ? "Your Fungi leveled up!"
      : "Your Pepi leveled up!"
    : newInscription
    ? prevSvgRef.current === null
      ? "You got a new inscription!"
      : tokenKey === "froggi"
      ? "Your Froggi has evolved!"
      : tokenKey === "fungi"
      ? "Your Fungi has grown!"
      : "Your Pepi has transformed!"
    : `Swap ETH → ${token.symbol}`}
</h2>


        {swapDone ? (
          <>
            {!newInscription && (
              <div className="mb-4 text-center text-sm">
                {tokenKey === "froggi"
                  ? "Your Froggi is evolving..."
                  : tokenKey === "fungi"
                  ? "Your Fungi is growing..."
                  : "Your Pepi is transforming..."}
              </div>
            )}

            <div className="w-full aspect-square rounded bg-[#0f1014] flex items-center justify-center relative mb-2">
              {!newInscription ? (
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={loadingGif}
                    alt="loading gif"
                    className="w-full h-full object-contain translate-y-[3px]"
                    fill
                    unoptimized
                  />
                </div>
              ) : (
                <>
<div className="w-full h-full relative flex items-center justify-center">


  {/* LEVEL UP TEXT */}
  {justLeveledUp && (
    <div className="absolute inset-20 flex justify-center items-start pt-10 z-30">
      <div className="text-4xl sm:text-5xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] animate-levelup-text">
        Level Up!
      </div>
    </div>
  )}

{/* GLOWING BORDER AROUND SVG */}
{justLeveledUp && (
  <div className="absolute inset-[-6px] rounded-lg border-4 border-yellow-300 animate-glow-fade z-30 pointer-events-none" />
)}


  {/* SVG */}
  <div
    className="w-full h-full animate-fade-in2 z-20"
    dangerouslySetInnerHTML={{ __html: newInscription }}
  />
</div>


                </>
              )}
            </div>

            {seedValue && (
              <div className="text-sm text-white text-left mb-3 space-y-1">
                <div><span className="font-semibold">Tokens:</span> {seedValue}</div>
                <div><span className="font-semibold">Mode:</span> Growing</div>
              </div>
            )}

            <div className="w-full pt-1 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-y-4 items-end">
              <div className={`flex flex-wrap gap-2 ${fadeInButtons ? 'animate-fade-in2' : 'opacity-0'}`}>
                {tokenKey === "froggi" && (
                  <button
                    onClick={handleStabilize}
                    className="bg-green-100 text-green-900 px-4 py-2 rounded hover:bg-green-200"
                  >
                    Stash
                  </button>
                )}
                <button
                  onClick={() => {
                    setSwapDone(false);
                    setNewInscription(null);
                    setInscriptionId(null);
                    setFadeInButtons(false);
                    
                  }}
                  className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded hover:bg-yellow-200"
                >
                  Add more
                </button>

              </div>

              <div className="flex justify-end">
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
