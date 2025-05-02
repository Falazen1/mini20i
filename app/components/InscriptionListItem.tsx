"use client";

import { useState } from "react";
import { parseUnits, type Address } from "viem";
import { useTokenStore } from "../helpers/useTokenStore";
import { useTransaction } from "../helpers/useTransaction";
import ModalSend from "./ModalSend";
import ModalActions from "./ModalActions";
import ModalInscription from "./ModalInscription";
import BaseInscription from "./BaseInscription";

type Seed = {
  seed: bigint;
  isDynamic: boolean;
  owner: Address;
};

type Inscription = {
  seed: Seed;
  svg?: string;
  meta?: Record<string, unknown>;
};

type Props = {
  inscription: Inscription;
  isOnlyInscription: boolean;
};

export default function InscriptionListItem({
  inscription,
  isOnlyInscription,
}: Props) {
  const tokenStore = useTokenStore();
  const { sendInscription, stabilizeInscription, destabilizeInscription } =
    useTransaction();

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [truffiModalOpen, setTruffiModalOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const handleStabilize = async () => {
    setActionModalOpen(false);
    setTruffiModalOpen(false);
    await stabilizeInscription(inscription.seed.owner, inscription.seed.seed);
  };

  const handleDestabilize = async () => {
    setActionModalOpen(false);
    setTruffiModalOpen(false);
    await destabilizeInscription(inscription.seed.owner, inscription.seed.seed);
  };

  const handleSend = async (to: string) => {
    setSendModalOpen(false);
    await sendInscription(
      inscription.seed.owner,
      to as Address,
      parseUnits(
        inscription.seed.seed.toString(),
        tokenStore.tokenDecimals
      ).toString()
    );
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "transfer":
        setSendModalOpen(true);
        break;
      case "stabilize":
        handleStabilize();
        break;
      case "destabilize":
        handleDestabilize();
        break;
    }
  };

  const handleOpenModal = () => {
    if (tokenStore.tokenInfo?.key === "truffi") {
      setTruffiModalOpen(true);
    } else {
      setActionModalOpen(true);
    }
  };

  return (
    <>
      <button onClick={handleOpenModal} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="transition-all duration-300 w-full rounded-t overflow-hidden border rounded-b">
          <BaseInscription animated={hover} inscription={inscription} />
          <div className="px-3 py-2">
            <div className="sm:flex justify-between items-center">
              <div className="font-semibold">
                {inscription.seed.seed.toString()}{" "}
                {tokenStore.tokenInfo?.symbol}
              </div>
            </div>
          </div>
        </div>
      </button>

      {sendModalOpen && (
        <ModalSend
          open={sendModalOpen}
          onSend={handleSend}
          onClose={() => setSendModalOpen(false)}
        />
      )}

      {actionModalOpen && (
        <ModalActions
          open={actionModalOpen}
          inscription={inscription}
          onAction={handleAction}
          onClose={() => setActionModalOpen(false)}
        />
      )}

      {truffiModalOpen && (
        <ModalInscription
          open={truffiModalOpen}
          inscription={inscription}
          onAction={handleAction}
          onClose={() => setTruffiModalOpen(false)}
        />
      )}
    </>
  );
}
