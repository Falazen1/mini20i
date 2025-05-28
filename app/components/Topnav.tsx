"use client";

import Link from "next/link";
import ButtonConnect from "./ButtonConnect";

export default function Topnav() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100 px-4 shadow-sm">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-1">
            <button className="text-xl">Mini 20i</button>
          </Link>
        </div>

        <div className="navbar-center" />

        <div className="navbar-end">
          <ButtonConnect />
        </div>
      </div>
    </header>
  );
}
