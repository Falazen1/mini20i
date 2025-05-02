"use client";

import { useMemo, useState } from "react";

type Seed = {
  seed: bigint;
};

type Inscription = {
  seed: Seed;
  [key: string]: unknown;
};

type ModalGenerateProps = {
  open: boolean;
  inscription: Inscription;
  onClose: () => void;
  onGenerate: (amounts: string[]) => void;
};

export default function ModalGenerate({
  open,
  inscription,
  onClose,
  onGenerate,
}: ModalGenerateProps) {
  const [strategy, setStrategy] = useState<"single" | "range">("single");
  const [range, setRange] = useState(["", ""]);
  const [singleAmount, setSingleAmount] = useState("");

  const generatedRange = useMemo(() => {
    const [start, end] = range;
    const startNum = Number(start);
    const endNum = Number(end);
    if (!start || !end || startNum > endNum) return [];
    return Array.from({ length: endNum - startNum + 1 }, (_, i) =>
      (startNum + i).toString()
    );
  }, [range]);

  const validationMessages = useMemo(() => {
    const seedAmount = Number(inscription.seed.seed);
    if (strategy === "range") {
      const [start, end] = range;
      if (start && end && Number(start) >= Number(end)) {
        return ["The second number must be greater than the first"];
      }
      const total = generatedRange.reduce((sum, val) => sum + Number(val), 0);
      if (seedAmount < total) {
        return [`The sum of all numbers (${total}) exceeds the available seed amount (${seedAmount})`];
      }
    }
    return [];
  }, [range, strategy, generatedRange, inscription.seed.seed]);

  const handleGenerate = () => {
    const amounts = strategy === "range" ? generatedRange : [singleAmount];
    onGenerate(amounts);
    setSingleAmount("");
    setRange(["", ""]);
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Generate Inscriptions</h3>

        <div className="mb-4">
          <div className="flex gap-4 mb-3">
            <button
              className={`btn btn-sm ${strategy === "single" ? "btn-primary" : ""}`}
              onClick={() => setStrategy("single")}
            >
              Single
            </button>
            <button
              className={`btn btn-sm ${strategy === "range" ? "btn-primary" : ""}`}
              onClick={() => setStrategy("range")}
            >
              Range
            </button>
          </div>

          {strategy === "single" ? (
            <input
              value={singleAmount}
              onChange={(e) => setSingleAmount(e.target.value)}
              placeholder="Amount"
              className="input input-bordered w-full"
            />
          ) : (
            <div className="flex gap-2">
              <input
                value={range[0]}
                onChange={(e) => setRange([e.target.value, range[1]])}
                placeholder="Start"
                className="input input-bordered w-1/2"
              />
              <input
                value={range[1]}
                onChange={(e) => setRange([range[0], e.target.value])}
                placeholder="End"
                className="input input-bordered w-1/2"
              />
            </div>
          )}

          {validationMessages.map((msg, i) => (
            <p key={i} className="text-xs text-red-500 mt-2">
              {msg}
            </p>
          ))}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={handleGenerate} className="btn btn-primary">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
