"use client";

type ModalTransactionConfirmProps = {
  open: boolean;
  onClose: () => void;
};

export default function ModalTransactionConfirm({
  open,
  onClose,
}: ModalTransactionConfirmProps) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box text-center">
        <h3 className="font-bold text-lg mb-2">Confirm Transaction</h3>
        <p>Confirm the transaction in your wallet.</p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
