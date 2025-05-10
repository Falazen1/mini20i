"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";

type ShareButtonProps = {
  seed: string;
  project: "froggi" | "fungi" | "pepi";
  svg: string;
};

export default function ShareButton({ seed, project, svg }: ShareButtonProps) {
  // @ts-expect-error: share exists at runtime in MiniKit environments
  const { share } = useMiniKit();
  const openUrl = useOpenUrl();

  const isFrame =
    typeof window !== "undefined" && window.parent !== window;
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
    const fullImageUrl = `https://mini20i.vercel.app${url}`;

    const preload = new Image();
    preload.src = fullImageUrl;
    await new Promise((res) => (preload.onload = res));

    if (canShare) {
      await share({
        title: `Check out my ${project} inscription! #ERC20i`,
        body: `Check out my ${project} inscription! #ERC20i`,
        image: fullImageUrl,
      });
    } else {
      openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          `Check out my ${project} inscription! #ERC20i`
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
