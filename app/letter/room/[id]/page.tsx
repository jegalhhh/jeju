"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PhoneAuth from "@/components/PhoneAuth";
import PhotoUpload from "@/components/PhotoUpload";
import Button from "@/components/ui/Button";
import MonoLabel from "@/components/ui/MonoLabel";
import { supabase } from "@/lib/supabase";

interface Room {
  id: number;
  name: string;
  send_date: string;
  status: "open" | "started" | "closed";
}

interface Member {
  id: string;
  name: string;
  matched_to_id: string | null;
}

interface MatchedMember {
  id: string;
  name: string;
}

type PageStep = "loading" | "auth" | "waiting" | "write" | "submitted";
type AuthMode = "phone" | "name-only";

function memberKey(roomId: string) {
  return `room_member_${roomId}`;
}

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [step, setStep] = useState<PageStep>("loading");
  const [authMode, setAuthMode] = useState<AuthMode>("phone");
  const [nameOnly, setNameOnly] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [matchedMember, setMatchedMember] = useState<MatchedMember | null>(null);
  const [content, setContent] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("rooms")
      .select("id, name, send_date, status")
      .eq("id", id)
      .single()
      .then(async ({ data }) => {
        if (!data) return;
        setRoom(data);

        // localStorage에 저장된 member ID로 자동 복원
        const savedId = localStorage.getItem(memberKey(id));
        if (savedId) {
          const { data: saved } = await supabase
            .from("room_members")
            .select("id, name, matched_to_id")
            .eq("id", savedId)
            .single();
          if (saved) { await loadMemberState(saved); return; }
        }

        setStep("auth");
      });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVerified(name: string, phone: string) {
    const { data: existing } = await supabase
      .from("room_members")
      .select("id, name, matched_to_id")
      .eq("room_id", id)
      .eq("phone", phone)
      .single();

    if (existing) { await loadMemberState(existing); return; }

    if (room?.status !== "open") { setError("이 방은 더 이상 입장할 수 없습니다."); return; }

    const res = await fetch("/api/room-member/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: id, name, phone }),
    });
    if (!res.ok) { setError("입장에 실패했습니다."); return; }
    const { member: newMember } = await res.json();
    await loadMemberState(newMember);
  }

  async function handleNameOnlyJoin() {
    if (!nameOnly.trim()) { setError("이름을 입력해주세요."); return; }
    if (room?.status !== "open") { setError("이 방은 더 이상 입장할 수 없습니다."); return; }
    setError("");
    setLoading(true);
    const res = await fetch("/api/room-member/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: id, name: nameOnly.trim(), phone: "" }),
    });
    setLoading(false);
    if (!res.ok) { setError("입장에 실패했습니다."); return; }
    const { member: newMember } = await res.json();
    await loadMemberState(newMember);
  }

  async function loadMemberState(m: Member) {
    setMember(m);
    localStorage.setItem(memberKey(id), m.id);

    if (!m.matched_to_id) { setStep("waiting"); return; }

    const { data: matched } = await supabase
      .from("room_members").select("id, name").eq("id", m.matched_to_id).single();
    setMatchedMember(matched);

    const { data: existingLetter } = await supabase
      .from("letters").select("id").eq("sender_id", m.id).single();
    setStep(existingLetter ? "submitted" : "write");
  }

  async function handleCheckMatch() {
    if (!member) return;
    setCheckingMatch(true);
    const { data: fresh } = await supabase
      .from("room_members")
      .select("id, name, matched_to_id")
      .eq("id", member.id)
      .single();
    setCheckingMatch(false);
    if (fresh) await loadMemberState(fresh);
  }

  async function handleSubmitLetter() {
    if (!content.trim()) { setError("편지 내용을 입력해주세요."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/letter/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: member?.id, content, photoUrl }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep("submitted");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "제출에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "loading") {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-body-md text-[var(--muted)]">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12">
      <div className="max-w-[390px] mx-auto">
        <div className="mb-8">
          <MonoLabel caps className="block mb-2">배편 서신</MonoLabel>
          <h1 className="text-headline-lg text-[var(--ink)]">{room?.name}</h1>
          {room?.send_date && (
            <p className="text-body-sm text-[var(--muted)] mt-1">
              발송일 · {new Date(room.send_date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>

        {/* 인증 */}
        {step === "auth" && (
          <div>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-2 rounded-[10px] text-body-sm transition-colors ${authMode === "phone" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper)] text-[var(--muted)] border border-[var(--line)]"}`}
              >
                전화번호 인증
              </button>
              <button
                onClick={() => setAuthMode("name-only")}
                className={`flex-1 py-2 rounded-[10px] text-body-sm transition-colors ${authMode === "name-only" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper)] text-[var(--muted)] border border-[var(--line)]"}`}
              >
                이름만으로 입장
              </button>
            </div>

            {authMode === "phone" && (
              <PhoneAuth onVerified={handleVerified} />
            )}

            {authMode === "name-only" && (
              <div className="flex flex-col gap-3">
                <p className="text-body-sm text-[var(--muted)]">SMS를 받을 수 없습니다.</p>
                <input
                  type="text"
                  placeholder="이름"
                  value={nameOnly}
                  onChange={(e) => setNameOnly(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-md text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
                />
                <Button arrow onClick={handleNameOnlyJoin} disabled={loading}>
                  {loading ? "입장 중..." : "입장하기"}
                </Button>
              </div>
            )}

            {error && <p className="mt-3 text-body-sm text-red-500">{error}</p>}
          </div>
        )}

        {/* 시작 대기 */}
        {step === "waiting" && (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto rounded-full border border-dashed border-[var(--accent)] flex items-center justify-center mb-6">
              <span className="text-caption-mono text-[var(--accent)]">대기</span>
            </div>
            <h2 className="text-headline-sm text-[var(--ink)] mb-3">입장 완료</h2>
            <p className="text-body-serif text-[var(--muted)] mb-8">
              관리자가 방을 시작하면<br/>매칭 상대가 공개됩니다.
            </p>
            <Button variant="secondary" onClick={handleCheckMatch} disabled={checkingMatch}>
              {checkingMatch ? "확인 중..." : "매칭 확인하기"}
            </Button>
          </div>
        )}

        {/* 편지 작성 */}
        {step === "write" && matchedMember && (
          <div>
            <div className="bg-[var(--paper)] rounded-[14px] p-5 mb-6 border border-[var(--line-soft)]">
              <MonoLabel caps className="block mb-2">편지 받을 사람</MonoLabel>
              <p className="text-headline-sm text-[var(--ink)]">{matchedMember.name}님</p>
            </div>
            <div className="flex flex-col gap-4">
              <PhotoUpload onUploaded={setPhotoUrl} />
              <textarea
                placeholder={`${matchedMember.name}님께 전하고 싶은 마음을 담아주세요.`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-serif text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] resize-none"
              />
              <Button arrow onClick={handleSubmitLetter} disabled={loading}>
                {loading ? "제출 중..." : "편지 보내기"}
              </Button>
              {error && <p className="text-body-sm text-red-500">{error}</p>}
            </div>
          </div>
        )}

        {/* 제출 완료 */}
        {step === "submitted" && (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto rounded-full border border-dashed border-[var(--accent)] flex items-center justify-center mb-6">
              <span className="text-caption-mono text-[var(--accent)]">완료</span>
            </div>
            <h2 className="text-headline-sm text-[var(--ink)] mb-3">편지를 실었습니다</h2>
            <p className="text-body-serif text-[var(--muted)]">
              파도가 잠잠해지면<br/>약속된 날 편지가 닿습니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
