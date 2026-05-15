import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import MonoLabel from "@/components/ui/MonoLabel";
import PaletteToggle from "@/components/PaletteToggle";
import BackButton from "@/components/ui/BackButton";

export const revalidate = 0;

interface Room {
  id: number;
  name: string;
  send_date: string;
  status: "open" | "started" | "closed";
  created_at: string;
}

export default async function LetterListPage() {
  const supabase = createServerClient();
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, send_date, status, created_at")
    .order("status", { ascending: true })  // open < started < closed
    .order("created_at", { ascending: false });

  const openRooms = (rooms ?? []).filter((r: Room) => r.status === "open");
  const startedRooms = (rooms ?? []).filter((r: Room) => r.status === "started");
  const closedRooms = (rooms ?? []).filter((r: Room) => r.status === "closed");

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12">
      <div className="max-w-[390px] mx-auto">
        <div className="mb-6"><BackButton /></div>
        <div className="mb-10">
          <MonoLabel caps className="block mb-3">배편 서신 · 방 목록</MonoLabel>
          <h1 className="text-headline-lg text-[var(--ink)]">배편 서신</h1>
          <p className="text-body-sm text-[var(--muted)] mt-2">
            방을 골라 입장하고 편지를 써보세요.
          </p>
        </div>

        {/* 입장 가능한 방 */}
        {openRooms.length > 0 && (
          <div className="mb-8">
            <MonoLabel caps className="block mb-4">입장 가능</MonoLabel>
            <div className="flex flex-col gap-3">
              {openRooms.map((room: Room) => (
                <Link key={room.id} href={`/letter/room/${room.id}`} className="block">
                  <RoomCard room={room} disabled={false} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 편지 작성 중인 방 (started) — 기존 참여자 재입장 가능 */}
        {startedRooms.length > 0 && (
          <div className="mb-8">
            <MonoLabel caps className="block mb-4">편지 작성 중</MonoLabel>
            <div className="flex flex-col gap-3">
              {startedRooms.map((room: Room) => (
                <Link key={room.id} href={`/letter/room/${room.id}`} className="block">
                  <RoomCard room={room} disabled={false} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 마감된 방 */}
        {closedRooms.length > 0 && (
          <div>
            <MonoLabel caps className="block mb-4">마감</MonoLabel>
            <div className="flex flex-col gap-3 opacity-50">
              {closedRooms.map((room: Room) => (
                <RoomCard key={room.id} room={room} disabled />
              ))}
            </div>
          </div>
        )}

        {(!rooms || rooms.length === 0) && (
          <div className="text-center py-16">
            <p className="text-body-serif text-[var(--muted)]">아직 개설된 방이 없습니다.</p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/letter/recover" className="text-body-sm text-[var(--muted)] underline underline-offset-2">
          입장했던 방을 찾으시나요? →
        </Link>
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
