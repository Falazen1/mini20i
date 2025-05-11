"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";

type ShareButtonProps = {
  seed: string;
  project: "froggi" | "fungi" | "pepi" | "jelli";
  svg: string;
  traits?: string[];
};

function formatTraitsForShare(traits: string[]): string[] {
  const isEgg = traits.some((t) => t.startsWith("Pattern:"));

  return traits
    .filter((trait) => {
      const key = trait.split(":")[0].trim();
      if (isEgg) {
        // Only keep Pattern and Wiggle for eggs
        return key === "Pattern" || key === "Wiggle";
      }
      return true;
    })
    .slice(0, 6)
    .map((trait) => {
      const colonIndex = trait.indexOf(":");
      if (colonIndex === -1) return trait.trim();

      const key = trait.slice(0, colonIndex).trim();
      const val = trait.slice(colonIndex + 1).trim();

      if (key === "Eyes" || key === "Eyewear") {
        if (["Goggles", "Monocle", "3D Glasses", "Shades", "Scouter"].some((v) => val.includes(v))) {
          return val;
        }
        return `${val} Glasses`;
      }

      if (key === "Clothes") {
        const clothesMap: Record<string, string> = {
          Chain: "Gold Chain",
          Knight: "Knight Armor",
          Cyborg: "Cyborg Armor",
          Astronaut: "Astronaut Suit",
          Leather: "Leather Jacket",
        };
        return clothesMap[val] || val;
      }

      if (key === "Hat") {
        const hatMap: Record<string, string> = {
          Brain: "Exposed Brain",
          Wizard: "Wizard Hat",
          Knight: "Knight Helmet",
          Straw: "Straw Hat",
          Cap: "Baseball Cap",
          Spiked: "Spiked Helmet",
          Shroom: "Shroom Cap",
          Cowboy: "Cowboy Hat",
          Explorer: "Explorer Hat",
          Cream: "Cream Cap",
          Crown: "Royal Crown",
          Pirate: "Pirate Hat",
          Adventurer: "Adventurer Hat",
          Fedora: "Fedora",
          Beanie: "Beanie",
          Mohawk: "Mohawk",
          Leaf: "Leaf Crown",
        };
        return hatMap[val] || `${val} Hat`;
      }

      if (key === "Pattern") {
        const patternMap: Record<string, string> = {
          "0": "Tye-dye Egg",
          "1": "Spotted Egg",
          "2": "Wavey Egg",
          "3": "Striped Egg",
          "4": "Fractal Egg",
        };
        return patternMap[val] || `${val} Egg`;
      }

      if (key === "Wiggle") {
        const wiggleMap: Record<string, string> = {
          "2": "Shaking Wiggle",
          "3": "Floating Wiggle",
          "4": "Jumping Wiggle",
          "5": "Pulsing Wiggle",
          "6": "Rocking Wiggle",
        };
        return wiggleMap[val] || `${val} Wiggle`;
      }

      if (["Color", "Sky", "Ground", "Stem", "Dots"].includes(key)) {
        return `${val} ${key}`;
      }

      if (key === "Anim BG") return "Animated Background";
      if (key === "Anim Body") return "Animated Body";

      return `${key} ${val}`;
    });
}


export default function ShareButton({ seed, project, svg, traits }: ShareButtonProps) {
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
    const fullImageUrl = url;

    const preload = new Image();
    preload.src = fullImageUrl;
    await new Promise((res) => (preload.onload = res));

const formatted = formatTraitsForShare(traits ?? []);
const seedNum = parseInt(seed, 10);
let message = "";

if (project === "froggi" && seedNum <= 2999) {
  const patternTrait = formatted.find((t) => t.includes("Egg"))?.replace(" Egg", "") ?? "";
  message = `Check out my ${patternTrait} Froggi Egg! Mini-20i.app $froggi`;
} else {
  let traitText = "!";
  if (formatted.length === 1) {
    traitText = ` with ${formatted[0]}!`;
  } else if (formatted.length >= 2) {
    traitText = ` with ${formatted[0]} and ${formatted[1]}!`;
  }
  message = `Check out my ${project}${traitText} Mini-20i.app $${project}`;
}


    if (canShare) {
      await share({
        title: message,
        body: message,
        image: fullImageUrl,
        url: "https://mini-20i.app",

      });
    } else {
      openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          message
        )}&embeds[]=${encodeURIComponent(fullImageUrl)}`
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
