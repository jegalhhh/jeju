"use client";

import { useState } from "react";

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function FadeImage({ src, alt, className = "", wrapperClassName = "" }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--paper)] animate-pulse rounded-[8px]" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </div>
  );
}
