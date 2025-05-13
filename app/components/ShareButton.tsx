"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";
import html2canvas from "html2canvas";

type ShareButtonProps = {
  seed: string;
  project: "froggi" | "fungi" | "pepi" | "jelli";
  svg: string;
  traits?: string[];
};
import { FROGGI_HATS, FROGGI_EYEWEAR, FROGGI_CLOTHES } from "../helpers/froggi";

function formatTraitsForShare(traits: string[]): string[] {
  const isEgg = traits.some((t) => t.startsWith("Pattern:"));

  return traits
    .filter((trait) => {
      const key = trait.split(":")[0]?.trim();
      if (!key) return false;
      if (isEgg) return key === "Pattern" || key === "Wiggle";
      return true;
    })
    .slice(0, 6)
    .map((trait) => {
      const [keyRaw, valRaw] = trait.split(":").map(s => s.trim());
          const hatNameMap: Record<string, string> = {
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
          Warty: "Warty Cap",
        };    const id = /^\d+$/.test(valRaw) ? valRaw : null;

      if (keyRaw === "Hat") {
        const label = id ? FROGGI_HATS[id] : valRaw;

        return hatNameMap[label] || label || "Unknown Hat";
      }
const eyewearMap: Record<string, string> = {
  Glasses: "Classic Glasses",
  Goggles: "Froggi Goggles",
  Shiny: "Shiny Lenses",
  Red: "Red Glasses",
  Styled: "Styled Frames",
  Reflex: "Reflective Shades",
  Dark: "Dark Glasses",
  Shades: "Cool Shades",
  Scouter: "Power Scouter",
  Broken: "Broken Glasses",
  Reading: "Reading Glasses",
  "3D": "3D Glasses",
  Monocle: "Monocle",
  Jungle: "Jungle Goggles",
};
if (keyRaw === "Eyewear" || keyRaw === "Eyes") {
  const raw = id ? FROGGI_EYEWEAR[id] : valRaw;
  const label = eyewearMap[raw] || `${raw} Glasses`;
  return label;
}


      if (keyRaw === "Clothes") {
        const label = id ? FROGGI_CLOTHES[id] : valRaw;
const reworded: Record<string, string> = {
  Bowtie: "Bowtie",
  Cape: "Hero Cape",
  Collar: "Dress Collar",
  Hoodie: "Hoodie",
  Suit: "Formal Suit",
  Turtleneck: "Turtleneck Sweater",
  Scarf: "Wool Scarf",
  Leather: "Leather Jacket",
  Bandana: "Bandana",
  Stripes: "Striped Shirt",
  Plaid: "Plaid Shirt",
  Knight: "Knight Armor",
  Chain: "Gold Chain",
  Cyborg: "Cyborg Armor",
  Astronaut: "Astronaut Suit",
  GoldChain: "Gold Chain", // in case mapped directly
};

        return reworded[label] || label;
      }

      if (keyRaw === "Pattern") {
        const eggMap: Record<string, string> = {
          "0": "Unique Egg",
          "1": "Spotted Egg",
          "2": "Wavey Egg",
          "3": "Striped Egg",
          "4": "Fractal Egg",
        };
        return eggMap[valRaw] || `${valRaw} Egg`;
      }

      if (keyRaw === "Wiggle") {
        const wiggleMap: Record<string, string> = {
          "2": "Shaking Wiggle",
          "3": "Floating Wiggle",
          "4": "Jumping Wiggle",
          "5": "Pulsing Wiggle",
          "6": "Rocking Wiggle",
        };
        return wiggleMap[valRaw] || `${valRaw} Wiggle`;
      }

      if (["Color", "Sky", "Ground", "Stem", "Dots"].includes(keyRaw)) {
        return `${valRaw} ${keyRaw}`;
      }

if (keyRaw === "BGR" && valRaw === "Anim") return "Background Animation";
if (keyRaw === "Anim Body") return "Animated Body";


      return `${keyRaw} ${valRaw}`;
    });
}



export default function ShareButton({ seed, project, traits }: ShareButtonProps) {
  // @ts-expect-error: share exists at runtime in MiniKit environments
  const { share } = useMiniKit();
  const openUrl = useOpenUrl();

  const isFrame = typeof window !== "undefined" && window.parent !== window;
  const canShare = isFrame && typeof share === "function";
const svgToPng = async (): Promise<string> => {
  const el = document.getElementById("share-capture");
  if (!el) throw new Error("share-capture element not found");

  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 1)); // Let layout stabilize

  const canvas = await html2canvas(el, {
    backgroundColor: "#1c1e24",
    scale: 2,
    useCORS: true,
  });

  return canvas.toDataURL("image/png");
};

const handleShare = async () => {
  const controls = document.getElementById("share-controls");
  const container = document.getElementById("share-capture");

  if (!container) throw new Error("share-capture element not found");
  if (controls) controls.style.display = "none";

  container.classList.add("screenshot-mode"); // ⬅️ ADD THIS LINE

  try {
    const png = await svgToPng();

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
      const patternTrait = formatted.find((t) =>
        t.includes("Egg")
      )?.replace(" Egg", "") ?? "";
      message = `Check out my ${patternTrait} Froggi Egg!\nwarpcast.com/miniapps/CL_gnv6CCuBy/mini-20i $froggi`;
    } else {
      let traitText = "!";
      if (formatted.length === 1) {
        traitText = ` with ${formatted[0]}!`;
      } else if (formatted.length >= 2) {
        traitText = ` with ${formatted[0]} and ${formatted[1]}!`;
      }
      message = `Check out my ${project}${traitText}\nwarpcast.com/miniapps/CL_gnv6CCuBy/mini-20i $${project}`;
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
  } finally {
    container.classList.remove("screenshot-mode"); // ⬅️ REMOVE after screenshot
    if (controls) controls.style.display = "";
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
