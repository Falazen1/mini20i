"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import tokens from "../helpers/tokens.json";
import { Token } from "@coinbase/onchainkit/token";
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToggleButton,
} from "@coinbase/onchainkit/swap";

const ETHToken: Token = {
  address: "",
  chainId: 8453,
  decimals: 18,
  name: "Ether",
  symbol: "ETH",
  image: "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/baseeth_logo.png",
};

const USDCToken: Token = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chainId: 8453,
  decimals: 6,
  name: "USDc",
  symbol: "USDc",
  image: "https://basescan.org/token/images/centre-usdc_28.png",
};

const extraTokens: Token[] = [ETHToken, USDCToken];

export default function SwapModal({
  tokenKey,
  onClose,
}: {
  tokenKey: "froggi" | "fungi" | "pepi";
  onClose: () => void;
}) {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const buyToken = tokens.find((t) => t.key === tokenKey);
  if (!buyToken || !address) return null;

  const buyTokenObj: Token = {
    address: buyToken.address,
    chainId: 8453,
    decimals: buyToken.decimals,
    name: buyToken.name,
    symbol: buyToken.symbol,
    image: buyToken.logo,
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center">
          Swap for {buyToken.name}
        </h3>
        <Swap address={address}>
          <SwapAmountInput
            label="Sell"
            swappableTokens={[...extraTokens, buyTokenObj]}
            token={ETHToken}
            type="from"
          />
          <SwapToggleButton />
          <SwapAmountInput
            label="Buy"
            swappableTokens={[...extraTokens, buyTokenObj]}
            token={buyTokenObj}
            type="to"
          />
          <SwapButton
            onStart={() => {
              setIsPending(true);
              setIsSuccess(false);
              setIsError(false);
            }}
            onSuccess={() => {
              setIsPending(false);
              setIsSuccess(true);
            }}
            onError={() => {
              setIsPending(false);
              setIsError(true);
            }}
          />
          <SwapMessage className="text-red-600" />
        </Swap>

        {isPending && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Transaction pending...
          </p>
        )}
        {isSuccess && (
          <p className="text-center text-green-600 mt-4 font-semibold">
            Swap successful!
          </p>
        )}
        {isError && (
          <p className="text-center text-red-600 mt-4">
            Something went wrong.
          </p>
        )}
      </div>
    </div>
  );
}
