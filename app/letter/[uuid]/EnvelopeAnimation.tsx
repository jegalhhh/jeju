"use client";

import { useState } from "react";
import MonoLabel from "@/components/ui/MonoLabel";

interface Props {
  senderName: string;
  receiverName: string;
  content: string;
  photoUrl: string | null;
  roomName: string;
}

export default function EnvelopeAnimation({ senderName, receiverName, content, photoUrl, roomName }: Props) {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return (
      <div
        className="relative bg-[var(--envelope)] rounded-[6px] px-6 pt-16 pb-6 cursor-pointer"
        onClick={() => setOpened(true)}
      >
        {/* 봉투 플랩 */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-[var(--envelope-flap)] rounded-t-[6px] flex items-center justify-center">
          <span className="text-caption-mono text-[var(--muted)]">눌러서 열기</span>
        </div>

        {/* 우표 */}
        <div className="absolute top-3 right-4 w-10 h-12 border border-dashed border-[var(--stamp)] rounded-[4px] flex flex-col items-center justify-center">
          <MonoLabel className="text-[var(--stamp)] text-[8px]">제주</MonoLabel>
        </div>

        {/* FROM / TO */}
        <div className="flex flex-col gap-2 mt-2">
          <div>
            <MonoLabel className="block">FROM</MonoLabel>
            <p className="text-body-sm text-[var(--ink)]">{senderName}</p>
          </div>
          <div>
            <MonoLabel className="block">TO</MonoLabel>
            <p className="text-body-sm text-[var(--ink)]">{receiverName}</p>
          </div>
          <div>
            <MonoLabel className="block">VIA</MonoLabel>
            <p className="text-body-sm text-[var(--ink)]">{roomName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--paper)] rounded-[14px] p-7 border border-[var(--line-soft)]">
      {/* 편지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <MonoLabel className="block">FROM · {senderName}</MonoLabel>
          <MonoLabel className="block mt-0.5">TO · {receiverName}</MonoLabel>
        </div>
        <div className="w-9 h-10 border border-dashed border-[var(--stamp)] rounded-[4px] flex items-center justify-center">
          <span className="text-[7px] text-[var(--stamp)] font-mono">제주</span>
        </div>
      </div>

      {/* 첨부 사진 */}
      {photoUrl && (
        <div className="mb-6 rounded-[8px] overflow-hidden border border-dashed border-[var(--line)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="첨부 사진"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      )}

      {/* 편지 본문 */}
      <p className="text-hand-sm text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
        {content}
      </p>

      {/* 서명 */}
      <div className="mt-8 pt-5 border-t border-dashed border-[var(--line)] flex items-center justify-between">
        <MonoLabel>느린 소식 · 제주</MonoLabel>
        <span className="text-hand-md -rotate-3">{senderName}</span>
      </div>
    </div>
  );
}
