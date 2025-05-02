"use client";

import { useState } from "react";

type Seed = {
  seed: bigint;
};

type Inscription = {
  seed: Seed;
};

type ModalCombineProps = {
  open: boolean;
  inscriptions: Inscription[];
  onClose: () => void;
  onCombine: (seeds: bigint[]) => void;
};

export default function ModalCombine({
  open,
  inscriptions,
  onClose,
  onCombine,
}: ModalCombineProps) {
  const [selected, setSelected] = useState<Inscription[]>([]);
  const [combineAll, setCombineAll] = useState(false);

  const handleToggle = (inscription: Inscription) => {
    setCombineAll(false);
    if (selected.includes(inscription)) {
      setSelected(selected.filter((i) => i !== inscription));
    } else {
      setSelected([...selected, inscription]);
    }
  };

  const handleCombine = () => {
    const selectedSeeds = combineAll
      ? inscriptions.map((i) => i.seed.seed)
      : selected.map((i) => i.seed.seed);
    onCombine(selectedSeeds);
    setSelected([]);
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Select Inscriptions</h3>

        <div className="mb-4 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={combineAll}
              onChange={() => {
                setCombineAll(!combineAll);
                setSelected([]);
              }}
            />
            Combine all inscriptions
          </label>

          {!combineAll && (
            <div className="grid gap-2">
              {inscriptions.map((inscription, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selected.includes(inscription)}
                    onChange={() => handleToggle(inscription)}
                  />
                  <span className="text-sm break-all">Seed: {inscription.seed.seed.toString()}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={handleCombine}
            disabled={!combineAll && selected.length < 2}
            className="btn btn-primary"
          >
            Combine
          </button>
        </div>
      </div>
    </div>
  );
}
