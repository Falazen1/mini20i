"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress, type Abi } from "viem";
import { readContract } from "@wagmi/core";
import tokens from "./tokens.json";
import abis from "./abi";
import { config } from "./wagmiConfig";
import { createInscriptionReader } from "./useInscription";
import { tokenRef } from "./useTransaction";
import type { Inscription } from "./types";

export type TokenKey = "froggi" | "fungi" | "pepi" | "jelli";

export type TokenInfo = {
  name: string;
  symbol: string;
  logo: string;
  banner: string;
  about: string;
  address: `0x${string}`;
  key: TokenKey;
  decimals: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  pairAddress?: `0x${string}`;
};

export function useTokenStore() {
  const { address } = useAccount();

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [balanceUnits, setBalanceUnits] = useState<bigint>(0n);
  const [initializing, setInitializing] = useState(false);
  const [tokenKey, setTokenKey] = useState<TokenKey | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [abiComputed, setAbiComputed] = useState<Abi | null>(null);
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  async function setTokenByKey(key: TokenKey) {
    const info = tokens.find((t) => t.key === key) as TokenInfo | undefined;
    if (!info) throw new Error("Invalid token key");

    const abi = abis[key] as Abi;
    const addressStr = info.address as `0x${string}`;
    const decimals = info.decimals;

    setTokenKey(key);
    setTokenInfo(info);
    setAbiComputed(abi);
    setTokenAddress(addressStr);
    setTokenDecimals(decimals);

    tokenRef.tokenAddress = addressStr;
    tokenRef.abiComputed = abi;
    tokenRef.tokenDecimals = decimals;

    if (address && isAddress(address)) {
      setInitializing(true);
      const { getInscriptionsByAddress } = createInscriptionReader(addressStr, abi, key);

      const balance = await readContract(config, {
        abi,
        address: addressStr,
        functionName: "balanceOf",
        args: [address],
      });

      const ins = await getInscriptionsByAddress(address);
      setBalanceUnits(balance as bigint);
      setInscriptions(ins); 
      setInitializing(false);
    }
  }

  function init() {
    // legacy stub — no-op.
  }

  return {
    inscriptions,
    balanceUnits,
    initializing,
    tokenKey,
    tokenInfo,
    abiComputed,
    tokenAddress,
    tokenDecimals,
    setTokenByKey,
    init,
  };
}
