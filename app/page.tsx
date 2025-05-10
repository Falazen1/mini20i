
"use client";

import { useEffect, useState } from "react";
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useConnect } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "./helpers/wagmiConfig";
import abis from "./helpers/abi";
import tokens from "./helpers/tokens.json";
{/*import { TELEGRAM_URL } from "./helpers/constants"; */}
import Topnav from "./components/Topnav";
import { getFunctionNames } from "./helpers/abi/mapping";
import { type Seed } from "./helpers/types";
import { useTransaction } from "./helpers/useTransaction";
import { Address } from "viem";
import { useTokenStore } from "./helpers/useTokenStore";
import SwapModal from "./components/SwapModal";
import Image from "next/image";
import ShareButton from "./components/ShareButton";
import Head from "next/head";
import { FUNGUS_COLOR_NAMES } from "./helpers/colors";
import { PEPI_COLOR_NAMES } from "./helpers/colors";
import { FROGGI_HATS, FROGGI_EYEWEAR, FROGGI_CLOTHES } from "./helpers/froggi";
type Inscription = {
  id: string;
  svg: string;
  seed: string;
  type: "Growing" | "Safe";
  meta?: Record<string, unknown>; // 
};

export default function Page() {
  const context = useMiniKit();
  const wagmiAddress = useAccount().address;
  const address = (context as { walletAddress?: `0x${string}` })?.walletAddress ?? wagmiAddress;
  const { connect, connectors } = useConnect();
  const [inscriptions, setInscriptions] = useState<Record<string, Inscription[]>>({});
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [combineMode, setCombineMode] = useState(false);
  const [combineList, setCombineList] = useState<Inscription[]>([]);
  const { stabilizeInscription, destabilizeInscription, combineInscriptions } = useTransaction();
  const tokenStore = useTokenStore();
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [swapTokenKey, setSwapTokenKey] = useState<"froggi" | "fungi" | "pepi" | null>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [showMiniKit, setShowMiniKit] = useState(false);
const [showDescription, setShowDescription] = useState(false);
const [showBanners, setShowBanners] = useState(false);
const [showTokens, setShowTokens] = useState(false);
const [showTokenSwap, setShowTokenSwap] = useState(false);
const { setFrameReady, isFrameReady } = useMiniKit();
const [fadeOutIndex, setFadeOutIndex] = useState<number | null>(null);
const [confirmedCombineList, setConfirmedCombineList] = useState<Inscription[] | null>(null);

const LOADING_GIFS: Record<"froggi" | "fungi" | "pepi", string> = {
  froggi: "/frog_rolling_long.gif",
  fungi: "/fungi_rolling_long.gif",
  pepi: "/pepi_rolling_long.gif",
};
const [showRollingGif, setShowRollingGif] = useState<null | "froggi" | "fungi" | "pepi">(null);

useEffect(() => {
  if (!isFrameReady) setFrameReady();
}, [isFrameReady, setFrameReady]);
useEffect(() => {
  if (window.parent !== window) {
    const interval = setInterval(() => {
      const mini = (context as { walletAddress?: `0x${string}` })?.walletAddress;
      if (!mini && !address) {
        window.location.reload();
      }
    }, 3000);

    return () => clearInterval(interval);
  }
}, [context, address]);
useEffect(() => {
  if (address) {
    setTimeout(() => setShowMiniKit(true), 100); 
    setTimeout(() => setShowDescription(true), 700); 
    setTimeout(() => setShowTokens(true), 1400); 
    setTimeout(() => setShowBanners(true), 1400); 
    setTimeout(() => setShowTokenSwap(true), 2000); 
  }
}, [address]);


useEffect(() => {
  if (!address) return;
  const timeout = setTimeout(() => {
    setShowVideo(false);
  }, 1000);
  return () => clearTimeout(timeout);
}, [address, showVideo]);

  useEffect(() => {
    if (!address) return;

    async function loadInscriptions() {
      const results: Record<string, Inscription[]> = {};

      for (const token of tokens) {
        if (!["froggi", "fungi", "pepi"].includes(token.key)) continue;

        const abi = abis[token.key as "froggi" | "fungi" | "pepi"];
        const contractAddress = token.address as `0x${string}`;
        const fn = getFunctionNames(token.key);
        const list: Inscription[] = [];

        try {
          const dynamic = await readContract(config, {
            abi,
            address: contractAddress,
            functionName: fn.sporesDegree,
            args: [address],
          }) as Seed;

          if (dynamic.seed && dynamic.seed !== 0n) {
const [svg, meta] = await Promise.all([
  readContract(config, {
    abi,
    address: contractAddress,
    functionName: "getSvg",
    args: [dynamic],
  }) as Promise<string>,
  readContract(config, {
    abi,
    address: contractAddress,
    functionName: "getMeta",
    args: [dynamic],
  }) as Promise<string>,
]);

list.push({
  id: `${token.key}-dynamic`,
  svg,
  seed: dynamic.seed.toString(),
  type: "Growing",
  meta: JSON.parse(meta),
});

          }
        } catch {}

        try {
          const count = await readContract(config, {
            abi,
            address: contractAddress,
            functionName: fn.mushroomCount,
            args: [address],
          }) as bigint;

          for (let i = 0n; i < count; i++) {
            try {
              const seed = await readContract(config, {
                abi,
                address: contractAddress,
                functionName: fn.mushroomOfOwnerByIndex,
                args: [address, i],
              }) as Seed;

const [svg, meta] = await Promise.all([
  readContract(config, {
    abi,
    address: contractAddress,
    functionName: "getSvg",
    args: [seed],
  }) as Promise<string>,
  readContract(config, {
    abi,
    address: contractAddress,
    functionName: "getMeta",
    args: [seed],
  }) as Promise<string>,
]);

list.push({
  id: `${token.key}-stable-${i}`,
  svg,
  seed: seed.seed.toString(),
  type: "Safe",
  meta: JSON.parse(meta),
});

            } catch {}
          }
        } catch {}

        results[token.key] = list;
      }

      setInscriptions(results);
    }

    loadInscriptions();
  }, [address, successMessage]);

  const visibleTokens = tokens.filter((t) => ["froggi", "fungi", "pepi"].includes(t.key));
  const activeToken = visibleTokens.find((t) => t.key === activeFilter);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const vid = document.getElementById("glitch-video") as HTMLVideoElement | null;
    if (!vid) return;
  
    vid.playbackRate = 0.5; 
  
    const glitchInterval = setInterval(() => {
      if (!vid || vid.paused || vid.readyState < 2) return;
  
      const shouldGlitch = Math.random() < 0.5; 
      if (shouldGlitch) {
        const duration = vid.duration;
        const jumpTime = Math.random() * duration;
        vid.currentTime = jumpTime;
      }
    }, 500); // check every 0.5s
  
    return () => clearInterval(glitchInterval);
  }, []);
  
  if (!mounted) return null;
  
  async function handleClick(
    key: "froggi" | "fungi" | "pepi",
    action: "stabilize" | "destabilize" | "combine",
    seed: string
  ) {
    try {
      setIsProcessing(true);
      setSuccessMessage("");
      await tokenStore.setTokenByKey(key);
      const value = BigInt(seed);
      const user = address as Address;

      if (action === "stabilize") {
        await stabilizeInscription(user, value);
        setSelectedInscription(null);
      }
      
      if (action === "destabilize") await destabilizeInscription(user, value);

      if (action === "combine") {
        const seeds = combineList.map(i => BigInt(i.seed));
        setConfirmedCombineList([...combineList]); // lock in the list before it changes
      
        await combineInscriptions(user, seeds);
      
        let i = 0;
        const step = Math.max(1500 / combineList.length, 100);
      
        const interval = setInterval(() => {
          setFadeOutIndex(i);
          i++;
          if (i >= combineList.length) {
            clearInterval(interval);
            setTimeout(() => {
              setConfirmedCombineList(null); // allow full list again
              setCombineList([]);
              setCombineMode(false);
              setFadeOutIndex(null);
            }, 400);
          }
        }, step);
      }
      

      const label =
        action === "destabilize" && selectedInscription?.type === "Growing"
          ? "Re-roll"
          : action.charAt(0).toUpperCase() + action.slice(1);

      setSuccessMessage(`${label} successful.`);
      setTimeout(() => setSuccessMessage(""),4000);
    } catch (e) {
      console.error(e);
      setSuccessMessage("Transaction failed.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } finally {
      setIsProcessing(false);

      const reload = async () => {
        const tokenKey = key;
        const abi = abis[tokenKey];
        const contractAddress = tokens.find(t => t.key === tokenKey)?.address as `0x${string}`;
        const fn = getFunctionNames(tokenKey);

        try {
          const dynamic = await readContract(config, {
            abi,
            address: contractAddress,
            functionName: fn.sporesDegree,
            args: [address],
          }) as Seed;

          if (dynamic.seed && dynamic.seed !== 0n) {
            const svg = await readContract(config, {
              abi,
              address: contractAddress,
              functionName: "getSvg",
              args: [dynamic],
            }) as string;

            const latest: Inscription = {
              id: `${tokenKey}-dynamic`,
              svg,
              seed: dynamic.seed.toString(),
              type: "Growing",
            };

            const prevSvg = selectedInscription?.svg ?? null;
            const isNew = latest.svg !== prevSvg;

            if (isNew) {
              setShowRollingGif(tokenKey);
              setTimeout(() => {
                setSelectedInscription(latest);
                setShowRollingGif(null);
              }, 2580);
            }
            
            
          }
        } catch {
          setSelectedInscription(null);
        }
      };

      if (action !== "combine") reload();
    }


  }
  
function extractTopTraits(meta: Record<string, unknown>, project: "froggi" | "fungi" | "pepi", seedStr: string): string[] {
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
    const resolveFungiColor = (hex: string) => FUNGUS_COLOR_NAMES[hex.toLowerCase()] || hex;

    if (meta.hasDots === "true") traits.push({ label: "Dots", value: resolveFungiColor(meta.dotsColor as string) });
    if (meta.cap !== undefined) traits.push({ label: "Cap", value: meta.cap as string });
    if (meta.capColor) traits.push({ label: "Color", value: resolveFungiColor(meta.capColor as string) });
    if (meta.stem) traits.push({ label: "Stem", value: meta.stem as string });
    if (meta.stemColor) traits.push({ label: "Spore", value: resolveFungiColor(meta.stemColor as string) });
    if (meta.groundColor) traits.push({ label: "Ground", value: resolveFungiColor(meta.groundColor as string) });
    if (meta.background) traits.push({ label: "BGR", value: resolveFungiColor(meta.background as string) });
  }

  if (project === "pepi") {
    const resolvePepiColor = (hex: string) => PEPI_COLOR_NAMES[hex.toLowerCase()] || hex;

    if ((meta.hat && meta.hat !== "0") || meta["Head"]) traits.push({ label: "Hat", value: (meta["Head Item"] || meta.hat) as string });
    if (meta.accessory && meta.accessory !== "0") traits.push({ label: "Accessory", value: meta.accessory as string });
    if (meta.ears && meta.ears !== "0") traits.push({ label: "Ears", value: meta.ears as string });
    if (meta.eyes && meta.eyes !== "0") traits.push({ label: "Eyes", value: meta.eyes as string });
    if (meta.mouth && meta.mouth !== "0") traits.push({ label: "Mouth", value: meta.mouth as string });
    if (meta.clothes && meta.clothes !== "0") traits.push({ label: "Clothes", value: meta.clothes as string });
    if (meta.bodyColor) traits.push({ label: "Color", value: resolvePepiColor(meta.bodyColor as string) });
    if (meta.background) traits.push({ label: "BGR", value: resolvePepiColor(meta.background as string) });
  }

  const seen = new Set<string>();
  return traits
    .filter((t) => !seen.has(t.label) && seen.add(t.label))
    .slice(0, 6)
    .map((t) => `${t.label}: ${t.value}`);
}


  return (
    <>
{selectedInscription && (
  <Head>
    <meta
      name="fc:frame"
      content={JSON.stringify({
        version: "next",
        imageUrl: `https://mini20i.vercel.app/api/png/${selectedInscription.id.split("-")[0]}/${selectedInscription.seed}?address=${address}`,
        button: {
          title: "Launch Mini20i",
          action: {
            type: "launch_frame",
            name: "mini20i",
            url: `https://mini20i.vercel.app/view/${selectedInscription.id.split("-")[0]}/${selectedInscription.seed}?address=${address}`,
          },
        },
      })}
    />
  </Head>
)}


      {isProcessing && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded shadow text-center text-lg text-black">Preparing transaction...</div>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-green-100 text-green-800 px-4 py-2 rounded shadow">
          {successMessage}
        </div>
      )}
{combineMode && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
  <div className="bg-[#1c1e24] border border-white/10 rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-white">
      <h2 className="text-lg font-semibold mb-4">Select Inscriptions to Combine</h2>
      <p className="text-sm mb-2">Select at least 2 stable inscriptions to enable combination.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {visibleTokens
          .flatMap((token) => inscriptions[token.key] || [])
          .filter((i) =>
            confirmedCombineList
              ? confirmedCombineList.some((sel) => sel.id === i.id)
              : combineList.length > 0 &&
                i.id.startsWith(combineList[0].id.split("-")[0])
          )
          
          
.map((insc, idx) => {
  const isSelected = combineList.some((i) => i.id === insc.id);
  const hasFadedOut =
    fadeOutIndex !== null && idx <= fadeOutIndex;

  return (
    <div
      key={insc.id}
      onClick={() =>
        setCombineList((prev) =>
          isSelected
            ? prev.filter((i) => i.id !== insc.id)
            : [...prev, insc]
        )
      }
      className={`border rounded shadow p-2 bg-white cursor-pointer transition-transform duration-500 ease-in-out
${isSelected ? "ring-4 ring-yellow-400 border-blue-300" : "border-white/10"}

        ${fadeOutIndex !== null && combineList[fadeOutIndex]?.id === insc.id
          ? "animate-shake-fade"
          : ""
        }
        ${hasFadedOut ? "opacity-0 pointer-events-none" : ""}
      `}
    >
      <div
        className="aspect-square w-full mb-1"
        dangerouslySetInnerHTML={{ __html: insc.svg }}
      />
      <div className="text-xs text-gray-400">Tokens: {insc.seed}</div>
    </div>
  );
})}

      </div>

      {combineList.length < 2 && (
        <p className="text-sm text-red-600 mb-4">You must select at least 2 inscriptions.</p>
      )}
      <div className="flex justify-between mt-4">
<button
  onClick={() => {
    setCombineMode(false);
    setCombineList([]);
    setConfirmedCombineList(null); // ensure full list repopulates on reopen
  }}
  className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded"
>
  Cancel
</button>
        <button
          disabled={combineList.length < 2}
          onClick={() =>
            handleClick(
              combineList[0].id.split("-")[0] as "froggi" | "fungi" | "pepi",
              "combine",
              "0"
            )
          }
          className={`px-4 py-2 text-sm rounded ${
            combineList.length < 2
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
{isSwapOpen && swapTokenKey && (
  <SwapModal
  tokenKey={swapTokenKey}
  onClose={() => {
    setIsSwapOpen(false);
    setSwapTokenKey(null);
  }}
  onSuccess={() => {
    setSuccessMessage("Swap successful!");
    setTimeout(() => setSuccessMessage(""), 4000);
  }}
  inscriptionList={inscriptions[swapTokenKey] || []}
/>


)}

<div className={`transition-opacity duration-700 ${showMiniKit ? "opacity-100" : "opacity-0"}`}>
  <Topnav />
</div>

      <div className="px-4 max-w-6xl mx-auto mb-28">
      <div className="relative w-full flex justify-center px-4 mt-10 mb-4">
      <div className="absolute inset-0 top-[-20px] bottom-[-170px] w-full z-0 overflow-hidden rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-md ring-1 ring-white/10">

    <video
      id="glitch-video"
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-70"
    >
      <source src="/aidos_head.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-[#1c1e24]/80 via-[#15171c]/70 to-transparent shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)]" />
  </div>
  <div className={`text-center z-10 transition-opacity duration-700 ${showDescription ? "opacity-100" : "opacity-0"}`}>
    <h1 className="text-4xl font-semibold">Mini 20i</h1>
    <p className="text-xs text-white-600 mt-1">View and swap ERC20i inscriptions</p>
  </div>
</div>




        <div className="flex flex-col items-center gap-2 mb-6">
          <p className="text-lg text-white font-semibold mb-2 z-10">
            {activeFilter === "all" ? "All" : `$${activeToken?.name}`}
          </p>

          <div className="relative w-full flex justify-center gap-4">
          <Image
  onClick={() => setActiveFilter("all")}
  src="https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg"
  alt="All Projects"
  width={56}
  height={56}
  className={`h-14 w-14 rounded-full border cursor-pointer hover:opacity-80 ${activeFilter === "all" ? "ring-2 ring-black" : ""}`}
/>
            {visibleTokens.map((t) => {
              const logo = t.key === "pepi"
                ? "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/pepi_logo.jpg"
                : t.logo;

              return (
<Image
  key={t.key}
  onClick={() => setActiveFilter(t.key)}
  src={logo}
  alt={t.name}
  width={56}
  height={56}
  className={`h-14 w-14 rounded-full border cursor-pointer hover:opacity-80 ${activeFilter === t.key ? "ring-2 ring-black" : ""}`}
/>
              );
            })}

{(!(context as { walletAddress?: `0x${string}` })?.walletAddress && !wagmiAddress) || showVideo ? (

  <div
    className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
      address ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}
  >
    <video
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover absolute inset-0 z-0"
    >
      <source src="/aidos_head.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="relative z-10 text-white text-center px-6">
      <div
        className="bg-white text-black px-6 py-4 rounded shadow-lg cursor-pointer hover:shadow-xl transition inline-block"
        onClick={() => connect({ connector: connectors[0] })}
      >
        <p className="text-lg font-semibold mb-2">Wallet Required</p>
        <p className="text-sm">Click here to connect your wallet.</p>
      </div>
    </div>
  </div>
) : null}

          </div>

          <p className="text-sm text-white-600 text-center max-w-xl mt-1 z-10">
            {activeFilter === "all"
              ? "Browse your Inscriptions or select by project"
              : activeToken?.about}
          </p>
        </div>

        {address && (
          <div className="flex flex-col gap-12">
            {visibleTokens
              .filter((token) => activeFilter === "all" || token.key === activeFilter)
              .map((token) => (
                <div key={token.key}>
<div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] px-4 sm:px-8 pb-2">
<div className="absolute inset-0 bottom-[-70px] top-[-12px] bg-gradient-to-b from-[#1c1e24]/80 via-[#15171c]/10 to-transparent shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)]" />

  <div className="relative z-10">
    {activeFilter === "all" && (
      <h3 className="text-xl font-semibold mt-6">{token.name}</h3>
    )}
    <div className={`transition-opacity duration-700 ${showBanners ? "opacity-100" : "opacity-0"}`}>
      <Image
        src={token.banner}
        alt={`${token.name} banner`}
        width={1024}
        height={360}
        className="w-full max-h-[420px] md:max-h-[360px] object-contain rounded shadow mt-3 cursor-pointer"
      />
    </div>
  </div>
</div>



<div className="mt-4">
<div className={`flex gap-3 mb-2 transition-opacity duration-700 z-[11] relative ${showTokens ? "opacity-100" : "opacity-0"}`}>


    <button
      onClick={() =>
        setActiveInfo((prev) =>
          prev === `progression-${token.key}` ? null : `progression-${token.key}`
        )
      }
      className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 shadow"
    >
      Progression
    </button>
    <button
      onClick={() =>
        setActiveInfo((prev) =>
          prev === `levels-${token.key}` ? null : `levels-${token.key}`
        )
      }
      className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 shadow"
    >
      Levels
    </button>
  </div>

{(activeInfo === `progression-${token.key}` || activeInfo === `levels-${token.key}`) && (
  <div
    onClick={() => setActiveInfo(null)}
    className="relative z-20"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700 leading-relaxed space-y-1 ${
        activeInfo === `progression-${token.key}` || activeInfo === `levels-${token.key}`
          ? "animate-fade-in"
          : "animate-fade-out"
      }`}      
    >
      {(() => {
        const raw = {
          "progression-fungi": `6 levels of $Fungi as your spore grows into a full fungi! Holding more tokens means more mycelium and an even mightier mushroom!`,
          "levels-fungi": [
            ["Level 0", "20,999 tokens or less"],
            ["Level 1", "21,000+ tokens"],
            ["Level 2", "525,000+ tokens"],
            ["Level 3", "1,050,000+ tokens"],
            ["Level 4", "1,575,000+ tokens"],
            ["Level 5", "2,100,000+ tokens"],
          ],
          "progression-froggi": `7 tiers of $Froggi from colorful eggs to fully decked out denizens. Holding more tokens evolves your egg, with more trait combinations unlocking at higher levels.`,
          "levels-froggi": [
            ["Level 0", "999 tokens or less"],
            ["Level 1", "1,000+ tokens"],
            ["Level 2", "3,000+ tokens"],
            ["Level 3", "10,000+ tokens"],
            ["Level 4", "30,000+ tokens"],
            ["Level 5", "60,000+ tokens"],
            ["Level 6", "120,000+ tokens"],
          ],
          "progression-pepi": `6 levels of $Pepi let you see your Pepi grow from egg cluster, to tadpole, to fully mature. Each tier of Pepi offers a unique stage of growth for your inscription.`,
          "levels-pepi": [
            ["Level 0", "10 tokens or less"],
            ["Level 1", "11–21 tokens"],
            ["Level 2", "22–32 tokens"],
            ["Level 3", "33–43 tokens"],
            ["Level 4", "44–55 tokens"],
            ["Level 5", "56+ tokens"],
          ],
        };

        const val = raw[activeInfo as keyof typeof raw];
        if (!val) return null;

        if (typeof val === "string") {
          return <p>{val}</p>;
        }

        return val.map(([label, detail], idx) => (
          <p key={idx}>
            <span className="font-semibold">{label}</span> – {detail}
          </p>
        ));
      })()}
    </div>
  </div>
)}


