"use client";

type Inscription = {
  meta: {
    [key: string]: string | number;
    size: string | number;
    dotsColor?: string;
    capColor?: string;
  };
};

type Props = {
  inscription: Inscription;
};

export default function ModalInscriptionTraitsTruffi({ inscription }: Props) {
  const meta = { ...inscription.meta };
  meta.size = Number(meta.size);
  if (meta.dotsColor === meta.capColor) {
    meta.dotsColor = "none";
  }

  const entries = Object.entries(meta);
  const strings = entries.filter(([, v]) => typeof v === "string");
  const nonStrings = entries.filter(([, v]) => typeof v !== "string");
  const metaOrdered = [...nonStrings, ...strings];

  const getKeyText = (key: string): string => {
    const keyNames: Record<string, string> = {
      skyType: "Sky",
      midType: "Mid",
      frontType: "Front",
      faceType: "Face",
      bodyType: "Body",
      capType: "Cap",
      size: "Size",
      backgroundColor: "Sky Color",
      midColor: "Mid Color",
      frontColor: "Front Color",
      bodyColor: "Body Color",
      capColor: "Cap Color",
      dotsColor: "Dots Color",
    };
    return keyNames[key] || key;
  };

  const getRarityText = (key: string): string => {
    return `Common`;
  };

  return (
    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
      {metaOrdered.map(([key, value]) => (
        <div
          key={key}
          className="rounded px-2 py-1 bg-base-300 flex justify-between items-center"
        >
          <div>{getKeyText(key)}</div>
          <div className="text-right">{value}</div>
        </div>
      ))}
    </div>
  );
}
