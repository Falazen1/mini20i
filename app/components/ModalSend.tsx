"use client";

import { useState, useEffect } from "react";
import { isAddress, type Address } from "viem";

type ModalSendProps = {
  open: boolean;
  onClose: () => void;
  onSend: (address: Address) => void;
};

export default function ModalSend({ open, onClose, onSend }: ModalSendProps) {
  const [addressInput, setAddressInput] = useState("");

  useEffect(() => {
    if (!open) setAddressInput("");
  }, [open]);

  const handleSend = () => {
    onSend(addressInput as Address);
    setAddressInput("");
    onClose();
  };

  const handleCancel = () => {
    setAddressInput("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
<div className="bg-[#1c1e24] border border-white/10 rounded-xl shadow-xl p-6 w-full max-w-md text-white">
  <h3 className="text-xl font-semibold mb-2 text-center">Your Pepi could be even more impressive!</h3>
  <p className="text-base text-white/90 text-center mb-4">some tokens are not inscribed</p>
  <p className="text-sm mb-4 text-white/80 leading-relaxed text-center">
    Send your full balance to yourself<br />
    to reinscribe!<br />
    <br />
    This combines all your Pepi Inscriptions.
  </p>


        <input
          type="text"
          placeholder="Recipient address"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="w-full px-3 py-2 rounded bg-white text-black mb-4 shadow"
        />

        <div className="flex justify-between items-center">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!isAddress(addressInput.toLowerCase())}
            className={`px-4 py-2 text-sm rounded ${
              isAddress(addressInput.toLowerCase())
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Combine All
          </button>
        </div>
      </div>
    </div>
  );
}
