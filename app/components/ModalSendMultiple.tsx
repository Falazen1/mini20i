"use client";

import { useState } from "react";

type Seed = {
  seed: bigint;
};

type Inscription = {
  seed: Seed;
};

type ModalSendMultipleProps = {
  open: boolean;
  inscriptions: Inscription[];
  onClose: () => void;
  onSendMultiple: (to: string, seeds: bigint[]) => void;
};

export default function ModalSendMultiple({
  open,
  inscriptions,
  onClose,
  onSendMultiple,
}: ModalSendMultipleProps) {
  const [selected, setSelected] = useState<Inscription[]>([]);
  const [addressInput, setAddressInput] = useState("");

  const handleToggle = (inscription: Inscription) => {
    if (selected.includes(inscription)) {
      setSelected(selected.filter((i) => i !== inscription));
    } else {
      setSelected([...selected, inscription]);
    }
  };

  const handleSend = () => {
    onSendMultiple(
      addressInput,
      selected.map((i) => i.seed.seed)
    );
    setSelected([]);
    setAddressInput("");
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Select Inscriptions</h3>

        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-auto mb-4">
          {inscriptions.map((inscription, i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={selected.includes(inscription)}
                onChange={() => handleToggle(inscription)}
              />
              <span className="text-xs break-all">Seed: {inscription.seed.seed.toString()}</span>
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Recipient address"
          className="input input-bordered w-full mb-4"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        />

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={handleSend} className="btn btn-primary">
            Send Selected
          </button>
        </div>
      </div>
    </div>
  );
}
