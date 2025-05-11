"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";
import { FROGGI_HATS, FROGGI_EYEWEAR, FROGGI_CLOTHES } from "../helpers/froggi";
import { FUNGUS_COLOR_NAMES } from "../helpers/colors";
import { PEPI_COLOR_NAMES } from "../helpers/colors";

type ShareButtonProps = {
  seed: string;
  project: "froggi" | "fungi" | "pepi";
  svg: string;
  meta?: Record<string, unknown>;
};

export default function ShareButton({ seed, project, svg, meta }: ShareButtonProps) {
  // @ts-expect-error: share exists at runtime in MiniKit environments
  const { share } = useMiniKit();
  const openUrl = useOpenUrl();

  const isFrame = typeof window !== "undefined" && window.parent !== window;
  const canShare = isFrame && typeof share === "function";

  const svgToPng = async (svg: string): Promise<string> => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, 600, 600);
    URL.revokeObjectURL(url);

    return canvas.toDataURL("image/png");
  };

  const extractTopTraits = (): string[] => {
    if (!meta) return [];

    const traits: string[] = [];

    if (project === "froggi") {
      const seedNum = parseInt(seed, 10);
      if (seedNum <= 2999) {
        if (meta.egg) traits.push(meta.egg as string);
        if (meta.eggPalette) traits.push(meta.eggPalette as string);
        if (meta.eggAnimation) traits.push(meta.eggAnimation as string);
        if (meta.animateBg === "true") traits.push("Animated BG");
      } else {
        if (meta.hatBool === "true") traits.push(FROGGI_HATS[meta.hat as string] || meta.hat as string);
        if (meta.eyewearBool === "true") traits.push(FROGGI_EYEWEAR[meta.eyewear as string] || meta.eyewear as string);
        if (meta.clothesBool === "true") traits.push(FROGGI_CLOTHES[meta.clothes as string] || meta.clothes as string);
        if (meta.expression) traits.push(meta.expression as string);
        if (meta.bg) traits.push(meta.bg as string);
        if (meta.animateBg === "true") traits.push("Animated BG");
        if (meta.animateBody === "true") traits.push("Animated Body");
        if (meta.eyes) traits.push(meta.eyes as string);
        if (meta.body) traits.push(meta.body as string);

      }
    }

    if (project === "fungi") {
      const resolveColor = (hex: string) => FUNGUS_COLOR_NAMES[hex.toLowerCase()] || hex;
      if (meta.hasDots === "true") traits.push(resolveColor(meta.dotsColor as string));
      if (meta.cap !== undefined) traits.push(meta.cap as string);
      if (meta.capColor) traits.push(resolveColor(meta.capColor as string));
      if (meta.stem) traits.push(meta.stem as string);
      if (meta.stemColor) traits.push(resolveColor(meta.stemColor as string));
      if (meta.groundColor) traits.push(resolveColor(meta.groundColor as string));
      if (meta.background) traits.push(resolveColor(meta.background as string));
    }

    if (project === "pepi") {
      const resolveColor = (hex: string) => PEPI_COLOR_NAMES[hex.toLowerCase()] || hex;
      if ((meta.hat && meta.hat !== "0") || meta["Head"]) traits.push((meta["Head Item"] || meta.hat) as string);
      if (meta.accessory && meta.accessory !== "0") traits.push(meta.accessory as string);
      if (meta.ears && meta.ears !== "0") traits.push(meta.ears as string);
      if (meta.eyes && meta.eyes !== "0") traits.push(meta.eyes as string);
      if (meta.mouth && meta.mouth !== "0") traits.push(meta.mouth as string);
      if (meta.clothes && meta.clothes !== "0") traits.push(meta.clothes as string);
      if (meta.bodyColor) traits.push(resolveColor(meta.bodyColor as string));
      if (meta.background) traits.push(resolveColor(meta.background as string));
    }

    return traits.slice(0, 2); // only top 2
  };

  const buildShareText = (traits: string[]): string => {
    if (traits.length === 2) return `Check out this ${project} with ${traits[0]} and ${traits[1]}!`;
    if (traits.length === 1) return `Check out this ${project} with ${traits[0]}!`;
    return `Check out my ${project} inscription! #ERC20i`;
  };

  const handleShare = async () => {
    const png = await svgToPng(svg);
    const address =
      (typeof window !== "undefined" &&
        (window as Window & { ethereum?: { selectedAddress?: string } })
          .ethereum?.selectedAddress?.toLowerCase()) || "anon";

    const postRes = await fetch(
      `/api/og/${project}/${seed}?address=${address}`,
      {
        method: "POST",
        body: JSON.stringify({ image: png }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const { url } = await postRes.json();
    const fullImageUrl = `https://mini20i.vercel.app${url}`;

    const preload = new Image();
    preload.src = fullImageUrl;
    await new Promise((res) => (preload.onload = res));

    const traits = extractTopTraits();
    const message = buildShareText(traits);
    const permalink = `https://mini20i.vercel.app/?project=${project}&seed=${seed}`;

    if (canShare) {
      await share({
        title: message,
        body: message,
        image: fullImageUrl,
        url: permalink,
      });
    } else {
      openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          message
        )}&embeds[]=${encodeURIComponent(fullImageUrl)}&embeds[]=${encodeURIComponent(permalink)}`
      );
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition"
    >
      Share
    </button>
  );
}
