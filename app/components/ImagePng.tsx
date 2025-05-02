"use client";

import { useEffect, useRef } from "react";
import { Canvg } from "canvg";

type Props = {
  svgString: string;
};

export default function ImagePng({ svgString }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function renderPng() {
      const canvas = new OffscreenCanvas(800, 800);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to get 2D context from OffscreenCanvas");
        return;
      }

      const v = await Canvg.from(ctx, svgString);
      await v.render();

      const blob = await canvas.convertToBlob();
      const pngUrl = URL.createObjectURL(blob);

      if (imgRef.current) {
        imgRef.current.src = pngUrl;
      }
    }

    renderPng();
  }, [svgString]);

  return <img ref={imgRef} alt="inscription-rendered-png" />;
}
