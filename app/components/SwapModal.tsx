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
import { FROGGI_HATS, FROGGI_EYEWEAR, FROGGI_CLOTHES } from "../helpers/froggi";
import { FUNGUS_COLOR_NAMES, PEPI_COLOR_NAMES, JELLI_COLOR_NAMES } from "../helpers/colors";
import ShareButton from "./ShareButton";

const ethBase: Token = {
  name: "Ethereum",
  address: "",
  symbol: "ETH",
  decimals: 18,
  image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  chainId: 8453,
};

const LOADING_GIFS: Record<
"froggi" | "fungi" | "pepi" | "jelli"
, string> = {
  froggi: "/frog_rolling_long.gif",
  fungi: "/fungi_rolling_long.gif",
  pepi: "/pepi_rolling_long.gif",
  jelli: "/jelli_rolling_long.gif",
};

const TOKENS: Record<
  "froggi" | "fungi" | "pepi" | "jelli",
  Token
> = {
  froggi: {
    name: "Froggi",
    address: "0x88A78C5035BdC8C9A8bb5c029e6cfCDD14B822FE",
    symbol: "FROGGI",
    decimals: 9,
    chainId: 8453,
    image: "/froggi_logo.png",
  },
  fungi: {
    name: "Fungi",
    address: "0x7d9ce55d54ff3feddb611fc63ff63ec01f26d15f",
    symbol: "FUNGI",
    decimals: 9,
    chainId: 8453,
    image: "/fungi_logo.png",
  },
  pepi: {
    name: "Pepi",
    address: "0x28a5e71BFc02723eAC17E39c84c5190415C0de9F",
    symbol: "PEPI",
    decimals: 9,
    chainId: 8453,
    image: "/pepi_logo.jpg",
  },
  jelli: {
    name: "Jelli",
    address: "0xA1b9d812926a529D8B002E69FCd070c8275eC73c",
    symbol: "JELLI",
    decimals: 9,
    chainId: 8453,
    image: "/jelli_logo.png",
  },
};