</div>

<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
  {(inscriptions[token.key] || []).map((inscription) => {
    const isSelected = combineList.some(i => i.id === inscription.id);
    return (
<div
  key={inscription.id}
  onClick={() => {
    if (combineMode && inscription.type === "Safe") {
      setCombineList((prev) =>
        prev.some((i) => i.id === inscription.id)
          ? prev.filter((i) => i.id !== inscription.id)
          : [...prev, inscription]
      );
    } else {
      setSelectedInscription(inscription);
    }
  }}
  className={`bg-[#1c1e24] border border-white/10 rounded-xl shadow-md p-3 cursor-pointer transition hover:scale-[1.02] hover:ring-1 hover:ring-white/20 ${
    isSelected ? "ring-2 ring-purple-400" : ""
  }`}
>
  <div
    className="w-full aspect-square mb-2 rounded overflow-hidden bg-black"
    dangerouslySetInnerHTML={{ __html: inscription.svg }}
  />
<div className="flex flex-col gap-1 mt-2 text-xs text-white/80">
<div className="text-xs text-white/80">
  <div className="flex flex-wrap gap-x-6 mb-1 sm:justify-center">
    <span>Tokens: {inscription.seed}</span>
    <span>Type: {inscription.type}</span>
  </div>

    <div className="grid grid-cols-3 gap-1">
{inscription.meta && (
  <div className="grid grid-cols-3 gap-1 mt-1 text-white/80 text-xs">
    {(typeof window !== "undefined" && window.innerWidth > 768) || selectedInscription?.id === inscription.id ? (
      extractTopTraits(
        inscription.meta,
        inscription.id.split("-")[0] as "froggi" | "fungi" | "pepi",
        inscription.seed
      ).map((trait, i) => (
        <div
          key={`trait-${i}`}
          className="px-1 py-0.5 bg-white/10 rounded shadow text-center"
        >
          {trait}
        </div>
      ))
    ) : null}
  </div>
)}

    </div>
  </div>
</div>

</div>

    );
  })}

