"use client";

import { useState } from "react";
import { isAddress } from "viem";

type ModalSendProps = {
  open: boolean;
  onClose: () => void;
  onSend: (address: string) => void;
};

export default function ModalSend({ open, onClose, onSend }: ModalSendProps) {
  const [addressInput, setAddressInput] = useState("");

  const handleSend = () => {
    onSend(addressInput);
    setAddressInput("");
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Send Inscription</h3>

        <input
          type="text"
          placeholder="Recipient address"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="btn btn-primary"
            disabled={!isAddress(addressInput.toLowerCase())}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
