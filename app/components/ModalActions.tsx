"use client";

import { ReactNode } from "react";

type ModalActionsProps = {
  children: ReactNode;
};

export default function ModalActions({ children }: ModalActionsProps) {
  return (
    <div className="modal-action flex flex-wrap justify-between gap-2">
      {children}
    </div>
  );
}
