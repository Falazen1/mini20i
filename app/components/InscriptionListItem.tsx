"use client";

import { useState } from "react";
import { type Address } from "viem";
import { useTokenStore } from "../helpers/useTokenStore";
import { useTransaction } from "../helpers/useTransaction";
import ModalSend from "./ModalSend";
import ModalActions from "./ModalActions";
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

export default function InscriptionListItem({ inscription }: Props) {
  const tokenStore = useTokenStore();
  const { stabilizeInscription, destabilizeInscription } = useTransaction();

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const handleStabilize = async () => {
    setActionModalOpen(false);
    await stabilizeInscription(inscription.seed.owner, inscription.seed.seed);
  };

  const handleDestabilize = async () => {
    setActionModalOpen(false);
    await destabilizeInscription(inscription.seed.owner, inscription.seed.seed);
  };

  const handleOpenModal = () => {
    setActionModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="transition-all duration-300 w-full rounded-t overflow-hidden border rounded-b">
          <BaseInscription animated={hover} inscription={inscription} />
          <div className="px-3 py-2">
            <div className="sm:flex justify-between items-center">
              <div className="font-semibold">
                {inscription.seed.seed.toString()} {tokenStore.tokenInfo?.symbol}
              </div>
            </div>
          </div>
        </div>
      </button>

      {sendModalOpen && (
        <ModalSend
          open={sendModalOpen}
          onSend={() => {}}
          onClose={() => setSendModalOpen(false)}
        />
      )}

      {actionModalOpen && (
        <ModalActions>
          <button
            onClick={handleStabilize}
            className="btn btn-sm btn-success"
          >
            Stabilize
          </button>
          <button
            onClick={handleDestabilize}
            className="btn btn-sm btn-warning"
          >
            Destabilize
          </button>
          <button
            onClick={() => setSendModalOpen(true)}
            className="btn btn-sm btn-neutral"
          >
            Send
          </button>
          <button
            onClick={() => setActionModalOpen(false)}
            className="btn btn-sm"
          >
            Close
          </button>
        </ModalActions>
      )}
    </>
  );
}
