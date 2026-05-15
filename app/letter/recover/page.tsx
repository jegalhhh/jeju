"use client";

import { useState } from "react";
import Link from "next/link";
import PhoneAuth from "@/components/PhoneAuth";
import MonoLabel from "@/components/ui/MonoLabel";
import BackButton from "@/components/ui/BackButton";
import { supabase } from "@/lib/supabase";

interface PendingRoom {
  roomId: number;
  memberId: string;
  roomName: string;
  sendDate: string;
}

export default function RecoverPage() {
  const [rooms, setRooms] = useState<PendingRoom[] | null>(null);

  async function handleVerified(_name: string, phone: string) {
    // 이 번호로 가입된 멤버 전체 조회
    const { data: members } = await supabase
      .from("room_members")
      .select("id, room_id, rooms(name, send_date, status)")
      .eq("phone", phone);

    if (!members || members.length === 0) { setRooms([]); return; }

    // 이미 편지 제출한 sender_id 목록
    const memberIds = members.map((m) => m.id);
    const { data: submitted } = await supabase
      .from("letters")
      .select("sender_id")
      .in("sender_id", memberIds);

    const submittedIds = new Set((submitted ?? []).map((l) => l.sender_id));

    // 편지 미작성 + 방 started 상태인 것만 필터
    const pending: PendingRoom[] = [];
    for (const m of members) {
      if (submittedIds.has(m.id)) continue;
      const room = Array.isArray(m.rooms) ? m.rooms[0] : m.rooms;
      if (!room || room.status !== "started") continue;
      pending.push({
        roomId: m.room_id,
        memberId: m.id,
        roomName: room.name,
        sendDate: room.send_date,
      });
    }

    setRooms(pending);
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12">
      <div className="max-w-[390px] mx-auto">
        <div className="mb-6"><BackButton /></div>
        <div className="mb-10">
          <MonoLabel caps className="block mb-3">배편 서신</MonoLabel>
          <h1 className="text-headline-lg text-[var(--ink)]">내 방 찾기</h1>
          <p className="text-body-sm text-[var(--muted)] mt-2">
            전화번호 인증 후 아직 편지를 쓰지 못한 방을 찾아드립니다.
          </p>
        </div>

        {rooms === null && (
          <PhoneAuth onVerified={handleVerified} />
        )}

        {rooms !== null && rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body-serif text-[var(--muted)]">
              미작성 편지가 있는 방이 없습니다.
            </p>
            <Link href="/letter" className="block mt-6 text-body-sm text-[var(--accent)]">
              방 목록으로 →
            </Link>
          </div>
        )}

        {rooms !== null && rooms.length > 0 && (
          <div className="flex flex-col gap-3">
            <MonoLabel caps className="block mb-2">편지를 아직 쓰지 않은 방</MonoLabel>
            {rooms.map((r) => (
              <Link
                key={r.roomId}
                href={`/letter/room/${r.roomId}`}
                onClick={() => localStorage.setItem(`room_member_${r.roomId}`, r.memberId)}
                className="block bg-[var(--paper)] rounded-[18px] p-5 border border-[var(--line-soft)]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-headline-sm text-[var(--ink)]">{r.roomName}</h2>
                  <MonoLabel>편지 작성 중</MonoLabel>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-body-sm text-[var(--muted)]">
                    발송일 · {new Date(r.sendDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <span className="text-body-sm text-[var(--accent)]">편지 쓰기 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
