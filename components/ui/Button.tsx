"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  arrow?: boolean;
}

export default function Button({
  variant = "primary",
  arrow = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "w-full flex items-center justify-between px-[18px] py-4 rounded-[14px] text-body-md whitespace-nowrap transition-opacity disabled:opacity-40";

  const styles = {
    primary: "bg-[var(--ink)] text-[var(--paper)]",
    secondary:
      "bg-transparent text-[var(--ink)] border border-[var(--line)]",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      <span className="flex-1 min-w-0 text-left">{children}</span>
      {arrow && (
        <span className="ml-2 text-[var(--muted)] font-mono text-sm">→</span>
      )}
    </button>
  );
}
