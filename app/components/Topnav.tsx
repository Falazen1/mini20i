"use client";

import Link from "next/link";
import { useConnect } from "wagmi";

export default function Topnav({ address, isWarpcast }: { address?: string; isWarpcast?: boolean }) {
  const { connect, connectors } = useConnect();

  const isConnected = !!address || isWarpcast;

  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100 px-4 shadow-sm">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-1">
            <button className="text-xl">Mini 20i</button>
          </Link>
        </div>

        <div className="navbar-center" />

        <div className="navbar-end">
          {!isConnected && (
            <button
              className="text-sm bg-white text-black rounded px-4 py-2"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
