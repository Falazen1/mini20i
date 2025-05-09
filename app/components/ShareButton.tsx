"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";

type ShareButtonProps = {
  seed: string;
  project: "froggi" | "fungi" | "pepi";
};

export default function ShareButton({ seed, project }: ShareButtonProps) {
  // @ts-expect-error: injected at runtime inside Warpcast frame
  const { share } = useMiniKit();
  const openUrl = useOpenUrl();

  const isFrame = typeof window !== "undefined" && window.parent !== window;
  const canShare = isFrame && typeof share === "function";

  const shareText = `Check out my ${project} inscription! #ERC20i`;

  const address =
    (window as unknown as { ethereum?: { selectedAddress?: string } })?.ethereum
      ?.selectedAddress ?? "anon";

  const imageUrl = `https://mini20i.vercel.app/api/og/${project}/${seed}?address=${address}`;

  const handleShare = async () => {
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
