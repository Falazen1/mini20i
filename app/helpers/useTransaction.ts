"use client";

import {
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useWalletClient } from "wagmi";
import {
  parseUnits,
  encodeFunctionData,
  type Address,
  type Abi,
} from "viem";
import { STABILIZER_ADDRESS } from "./constants";
import { config } from "./wagmiConfig";
import stabilizeAbi from "./abi/stabilizer.json";
import { base } from "viem/chains";

export const tokenRef: {
  tokenAddress?: `0x${string}`;
  abiComputed?: Abi;
  tokenDecimals?: number;
} = {};

export function useTransaction() {
  const { data: walletClient } = useWalletClient();

  function ensureTokenRefs() {
    if (
      !tokenRef.tokenAddress ||
      !tokenRef.abiComputed ||
      tokenRef.tokenDecimals === undefined
    ) {
      throw new Error("Token data not initialized. Call setTokenByKey() first.");
    }
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
    const decimals = tokenRef.tokenDecimals as number;
    const parsed = parseUnits(rawAmount.toString(), decimals);
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
    const decimals = tokenRef.tokenDecimals as number;
    const parsed = parseUnits(rawAmount.toString(), decimals);
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
    const decimals = tokenRef.tokenDecimals as number;

    const parsed = amounts.map((a) =>
      parseUnits(a.toString(), decimals)
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

async function sendToAddress(to: Address) {
  ensureTokenRefs();

  if (!walletClient) throw new Error("Wallet not connected");
  const from = walletClient.account.address as Address;

  const balance = (await readContract(config, {
    abi: tokenRef.abiComputed!,
    address: tokenRef.tokenAddress!,
    functionName: "balanceOf",
    args: [from],
  })) as bigint;

  if (balance === 0n) throw new Error("No token balance to send");

  const data = encodeFunctionData({
    abi: tokenRef.abiComputed!,
    functionName: "transfer",
    args: [to, balance],
  });

  const hash = await walletClient.sendTransaction({
    to: tokenRef.tokenAddress!,
    data,
    account: from,
    chain: base,
  });

  await waitForTransactionReceipt(config, { hash });
}


  return {
    stabilizeInscription,
    destabilizeInscription,
    combineInscriptions,
    sendToAddress,
  };
}
