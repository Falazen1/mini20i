"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Token = {
  name: string;
  symbol: string;
  address: string;
  banner: string;
  logo: string;
  about: string;
  pairAddress?: string;
};

type Props = {
  token: Token;
};

export default function HomeDiscoverListItem({ token }: Props) {
  const [tokenPair, setTokenPair] = useState<any>(null);

  useEffect(() => {
    async function fetchPrice() {
      if (!token.pairAddress) return;
      try {
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/pairs/base/${token.pairAddress}`
        );
        const data = await response.json();
        setTokenPair(data.pair);
      } catch (error) {
        console.error("Error when getting price:", error);
      }
    }
    fetchPrice();
  }, [token.pairAddress]);

  return (
    <Link
      href={`/${token.address}`}
      className="rounded transition-all duration-300 overflow-hidden block"
    >
      <div
        className="h-[120px] bg-cover bg-center relative"
        style={
          token.banner.startsWith("#")
            ? { backgroundColor: token.banner }
            : { backgroundImage: `url('${token.banner}')` }
        }
      >
        <div className="w-full h-full bg-black bg-opacity-60 px-3 py-3 text-white">
          <div className="flex items-start gap-2">
            <Image
              src={token.logo}
              alt="logo"
              width={24}
              height={24}
              className="rounded-full mt-0.5"
            />
            <h3 className="text-xl">
              <span className="font-semibold">{token.name}</span>
              <span> / {token.symbol}</span>
            </h3>
          </div>

          {tokenPair && (
            <div className="absolute bottom-3 right-4 flex flex-col items-end font-semibold">
              <div className="leading-4">${tokenPair.priceUsd}</div>
              <div
                className={`text-xs ${
                  tokenPair.priceChange.h6 > 0
                    ? "text-green-500"
                    : tokenPair.priceChange.h6 < 0
                    ? "text-red-500"
                    : ""
                }`}
              >
                {tokenPair.priceChange.h6 > 0 ? "+" : ""}
                {tokenPair.priceChange.h6}%
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-3 leading-5 text-sm bg-base-200 h-full">
        {token.about}
      </div>
    </Link>
  );
}
