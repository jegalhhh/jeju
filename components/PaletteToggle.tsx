"use client";

import { useEffect, useState } from "react";

type Palette = "sea" | "sunrise" | "basalt";

const OPTIONS: { value: Palette; label: string }[] = [
  { value: "sea",     label: "바다" },
  { value: "sunrise", label: "일출" },
  { value: "basalt",  label: "현무암" },
];

export default function PaletteToggle() {
  const [palette, setPalette] = useState<Palette>("sea");

  useEffect(() => {
    const stored = localStorage.getItem("palette") as Palette | null;
    if (stored) setPalette(stored);
  }, []);

  function handleChange(p: Palette) {
    setPalette(p);
    localStorage.setItem("palette", p);
    const html = document.documentElement;
    if (p === "sea") {
      html.removeAttribute("data-palette");
    } else {
      html.setAttribute("data-palette", p);
    }
  }

  return (
    <div className="fixed bottom-6 right-4 flex gap-1 bg-[var(--paper)] border border-[var(--line)] rounded-full px-2 py-1.5 shadow-sm z-50">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          className={`px-3 py-1 rounded-full text-caption-mono transition-all ${
            palette === opt.value
              ? "bg-[var(--ink)] text-[var(--paper)]"
              : "text-[var(--muted)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
