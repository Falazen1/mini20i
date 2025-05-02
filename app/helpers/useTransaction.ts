"use client";

import {
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useWalletClient } from "wagmi";
import { parseUnits, type Address } from "viem";
import { STABILIZER_ADDRESS } from "./constants";
import { config } from "./wagmiConfig";
import stabilizeAbi from "./abi/stabilizer.json";
import { base } from "viem/chains";

export const tokenRef: {
  tokenAddress?: `0x${string}`;
  abiComputed?: any;
  tokenDecimals?: number;
} = {};

export function useTransaction() {
  const { data: walletClient } = useWalletClient();

  function ensureTokenRefs() {
    if (!tokenRef.tokenAddress || !tokenRef.abiComputed || !tokenRef.tokenDecimals)
      throw new Error("Token data not initialized. Call setTokenByKey() first.");
  }

  async function approveIfNeeded(owner: Address, amount: bigint) {
    ensureTokenRefs();

    const allowance = (await readContract(config, {
      abi: tokenRef.abiComputed!,
      address: tokenRef.tokenAddress!,
      functionName: "allowance",
      args: [owner, STABILIZER_ADDRESS],
    })) as bigint;

    if (allowance >= amount) return;

    if (!walletClient) throw new Error("Wallet not connected");

    const hash = await walletClient.writeContract({
      abi: tokenRef.abiComputed!,
      address: tokenRef.tokenAddress!,
      functionName: "approve",
      args: [STABILIZER_ADDRESS, amount.toString()],
      chain: base,
      account: walletClient.account,
    });

    await waitForTransactionReceipt(config, { hash });
  }

  async function stabilizeInscription(owner: Address, rawAmount: bigint) {
    ensureTokenRefs();
    const parsed = parseUnits(rawAmount.toString(), tokenRef.tokenDecimals);
    await approveIfNeeded(owner, parsed);

    if (!walletClient) throw new Error("Wallet not connected");

    const hash = await walletClient.writeContract({
      abi: stabilizeAbi,
      address: STABILIZER_ADDRESS,
      functionName: "stabilize",
      args: [parsed, tokenRef.tokenAddress!],
      chain: base,
      account: walletClient.account,
    });

    await waitForTransactionReceipt(config, { hash });
  }

  async function destabilizeInscription(owner: Address, rawAmount: bigint) {
    ensureTokenRefs();
    const parsed = parseUnits(rawAmount.toString(), tokenRef.tokenDecimals);
    await approveIfNeeded(owner, parsed * 2n);

    if (!walletClient) throw new Error("Wallet not connected");

    const hash = await walletClient.writeContract({
      abi: stabilizeAbi,
      address: STABILIZER_ADDRESS,
      functionName: "destabilize",
      args: [parsed, tokenRef.tokenAddress!],
      chain: base,
      account: walletClient.account,
    });

    await waitForTransactionReceipt(config, { hash });
  }

  async function combineInscriptions(owner: Address, amounts: bigint[]) {
    ensureTokenRefs();

    const parsed = amounts.map((a) =>
      parseUnits(a.toString(), tokenRef.tokenDecimals)
    );
    const total = parsed.reduce((a, b) => a + b, 0n);
    await approveIfNeeded(owner, total);

    if (!walletClient) throw new Error("Wallet not connected");

    const hash = await walletClient.writeContract({
      abi: stabilizeAbi,
      address: STABILIZER_ADDRESS,
      functionName: "combineMultiple",
      args: [parsed, tokenRef.tokenAddress!],
      chain: base,
      account: walletClient.account,
    });

    await waitForTransactionReceipt(config, { hash });
  }

  return {
    stabilizeInscription,
    destabilizeInscription,
    combineInscriptions,
  };
}
