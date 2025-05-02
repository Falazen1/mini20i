"use client";

import { useMemo } from "react";

type Seed = {
  isDynamic: boolean;
  seed: bigint;
};

type Inscription = {
  seed: Seed;
};

type ModalInscriptionProps = {
  open: boolean;
  inscription: Inscription;
  onClose: () => void;
  onAction: (type: "stabilize" | "destabilize" | "transfer") => void;
};

export default function ModalInscription({
  open,
  inscription,
  onClose,
  onAction,
}: ModalInscriptionProps) {
  const actions = useMemo(() => {
    const list: {
      key: "stabilize" | "destabilize" | "transfer";
      label: string;
      tooltip: string;
    }[] = [];

    if (inscription.seed.isDynamic) {
      list.push({
        key: "stabilize",
        label: "Stabilize Inscription",
        tooltip:
          "You can have multiple stable inscriptions in your wallet but only one dynamic inscription.",
      });
    }

    if (!inscription.seed.isDynamic && inscription.seed.seed > 1n) {
      list.push({
        key: "destabilize",
        label: "Destabilize Inscription",
        tooltip: "Destabilize this inscription to make it dynamic.",
      });
    }

    list.push({
      key: "transfer",
      label: "Transfer Inscription",
      tooltip: "Send this inscription to another address.",
    });

    return list;
  }, [inscription]);

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Manage Inscription</h3>

        <div className="space-y-3">
          {actions.map((action) => (
            <div key={action.key} className="tooltip" data-tip={action.tooltip}>
              <button
                className="btn btn-primary w-full"
                onClick={() => onAction(action.key)}
              >
                {action.label}
              </button>
            </div>
          ))}
        </div>

        <div className="modal-action mt-4">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
