"use client";

import { useState } from "react";
import Link from "next/link";
import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import StepRow from "@/components/ui/StepRow";
import BackButton from "@/components/ui/BackButton";
import PaletteToggle from "@/components/PaletteToggle";

interface Room {
  id: number;
  name: string;
  send_date: string;
  status: "open" | "started" | "closed";
  created_at: string;
}

interface Props {
  rooms: Room[];
}

export default function LetterPageClient({ rooms }: Props) {
  const [showList, setShowList] = useState(false);

  const openRooms = rooms.filter((r) => r.status === "open");
  const startedRooms = rooms.filter((r) => r.status === "started");
  const closedRooms = rooms.filter((r) => r.status === "closed");

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12">
      <div className="max-w-[390px] mx-auto">
        <div className="mb-6"><BackButton /></div>

        <div className="mb-10">
          <MonoLabel caps className="block mb-3">배편 서신 · 바람이</MonoLabel>
          <h1 className="text-headline-lg text-[var(--ink)]">바람이의 편지</h1>
          <p className="text-body-md text-[var(--ink)] mt-2">
            제주에서 만난 사람들과 편지를 교환해 보세요. 매칭된 상대에게 편지를 써서 보내면, 약속된 날 문자로 전해집니다.
          </p>
        </div>

        {!showList ? (
          <div>
            <div className="border-b border-[var(--line)]">
              <StepRow step={1} title="방 입장" description="참여 코드로 방에 들어갑니다." />
              <StepRow step={2} title="편지 작성" description="매칭된 상대에게 사진과 마음을 담아 써요." />
              <StepRow step={3} title="발송일 수신" description="약속된 날, 상대의 편지가 문자로 도착합니다." />
            </div>
            <div className="mt-8">
              <Button arrow onClick={() => setShowList(true)}>방 목록 보기</Button>
            </div>
          </div>
        ) : (
          <div>
            {openRooms.length > 0 && (
              <div className="mb-8">
                <MonoLabel caps className="block mb-4">입장 가능</MonoLabel>
                <div className="flex flex-col gap-3">
                  {openRooms.map((room) => (
                    <Link key={room.id} href={`/letter/room/${room.id}`} className="block">
                      <RoomCard room={room} disabled={false} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {startedRooms.length > 0 && (
              <div className="mb-8">
                <MonoLabel caps className="block mb-4">편지 작성 중</MonoLabel>
                <div className="flex flex-col gap-3">
                  {startedRooms.map((room) => (
                    <Link key={room.id} href={`/letter/room/${room.id}`} className="block">
                      <RoomCard room={room} disabled={false} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {closedRooms.length > 0 && (
              <div>
                <MonoLabel caps className="block mb-4">마감</MonoLabel>
                <div className="flex flex-col gap-3 opacity-50">
                  {closedRooms.map((room) => (
                    <RoomCard key={room.id} room={room} disabled />
                  ))}
                </div>
              </div>
            )}

            {rooms.length === 0 && (
              <div className="text-center py-16">
                <p className="text-body-serif text-[var(--muted)]">아직 개설된 방이 없습니다.</p>
              </div>
            )}

            <div className="mt-10 text-center">
              <Link href="/letter/recover" className="text-body-sm text-[var(--muted)] underline underline-offset-2">
                입장했던 방을 찾으시나요? →
              </Link>
            </div>
          </div>
        )}
      </div>

      <PaletteToggle />
    </main>
  );
}

function RoomCard({ room, disabled }: { room: Room; disabled: boolean }) {
  const sendDateStr = new Date(room.send_date).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const statusLabel: Record<Room["status"], string> = {
    open: "입장 가능",
    started: "편지 작성 중",
    closed: "마감",
  };

  return (
    <div className={`bg-[var(--paper)] rounded-[18px] p-5 border border-[var(--line-soft)] ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-[var(--ink)]">{room.name}</h2>
        <MonoLabel>{statusLabel[room.status]}</MonoLabel>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-body-sm text-[var(--muted)]">발송일 · {sendDateStr}</p>
        {!disabled && <span className="text-body-sm text-[var(--accent)]">입장 →</span>}
      </div>
    </div>
  );
}
