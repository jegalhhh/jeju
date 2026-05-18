"use client";

import { useEffect, useRef, useState } from "react";

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function FadeImage({ src, alt, className = "", wrapperClassName = "" }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--paper)] animate-pulse rounded-[8px]" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </div>
  );
}
