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
    typeof window !== "undefined" &&
    typeof window.ethereum === "object" &&
    typeof window.ethereum.selectedAddress === "string"
      ? window.ethereum.selectedAddress
      : "anon";

  const sharePageUrl = `https://mini20i.vercel.app/view/${project}/${seed}?address=${address}`;

  const handleShare = async () => {
    if (canShare) {
      await share({
        title: shareText,
        body: shareText,
        image: sharePageUrl,
      });
    } else {
      openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          shareText
        )}&embeds=${encodeURIComponent(sharePageUrl)}`
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