<div className={`transition-opacity duration-700 ${showTokenSwap ? "opacity-100" : "opacity-0"}`}>
  <div
    className="bg-[#1c1e24] border border-white/10 rounded-xl shadow-md p-3 cursor-pointer transition hover:scale-[1.02] hover:ring-1 hover:ring-white/20"
    onClick={() => {
      setIsSwapOpen(true);
      setSwapTokenKey(token.key as "froggi" | "fungi" | "pepi");
    }}
  >
<div className="w-full mb-6 rounded flex items-center justify-center">
  <div className="mt-6 w-full h-full flex items-start">
    <Image
      src={`${token.buyImage}`}
      alt={`${token.name} buy more`}
      className="w-full h-auto object-contain hover:opacity-90 transition"
      width={512}
      height={512}
    />
  </div>
</div>




  </div>
</div>


</div>

                </div>
              ))}
          </div>
        )}

    {selectedInscription && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
  <div className="bg-[#1c1e24] border border-white/10 rounded-xl shadow-xl p-6 max-w-lg w-full text-white">
<div className="flex flex-col items-center justify-center mb-4 relative text-white/90">
  <div className="flex gap-6 text-lg">
    <div>
      <span className="font-semibold">Tokens: </span> {selectedInscription.seed}
    </div>
    <div>
      <span className="font-semibold">Type: </span> {selectedInscription.type}
    </div>
  </div>
  <button
    onClick={() => setSelectedInscription(null)}
    className="absolute top-0 right-0 text-white/80 hover:text-white"
  >
    ✕
  </button>
</div>

          <div className="w-full aspect-square mb-4 relative bg-black rounded overflow-hidden">
  <div
    className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-[500ms] ${
      showRollingGif ? 'opacity-0 delay-[100ms]' : 'opacity-100'
    }`}
    dangerouslySetInnerHTML={{ __html: selectedInscription.svg }}
  />


  {showRollingGif && (
    <Image
      src={LOADING_GIFS[showRollingGif]}
      alt="Loading animation"
      fill
      unoptimized
      className="absolute inset-0 object-contain z-20 transition-opacity duration-[500ms] ${
        showRollingGif ? 'opacity-100' : 'opacity-0'
      } delay-[100ms]"
    />
  )}
</div>
{selectedInscription.meta && (
  <div className="grid grid-cols-3 gap-1 mt-4 text-xs text-white/80">
    {extractTopTraits(
      selectedInscription.meta,
      selectedInscription.id.split("-")[0] as "froggi" | "fungi" | "pepi",
      selectedInscription.seed
    ).map((trait, i) => (
      <div
        key={`trait-${i}`}
        className="px-1 py-0.5 bg-white/10 rounded shadow text-center"
      >
        {trait}
      </div>
    ))}
  </div>
)}


          <div className="flex flex-row justify-between items-end mt-4 gap-3">
          <div className="flex gap-3 flex-wrap">
  {selectedInscription.id.startsWith("froggi") && selectedInscription.type === "Safe" && (
    <button
      onClick={() =>
        handleClick("froggi", "destabilize", selectedInscription.seed)
      }
      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded"
    >
      Unstash
    </button>
  )}

  {selectedInscription.id.startsWith("froggi") && selectedInscription.type === "Growing" && (
    <button
      onClick={() =>
        handleClick("froggi", "stabilize", selectedInscription.seed)
      }
      className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded"
    >
      Stash
    </button>
  )}

  {(inscriptions[selectedInscription.id.split("-")[0]]?.filter(i => i.type === "Safe").length ?? 0) > 1 && (
    <button
      onClick={() => {
        setCombineMode(true);
        setCombineList([selectedInscription]);
        setSelectedInscription(null);
      }}
      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded"
    >
      Combine
    </button>
  )}




{selectedInscription.type === "Safe" ? (
  (inscriptions[selectedInscription.id.split("-")[0]]?.some(i => i.type === "Growing") ? null : (
    <button
      onClick={() => {
        setSelectedInscription(null);
        setSwapTokenKey(selectedInscription.id.split("-")[0] as "froggi" | "fungi" | "pepi");
        setIsSwapOpen(true);
      }}
      className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded"
    >
    Start New
    </button>
  ))
) : (
  <button
    onClick={() => {
      setSelectedInscription(null);
      setSwapTokenKey(selectedInscription.id.split("-")[0] as "froggi" | "fungi" | "pepi");
      setIsSwapOpen(true);
    }}
    className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 rounded"
  >
    Add more
  </button>
)}

</div>

<div className="flex flex-col gap-2">

<ShareButton
  seed={selectedInscription.seed}
  project={selectedInscription.id.split("-")[0] as "froggi" | "fungi" | "pepi"}
  svg={selectedInscription.svg}
/>

  <button
    onClick={() => setSelectedInscription(null)}
    className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded"
  >
    Close
  </button>
</div>

          </div>
        </div>
      </div>
    )}

       {/* <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="border rounded-full py-2 px-4 text-sm inline-block hover:bg-gray-100 mt-10">
          Join the Telegram <span className="ml-2 inline-block">↗</span>
        </a> */}
      </div>
    </>
  );
}