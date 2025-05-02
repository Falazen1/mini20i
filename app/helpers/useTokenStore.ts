// store/useTokenStore.ts

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { readContract } from "@wagmi/core";
import tokens from "./tokens.json";
import abis from "./abi";
import { config } from "./wagmiConfig";
import { createInscriptionReader } from "./useInscription";
import { tokenRef } from "./useTransaction";

export function useTokenStore() {
  const { address } = useAccount();

  const [inscriptions, setInscriptions] = useState([]);
  const [balanceUnits, setBalanceUnits] = useState<bigint>(0n);
  const [initializing, setInitializing] = useState(false);
  const [tokenKey, setTokenKey] = useState<"froggi" | "fungi" | "pepi" | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [abiComputed, setAbiComputed] = useState<any>(null);
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  async function setTokenByKey(key: "froggi" | "fungi" | "pepi") {
    const info = tokens.find((t) => t.key === key);
    if (!info) throw new Error("Invalid token key");

    const abi = abis[key];
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
  };
}
