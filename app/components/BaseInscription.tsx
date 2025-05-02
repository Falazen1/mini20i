"use client";

import { useTokenStore } from "../helpers/useTokenStore";
import ImagePng from "./ImagePng"; 

type Inscription = {
  svg?: string;
  animatedSvg?: string;
};

type Props = {
  inscription: Inscription;
  animated?: boolean;
};

const NOT_SUPPORTED_PNG = ["jelli", "froggi", "truffi"];

export default function BaseInscription({ inscription, animated }: Props) {
  const { tokenInfo } = useTokenStore();
  const key = tokenInfo?.key || "";

  if (NOT_SUPPORTED_PNG.includes(key)) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: animated ? inscription.animatedSvg || "" : inscription.svg || "",
        }}
      />
    );
  }

  return <ImagePng svgString={inscription.svg || ""} />;
}
