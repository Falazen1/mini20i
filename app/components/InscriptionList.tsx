"use client";

import InscriptionListItem from "./InscriptionListItem";
import { type Inscription } from "../helpers/types";

type InscriptionListProps = {
  inscriptions: Inscription[];
};

export default function InscriptionList({ inscriptions }: InscriptionListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {inscriptions.map((inscription, i) =>
        inscription.svg ? (
          <InscriptionListItem
            key={i}
            inscription={inscription}
            isOnlyInscription={inscriptions.length < 2}
          />
        ) : null
      )}
    </div>
  );
}
