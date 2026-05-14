import { HTMLAttributes } from "react";

interface MonoLabelProps extends HTMLAttributes<HTMLSpanElement> {
  caps?: boolean;
}

export default function MonoLabel({
  caps = false,
  children,
  className = "",
  ...props
}: MonoLabelProps) {
  return (
    <span
      className={`${caps ? "text-label-caps" : "text-label-mono"} text-[var(--muted)] ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