function extractTopTraits(meta: Record<string, unknown>, project: 
"froggi" | "fungi" | "pepi" |"jelli"
, seedStr: string): string[] {
  const traits: { label: string; value: string }[] = [];

  if (project === "froggi") {
    const seedNum = parseInt(seedStr, 10);
    if (seedNum <= 2999) {
      if (meta.egg) traits.push({ label: "Pattern", value: meta.egg as string });
      if (meta.eggPalette) traits.push({ label: "Palette", value: meta.eggPalette as string });
      if (meta.eggAnimation) traits.push({ label: "Wiggle", value: meta.eggAnimation as string });
      if (meta.animateBg === "true") traits.push({ label: "Anim BG", value: "Yes" });
    } else {
      if (meta.hatBool === "true") traits.push({ label: "Hat", value: FROGGI_HATS[meta.hat as string] || meta.hat as string });
      if (meta.eyewearBool === "true") traits.push({ label: "Eyes", value: FROGGI_EYEWEAR[meta.eyewear as string] || meta.eyewear as string });
      if (meta.clothesBool === "true") traits.push({ label: "Clothes", value: FROGGI_CLOTHES[meta.clothes as string] || meta.clothes as string });
      if (meta.animateBg === "true") traits.push({ label: "BGR", value: "Anim" });
      if (meta.animateBody === "true") traits.push({ label: "Body", value: "Anim" });
      if (meta.expression) traits.push({ label: "Face", value: meta.expression as string });
      if (meta.eyes) traits.push({ label: "Eyes", value: meta.eyes as string });
      if (meta.body) traits.push({ label: "Body", value: meta.body as string });
      if (meta.bg) traits.push({ label: "BGR", value: meta.bg as string });
    }
  }

  if (project === "fungi") {
    const resolve = (hex: string) => FUNGUS_COLOR_NAMES[hex.toLowerCase()] || hex;
    if (meta.hasDots === "true") traits.push({ label: "Dots", value: resolve(meta.dotsColor as string) });
    if (meta.cap) traits.push({ label: "Cap", value: meta.cap as string });
    if (meta.capColor) traits.push({ label: "Color", value: resolve(meta.capColor as string) });
    if (meta.stem) traits.push({ label: "Stem", value: meta.stem as string });
    if (meta.stemColor) traits.push({ label: "Spore", value: resolve(meta.stemColor as string) });
    if (meta.groundColor) traits.push({ label: "Ground", value: resolve(meta.groundColor as string) });
    if (meta.background) traits.push({ label: "BGR", value: resolve(meta.background as string) });
  }

  if (project === "pepi") {
    const resolve = (hex: string) => PEPI_COLOR_NAMES[hex.toLowerCase()] || hex;
    if ((meta.hat && meta.hat !== "0") || meta["Head"]) traits.push({ label: "Hat", value: (meta["Head Item"] || meta.hat) as string });
    if (meta.accessory && meta.accessory !== "0") traits.push({ label: "Accessory", value: meta.accessory as string });
    if (meta.ears && meta.ears !== "0") traits.push({ label: "Ears", value: meta.ears as string });
    if (meta.eyes && meta.eyes !== "0") traits.push({ label: "Eyes", value: meta.eyes as string });
    if (meta.mouth && meta.mouth !== "0") traits.push({ label: "Mouth", value: meta.mouth as string });
    if (meta.clothes && meta.clothes !== "0") traits.push({ label: "Clothes", value: meta.clothes as string });
    if (meta.bodyColor) traits.push({ label: "Color", value: resolve(meta.bodyColor as string) });
    if (meta.background) traits.push({ label: "BGR", value: resolve(meta.background as string) });
  }
  if (project === "jelli") {
    const resolve = (hex: string) => JELLI_COLOR_NAMES[hex.toLowerCase()] || hex;
    if (meta.bellColor) traits.push({ label: "Color", value: resolve(meta.bellColor as string) });
    if (meta.tentacleColor) traits.push({ label: "Tentacle", value: resolve(meta.tentacleColor as string) });
    if (meta.background) traits.push({ label: "Sky", value: resolve(meta.background as string) });
    if (meta.hasGround === "true" && meta.groundColor) traits.push({ label: "Ground", value: resolve(meta.groundColor as string) });
    if (meta.hasBubble === "true" && meta.bubbleColor) traits.push({ label: "Bubble", value: resolve(meta.bubbleColor as string) });
    if (meta.hasWeed === "true" && meta.weedColor) traits.push({ label: "Weed", value: resolve(meta.weedColor as string) });

  }
  const seen = new Set<string>();
  return traits.filter((t) => !seen.has(t.label) && seen.add(t.label)).slice(0, 6).map(t => `${t.label}: ${t.value}`);
}
export default function SwapModal({
  tokenKey,
  onClose,
  onSuccess,
  inscriptionList,
}: {
  tokenKey: "froggi" | "fungi" | "pepi" | "jelli";
  onClose: () => void;
  onSuccess: () => void;
  inscriptionList: {
    id: string;
    svg: string;
    seed: string;
    type: "Growing" | "Safe";
    meta?: Record<string, unknown>;
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

  function getLevel(
    k: "froggi" | "fungi" | "pepi" | "jelli",
    amount: number
  ): number {
    // same thresholds
    const thresholds: Record<typeof k, number[]> = {
      froggi: [0, 1000, 3000, 10000, 30000, 60000, 120000],
      fungi: [0, 21000, 525000, 1050000, 1575000, 2100000],
      pepi: [0, 11, 22, 33, 44, 56],
      jelli: [0, 1000, 21000, 105000, 420000, 1050000],
    };
    const levels = thresholds[k];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (amount >= levels[i]) return i;
    }
    return 0;
  }

  // Debounce same as you had
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(true), 500);
    return () => {
      clearTimeout(timer);
      setDebounced(false);
    };
  }, [tokenKey]);

  // Keep track of pre-swap vs. post-swap
  useEffect(() => {
    if (!swapDone) {
      const before = inscriptionList.find((i) => i.type === "Growing");
      prevSvgRef.current = before?.svg ?? null;
      if (before) {
        prevLevelRef.current = getLevel(tokenKey, Number(before.seed));
      }
    }
  }, [swapDone, inscriptionList, tokenKey]);

  // After swap completes, see if the newly minted inscription changed
  useEffect(() => {
    if (!swapDone) return;
    const latest = inscriptionList.find((i) => i.type === "Growing");
    if (!latest) return;

    const isNew = latest.svg !== prevSvgRef.current;
    if (!isNew) return;

    const delay = setTimeout(() => {
      setNewInscription(latest.svg);
      setInscriptionId(latest.id);

      const newSeed = Number(latest.seed);
      const newLevel = getLevel(tokenKey, newSeed);

      if (
        prevLevelRef.current !== null &&
        newLevel > prevLevelRef.current
      ) {
        setJustLeveledUp(true);
        setShowFinalMessage(false);
        setTimeout(() => {
          setShowFinalMessage(true);
        }, 2500);
      } else {
        setShowFinalMessage(true);
      }
      prevLevelRef.current = newLevel;
    }, 500);

    return () => clearTimeout(delay);
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
    if (!inscriptionId || !address) return;
    await tokenStore.setTokenByKey(tokenKey);
    const seed = BigInt(
      inscriptionList.find((i) => i.id === inscriptionId)?.seed || "0"
    );
    await stabilizeInscription(address, seed);
    onSuccess();
    onClose();
  };

  const seedValue = inscriptionList.find((i) => i.id === inscriptionId)?.seed;
  if (!address || !token || !debounced) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30 w-[100%] h-[100%] ">
<div className="bg-[#1c1e24] border border-white/10 rounded-xl shadow-xl p-6 max-w-lg mx-auto text-white relative">
  <button
    onClick={onClose}
    className="absolute top-1 right-3 text-white/10 text-lg hover:text-red-400 z-10"
    type="button"
    aria-label="Close"
  >
    ✕
  </button>
  <button
    onClick={onClose}
    className="absolute top-1 left-3 text-white/10 text-lg hover:text-red-400 z-10"
    type="button"
    aria-label="Close"
  >
    ✕
  </button>
  <h2
    className={`text-xl font-bold mb-2 mr-6 ml-6 text-center transition-opacity duration-700 ${
      showFinalMessage ? "opacity-100" : "opacity-0"
    }`}
  >
    {justLeveledUp
      ? tokenKey === "froggi"
        ? "Your Froggi has evolved!"
        : tokenKey === "fungi"
        ? "Your Fungi leveled up!"
        : tokenKey === "jelli"
        ? "Your Jelli has ascended!"
        : "Your Pepi leveled up!"
      : newInscription
      ? prevSvgRef.current === null
        ? "You got a new inscription!"
        : tokenKey === "froggi"
        ? "Your Froggi has evolved!"
        : tokenKey === "fungi"
        ? "Your Fungi has grown!"
        : tokenKey === "jelli"
        ? "Your Jelli has morphed!"
        : "Your Pepi has transformed!"
      : `Swap ETH → ${token.symbol}`}
  </h2>

  {swapDone ? (
    <>
      {/* if no newInscription yet, show "is evolving..." */}
      {!newInscription && (
        <div className="mb-4 text-center text-sm">
          {tokenKey === "froggi"
            ? "Your Froggi is evolving..."
            : tokenKey === "fungi"
            ? "Your Fungi is growing..."
            : tokenKey === "jelli"
            ? "Your Jelli is materializing..."
            : "Your Pepi is transforming..."}
        </div>
      )}

      <div id="share-capture">
<div className="w-full aspect-square relative bg-black rounded overflow-hidden flex items-center justify-center">
  {!newInscription ? (
    <Image
      src={loadingGif}
      alt="loading gif"
      className="object-contain w-full h-full"
      fill
      unoptimized
    />
          ) : (
            <>
              <div className="w-full h-full relative flex items-center justify-center">
                {justLeveledUp && (
                  <div className="absolute inset-20 flex justify-center items-start pt-10 z-[99]">
                    <div className="text-4xl sm:text-5xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] animate-levelup-text">
                      Level Up!
                    </div>
                  </div>
                )}

                {justLeveledUp && (
                  <div className="absolute inset-[-6px] rounded-lg border-4 border-yellow-300 animate-glow-fade z-[99] pointer-events-none" />
                )}

  <div
    className="w-full h-full animate-fade-in2 z-20"
    dangerouslySetInnerHTML={{ __html: newInscription }}
  />
</div>
            </>
          )}
        </div>

        {seedValue && (
          <div className="text-xs text-white text-left mb-4 mt-2">
            <div>
              <span className="font-semibold">Tokens:</span> {seedValue}
              <span className="font-semibold pl-6">Type:</span> Growing
            </div>
          </div>
        )}

        {(() => {
          const meta = inscriptionList.find((i) => i.id === inscriptionId)?.meta;
          if (!meta) return null;
          const traits = extractTopTraits(meta, tokenKey, seedValue ?? "0");
          return (
            <div className="grid grid-cols-3 gap-1 text-xs text-white/80">
              {traits.map((trait, i) => (
<div
  key={`trait-${i}`}
  className="px-1 py-0.5 bg-white/10 rounded shadow text-center"
>
    <span data-trait-text>{trait}</span>
</div>
              ))}
            </div>
          );
        })()}
      </div>

<div className="flex flex-row justify-between items-end mt-4 gap-3" id="share-controls">
        <div
          className={`flex gap-2 flex-wrap ${
            fadeInButtons ? "animate-fade-in2" : "opacity-0"
          }`}
        >
          {["froggi", "pepi", "jelli"].includes(tokenKey) && (
            <button
              onClick={handleStabilize}
              className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded"
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
            className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded"
          >
            Add more
          </button>
        </div>

        <div
          className={`flex flex-col gap-2 ${
            fadeInButtons ? "animate-fade-in2" : "opacity-0"
          }`}
        >
          <ShareButton
            seed={seedValue!}
            project={tokenKey}
            svg={newInscription!}
            traits={
              (() => {
                const meta = inscriptionList.find(i => i.id === inscriptionId)?.meta;
                return meta
                  ? extractTopTraits(meta, tokenKey, seedValue!)
                  : [];
              })()
            }
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded"
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
          logo: `https://mini-20i.app/logo.png`,
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