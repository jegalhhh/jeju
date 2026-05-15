"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import MonoLabel from "@/components/ui/MonoLabel";

type Tab = "wish" | "letter";

interface Wish {
  id: string;
  name: string;
  wish_text: string;
  send_date: string;
  status: string;
}

interface Room {
  id: number;
  name: string;
  send_date: string;
  status: string;
  room_members: Member[];
}

interface Member {
  id: string;
  name: string;
  matched_to_id: string | null;
  letters: Letter[];
}

interface Letter {
  id: string;
  content: string;
  photo_url: string | null;
  status: string;
  sender_id: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "대기중",
  sent: "발송완료",
  failed: "실패",
  approved: "승인",
  rejected: "반려",
  open: "입장 가능",
  started: "진행 중",
  closed: "마감",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("wish");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDate, setNewRoomDate] = useState("");
  const [newRoomTime, setNewRoomTime] = useState("09:00");
  const adminPwRef = useRef("");

  useEffect(() => {
    const stored = localStorage.getItem("admin_auth");
    if (stored) {
      adminPwRef.current = stored;
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      fetchWishes();
      fetchRooms();
    }
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogin() {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { alert("비밀번호가 틀렸습니다."); return; }
    localStorage.setItem("admin_auth", password);
    adminPwRef.current = password;
    setAuthed(true);
  }

  function adminHeaders() {
    return { "x-admin-password": adminPwRef.current, "Content-Type": "application/json" };
  }

  async function fetchWishes() {
    const res = await fetch("/api/admin/wishes", { headers: { "x-admin-password": adminPwRef.current } });
    if (res.ok) setWishes(await res.json());
  }

  async function fetchRooms() {
    const res = await fetch("/api/admin/rooms", { headers: { "x-admin-password": adminPwRef.current } });
    if (res.ok) setRooms(await res.json());
  }

  async function handleCreateRoom() {
    if (!newRoomName || !newRoomDate) { alert("방 이름과 발송일을 입력해주세요."); return; }
    const res = await fetch("/api/admin/rooms", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ name: newRoomName, sendDate: newRoomDate, sendTime: newRoomTime }),
    });
    if (res.ok) { setNewRoomName(""); setNewRoomDate(""); setNewRoomTime("09:00"); fetchRooms(); }
  }

  async function handleStartRoom(roomId: number) {
    const res = await fetch(`/api/admin/rooms/${roomId}/start`, {
      method: "POST",
      headers: adminHeaders(),
    });
    if (res.ok) fetchRooms();
    else alert("방 시작에 실패했습니다.");
  }

  async function handleApprove(letterId: string) {
    await fetch(`/api/admin/letters/${letterId}/approve`, { method: "POST", headers: adminHeaders() });
    fetchRooms();
  }

  async function handleReject(letterId: string) {
    await fetch(`/api/admin/letters/${letterId}/reject`, { method: "POST", headers: adminHeaders() });
    fetchRooms();
  }

  const today = new Date().toISOString().split("T")[0];

  if (!authed) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-7">
        <div className="w-full max-w-[390px]">
          <MonoLabel caps className="block mb-4 text-center">관리자</MonoLabel>
          <h1 className="text-headline-lg text-[var(--ink)] text-center mb-8">느린 소식</h1>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-md text-[var(--ink)] outline-none focus:border-[var(--accent)] mb-4"
          />
          <Button arrow onClick={handleLogin}>입장</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-5 py-10">
      <div className="max-w-[480px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-headline-md text-[var(--ink)]">관리자</h1>
          <button
            className="text-body-sm text-[var(--muted)] underline"
            onClick={() => { localStorage.removeItem("admin_auth"); adminPwRef.current = ""; setAuthed(false); }}
          >
            로그아웃
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-8">
          {(["wish", "letter"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-[14px] text-body-md transition-colors ${tab === t ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper)] text-[var(--muted)] border border-[var(--line)]"}`}
            >
              {t === "wish" ? "소원 관리" : "방 관리"}
            </button>
          ))}
        </div>

        {/* 소원 탭 */}
        {tab === "wish" && (
          <div>
            <div className="flex justify-end mb-4">
              <button className="text-body-sm text-[var(--accent)]" onClick={fetchWishes}>새로고침</button>
            </div>
            {wishes.length === 0 ? (
              <p className="text-body-sm text-[var(--muted)] text-center py-8">소원이 없습니다.</p>
            ) : wishes.map((w) => (
              <div key={w.id} className="bg-[var(--paper)] rounded-[14px] p-4 mb-3 border border-[var(--line-soft)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-headline-sm text-[var(--ink)]">{w.name}</span>
                  <MonoLabel>{STATUS_LABEL[w.status] ?? w.status}</MonoLabel>
                </div>
                <p className="text-body-sm text-[var(--muted)] mb-2">{w.wish_text.slice(0, 40)}...</p>
                <div className="flex items-center justify-between">
                  <MonoLabel>발송일 · {w.send_date}</MonoLabel>
                  <a
                    href={`/wish/${w.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-body-sm text-[var(--accent)]"
                  >
                    미리보기 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 방 관리 탭 */}
        {tab === "letter" && (
          <div>
            {/* 방 만들기 */}
            <div className="bg-[var(--paper)] rounded-[14px] p-4 mb-6 border border-[var(--line-soft)]">
              <MonoLabel caps className="block mb-3">방 만들기</MonoLabel>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="방 이름"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] text-body-md text-[var(--ink)] placeholder:text-[var(--muted)] outline-none"
                />
                <input
                  type="date"
                  min={today}
                  value={newRoomDate}
                  onChange={(e) => setNewRoomDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] text-body-md text-[var(--ink)] outline-none"
                />

                <div className="flex items-center gap-2">
                  <label className="text-body-sm text-[var(--muted)] shrink-0">발송 시각 (KST)</label>
                  <input
                    type="time"
                    value={newRoomTime}
                    onChange={(e) => setNewRoomTime(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] text-body-md text-[var(--ink)] outline-none"
                  />
                </div>
                <Button arrow onClick={handleCreateRoom}>방 만들기</Button>
              </div>
            </div>

            {/* 방 목록 */}
            <div className="flex justify-end mb-3">
              <button className="text-body-sm text-[var(--accent)]" onClick={fetchRooms}>새로고침</button>
            </div>
            {rooms.map((room) => (
              <div key={room.id} className="bg-[var(--paper)] rounded-[14px] p-4 mb-4 border border-[var(--line-soft)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-headline-sm text-[var(--ink)]">{room.name}</span>
                  <MonoLabel>{STATUS_LABEL[room.status] ?? room.status}</MonoLabel>
                </div>
                <MonoLabel className="block mb-3">발송일 · {room.send_date} · 참여자 {room.room_members?.length ?? 0}명</MonoLabel>

                {room.status === "open" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStartRoom(room.id)}
                    arrow
                  >
                    방 시작하기
                  </Button>
                )}

                {/* 편지 목록 */}
                {room.room_members?.flatMap((m) => m.letters ?? []).map((letter) => {
                  const senderMember = room.room_members.find((m) => m.id === letter.sender_id);
                  return (
                    <div key={letter.id} className="mt-3 pt-3 border-t border-[var(--line)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-body-sm text-[var(--ink)]">{senderMember?.name}의 편지</span>
                        <MonoLabel>{STATUS_LABEL[letter.status] ?? letter.status}</MonoLabel>
                      </div>
                      <p className="text-body-sm text-[var(--muted)] mb-3">{letter.content.slice(0, 50)}...</p>
                      <div className="flex gap-2">
                        <a
                          href={`/letter/${letter.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-body-sm text-[var(--accent)]"
                        >
                          미리보기
                        </a>
                        {letter.status === "pending" && (
                          <>
                            <button
                              className="text-body-sm text-green-600"
                              onClick={() => handleApprove(letter.id)}
                            >
                              승인
                            </button>
                            <button
                              className="text-body-sm text-red-500"
                              onClick={() => handleReject(letter.id)}
                            >
                              반려
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
