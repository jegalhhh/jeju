"use client";

import { useState, useRef } from "react";

interface PhotoUploadProps {
  onUploaded: (url: string) => void;
}

export default function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 1920;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.82);
      };
      img.src = url;
    });
  }

  async function handleFile(file: File) {
    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      onUploaded(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "업로드에 실패했습니다");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="미리보기"
            className="w-full aspect-[4/3] object-cover rounded-[8px]"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-[8px]">
              <span className="text-white text-body-sm">업로드 중...</span>
            </div>
          )}
          <button
            className="mt-2 text-body-sm text-[var(--muted)] underline"
            onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
          >
            다시 선택
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-[4/3] border border-dashed border-[var(--line)] rounded-[8px] flex flex-col items-center justify-center gap-2 bg-[var(--bg)]"
        >
          <span className="text-label-mono text-[var(--muted)]">PHOTO</span>
          <span className="text-body-sm text-[var(--muted)]">사진을 선택하세요</span>
        </button>
      )}

      {error && <p className="mt-1 text-body-sm text-red-500">{error}</p>}
    </div>
  );
}
