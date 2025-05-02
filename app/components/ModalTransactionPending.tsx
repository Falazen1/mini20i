"use client";

type ModalTransactionPendingProps = {
  open: boolean;
  transactionHash?: string;
  onClose: () => void;
};

export default function ModalTransactionPending({
  open,
  transactionHash,
  onClose,
}: ModalTransactionPendingProps) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box text-center">
        <h3 className="font-bold text-lg mb-2">Approving Transaction</h3>
        <p>Please wait while the transaction is being approved.</p>

        {transactionHash && (
          <div className="mt-4">
            <a
              href={`https://basescan.org/tx/${transactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-500 flex items-center justify-center gap-1"
            >
              View Transaction on Basescan ↗
            </a>
          </div>
        )}

        <div className="modal-action mt-4">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
