import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export function useActiveAddress() {
  const context = useMiniKit();
  const wagmiAddress = useAccount().address;
  const [active, setActive] = useState<string | undefined>(
    (context as { walletAddress?: string })?.walletAddress ?? wagmiAddress
  );

  useEffect(() => {
    const mini = (context as { walletAddress?: string })?.walletAddress;
    setActive(mini ?? wagmiAddress);
  }, [context, wagmiAddress]);

  return active;
}
