// store/useInscription.ts

import { readContract } from "wagmi/actions";
import { type Address } from "viem";
import { config } from "./wagmiConfig";
import { type Seed, type Inscription } from "./types";
import { getFunctionNames } from "./abi/mapping";

export function createInscriptionReader(tokenAddress: Address, abi: any, tokenKey: string) {
  const functionNames = getFunctionNames(tokenKey);

  async function getInscription(seed: Seed): Promise<Inscription> {
    let svg = "";
    let animatedSvg = "";
    let meta = "{}";

    try {
      svg = (await readContract(config, {
        abi,
        address: tokenAddress,
        functionName: "getSvg",
        args: [seed],
      })) as string;

      if (tokenKey === "truffi") {
        animatedSvg = (await readContract(config, {
          abi,
          address: tokenAddress,
          functionName: "getAnimatedSvg",
          args: [seed],
        })) as string;
      }
    } catch (err) {
      console.error("getSvg error", err);
    }

    try {
      meta = (await readContract(config, {
        abi,
        address: tokenAddress,
        functionName: "getMeta",
        args: [seed],
      })) as string;
    } catch (err) {
      console.error("getMeta error", err);
    }

    return {
      svg,
      animatedSvg,
      seed,
      meta: JSON.parse(meta),
    };
  }

  async function getInscriptionsByAddress(address: Address): Promise<Inscription[]> {
    const [count, dynamic] = await Promise.all([
      readContract(config, {
        abi,
        address: tokenAddress,
        functionName: functionNames["mushroomCount"],
        args: [address],
      }) as Promise<number>,

      readContract(config, {
        abi,
        address: tokenAddress,
        functionName: functionNames["sporesDegree"],
        args: [address],
      }) as Promise<Seed>,
    ]);

    const seeds: Seed[] = await Promise.all(
      Array.from({ length: Number(count) }).map((_, i) =>
        readContract(config, {
          abi,
          address: tokenAddress,
          functionName: functionNames["mushroomOfOwnerByIndex"],
          args: [address, i],
        }) as Promise<Seed>
      )
    );

    const normalizedSeeds = seeds.map((s) => ({
      seed: s.seed,
      seed2: s.seed2,
      extra: s.extra,
      creator: s.creator,
      owner: address,
    }));

    if (Number(dynamic.seed)) {
      normalizedSeeds.unshift({
        isDynamic: true,
        seed: dynamic.seed,
        seed2: dynamic.seed2,
        extra: dynamic.extra,
        creator: "0x0000000000000000000000000000000000000000",
        owner: address,
      });
    }

    return await Promise.all(normalizedSeeds.map(getInscription));
  }

  return { getInscriptionsByAddress };
}
