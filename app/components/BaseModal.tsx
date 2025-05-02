"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  open: boolean;
  width?: "lg" | "default";
  onClose: () => void;
  children: ReactNode;
};

export default function BaseModal({
  title,
  open,
  width = "default",
  onClose,
  children,
}: Props) {
  const modalWidth = width === "lg" ? "sm:max-w-7xl" : "sm:max-w-96";

  if (!open) return null;

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className={`modal-box ${modalWidth}`}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="mt-6">{children}</div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
