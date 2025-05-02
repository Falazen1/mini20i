"use client";

import { useTokenStore } from "../helpers/useTokenStore"; // Adjust if needed
import Link from "next/link";

export default function HomeBreadcrumbs() {
  const { tokenInfo } = useTokenStore();

  return (
    <div className="text breadcrumbs">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>{tokenInfo?.name}</li>
      </ul>
    </div>
  );
}
