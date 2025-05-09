"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";

type ShareButtonProps = {
  seed: string;
  project: "froggi" | "fungi" | "pepi";
  svg: string;
};

export default function ShareButton({ seed, project, svg }: ShareButtonProps) {
  // @ts-expect-error: 'share' exists at runtime
  const { share } = useMiniKit();
  const openUrl = useOpenUrl();

  const isFrame = typeof window !== "undefined" && window.parent !== window;
  const canShare = isFrame && typeof share === "function";

  const shareText = `Check out my ${project} inscription! #ERC20i`;

  const svgToPng = async (svg: string): Promise<string> => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 600, 600);
    URL.revokeObjectURL(url);

    return canvas.toDataURL("image/png");
  };

  const handleShare = async () => {
    const png = await svgToPng(svg);

const address = (window as unknown as { ethereum?: { selectedAddress?: string } })?.ethereum?.selectedAddress ?? "anon";

await fetch(`/api/og/${project}/${seed}?address=${address}`, {
      method: "POST",
      body: JSON.stringify({ image: png }),
      headers: { "Content-Type": "application/json" },
    });

const imageUrl = `https://mini20i.vercel.app/og/${project}/${seed}-${address}.png`;


    if (canShare) {
      await share({
        title: shareText,
        body: shareText,
        image: imageUrl,
      });
    } else {
      openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          shareText
        )}&embeds=${encodeURIComponent(imageUrl)}`
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
