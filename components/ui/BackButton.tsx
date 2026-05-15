"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-body-sm text-[var(--muted)] active:opacity-60 transition-opacity"
    >
      ← 뒤로
    </button>
  );
}
