"use client";

type ModalTransactionSpendingProps = {
  open: boolean;
  onClose: () => void;
};

export default function ModalTransactionSpending({
  open,
  onClose,
}: ModalTransactionSpendingProps) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Confirm Token Spending</h3>
        <p className="leading-5">
          This action requires you to approve our contract the suggested amount shown in your wallet.
          If you don&apos;t want to approve spending for each future action, you can approve a larger amount.
        </p>

        <details className="collapse collapse-arrow border border-base-300 bg-base-200 mt-3">
          <summary className="collapse-title">Learn more</summary>
          <div className="collapse-content">
            <p>
              To interact with our generator contract, you’ll need to grant it permission to use your
              tokens. This contract can’t transfer your tokens to any location other than your wallet.
              Plus, your tokens are never held by the contract itself; they’re always sent back to
              you after the operation.
            </p>
          </div>
        </details>

        <div className="modal-action mt-4">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
