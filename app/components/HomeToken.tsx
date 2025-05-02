"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useTokenStore } from "../helpers/useTokenStore"; // stubbed hook

const Icon = ({ name }: { name: string }) => <span>{name}</span>;

type SocialLink = {
  icon: string;
  link: string;
  label: string;
};

export default function HomeToken() {
  const tokenStore = useTokenStore();
  const { address } = useAccount();
  const [addressInput, setAddressInput] = useState("");
  const [showCombineModal, setShowCombineModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const dynamicInscription = useMemo(() => {
    return tokenStore.inscriptions.find((i) => i.seed.isDynamic);
  }, [tokenStore.inscriptions]);

  const hasLessThanOne = tokenStore.inscriptions.length < 2;

  const actions = useMemo(() => {
    return [
      {
        label: "Combine",
        icon: <Icon name="combine" />,
        tooltip: hasLessThanOne
          ? "Requires two inscriptions"
          : tokenStore.tokenInfo?.key === "pepi"
          ? "Not available for Pepi"
          : null,
        disabled:
          hasLessThanOne || tokenStore.tokenInfo?.key === "pepi" ? true : false,
        onClick: () => setShowCombineModal(true),
      },
      {
        label: "Generate",
        icon: <Icon name="generate" />,
        tooltip: !dynamicInscription
          ? "Requires dynamic"
          : dynamicInscription.seed.seed < 2n
          ? "Not enough tokens"
          : tokenStore.tokenInfo?.key === "pepi"
          ? "Not available for Pepi"
          : null,
        disabled:
          !dynamicInscription ||
          dynamicInscription.seed.seed < 2n ||
          tokenStore.tokenInfo?.key === "pepi",
        onClick: () => setShowGenerateModal(true),
      },
      {
        label: "Send",
        icon: <Icon name="send" />,
        tooltip: null,
        disabled: tokenStore.inscriptions.length < 2,
        onClick: () => setShowSendModal(true),
      },
    ];
  }, [hasLessThanOne, tokenStore.tokenInfo?.key, dynamicInscription, tokenStore.inscriptions.length]);

  const projectSocials = useMemo<SocialLink[]>(() => {
    const socials: SocialLink[] = [];
    const info = tokenStore.tokenInfo;
    if (!info) return socials;
    if (info.website)
      socials.push({ icon: "🌐", link: info.website, label: "Website" });
    if (info.twitter)
      socials.push({ icon: "𝕏", link: info.twitter, label: "Twitter" });
    if (info.telegram)
      socials.push({ icon: "✈️", link: info.telegram, label: "Telegram" });
    if (info.pairAddress)
      socials.push({
        icon: "📈",
        link: `https://dexscreener.com/base/${info.pairAddress}`,
        label: "Dexscreener",
      });
    return socials;
  }, [tokenStore.tokenInfo]);

  const hasBrokenSeed2 = useMemo(() => {
    return (
      tokenStore.tokenInfo?.key === "pepi" &&
      tokenStore.inscriptions.some((i) => i.seed.seed2 === 0n)
    );
  }, [tokenStore]);

  useEffect(() => {
    tokenStore.init(address ?? addressInput);
  }, [address, addressInput, tokenStore]);

  return (
    <div>
      <div className="sm:flex justify-between px-4 py-5 bg-base-200 rounded">
        <h2 className="text-xl flex items-center gap-2 pl-0.5">
          <Image
            src={tokenStore.tokenInfo?.logo || ""}
            alt="logo"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-semibold">{tokenStore.tokenInfo?.name}</span> /{" "}
          {tokenStore.tokenInfo?.symbol}
        </h2>

        <div className="flex items-center justify-end -mr-1">
          {projectSocials.map((social, i: number) => (
            <a
              key={i}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline border-0 btn-sm px-2 hover:bg-transparent hover:text-primary"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {hasBrokenSeed2 && (
        <div className="alert alert-warning mt-2">
          ⚠️ You have some invalid {tokenStore.tokenInfo?.name}. Send your entire balance to another wallet to fix this.
        </div>
      )}

      {!address && (
        <div className="text-xl my-4">
          Connect your wallet or paste your wallet address below.
          <div className="mt-2">
            <input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter wallet address"
              className="input input-bordered w-full max-w-[500px]"
            />
          </div>
        </div>
      )}

      {address || addressInput ? (
        <>
          <div className="pt-2 sm:mt-0 mb-4 flex gap-2 flex-wrap">
            {actions.map((action, i: number) => (
              <button
                key={i}
                disabled={action.disabled}
                onClick={action.onClick}
                title={action.tooltip || ""}
                className="btn btn-primary"
              >
                {action.icon}
                <span className="ml-2 hidden sm:inline">{action.label}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Dynamic {tokenStore.tokenInfo?.name}
            </h3>
            {tokenStore.inscriptions.filter((i) => i.seed.isDynamic).length === 0 ? (
              <div>No dynamic inscriptions found.</div>
            ) : (
              <div>Render <code>&lt;InscriptionList&gt;</code> here</div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Stable {tokenStore.tokenInfo?.name}
            </h3>
            {tokenStore.inscriptions.filter((i) => !i.seed.isDynamic).length === 0 ? (
              <div>No stable inscriptions found.</div>
            ) : (
              <div>Render <code>&lt;InscriptionList&gt;</code> here</div>
            )}
          </div>
        </>
      ) : null}

      {showCombineModal && <div>ModalCombine</div>}
      {showGenerateModal && <div>ModalGenerate</div>}
      {showSendModal && <div>ModalSendMultiple</div>}

      <div>ModalTransactionSpending</div>
      <div>ModalTransactionPending</div>
      <div>ModalTransactionConfirm</div>
    </div>
  );
}
