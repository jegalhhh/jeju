import { HTMLAttributes } from "react";

export default function PullQuote({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={`border-l-2 border-[var(--accent)] pl-4 text-hand-lg ${className}`}
      {...props}
    >
      {children}
    </blockquote>
  );
}
