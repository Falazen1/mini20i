"use client";

import { type Address } from "viem";
import { useAccount } from "wagmi";

type ModalSendProps = {
  open: boolean;
  onClose: () => void;
  onSend: (address: Address) => void;
};

export default function ModalSend({ open, onClose, onSend }: ModalSendProps) {
  const { address } = useAccount();

  const handleSend = () => {
    if (address) {
      onSend(address);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#1c1e24] border border-white/10 rounded-xl shadow-xl p-6 w-full max-w-md text-white">
        <h3 className="text-xl font-semibold mb-2 text-center">Your Pepi could be even more impressive!</h3>
        <p className="text-base text-white/90 text-center mb-4">some tokens may be stuck</p>
        <p className="text-sm mb-6 text-white/80 leading-relaxed text-center">
          Send your full balance to yourself<br />
          to unstick your Pepi!<br />
          <br />
          This combines all your Pepi Inscriptions.
        </p>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
            disabled={!address}
          >
            Combine All
          </button>
        </div>
      </div>
    </div>
  );
}
