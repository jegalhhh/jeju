"use client";

import { useState } from "react";
import PhoneAuth from "@/components/PhoneAuth";
import PhotoUpload from "@/components/PhotoUpload";
import Button from "@/components/ui/Button";
import MonoLabel from "@/components/ui/MonoLabel";
import StepRow from "@/components/ui/StepRow";

type Step = "intro" | "auth" | "wish" | "date" | "done";

export default function WishPage() {
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [wishText, setWishText] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!wishText.trim()) { setError("소원을 입력해주세요"); return; }
    if (!sendDate) { setError("발송일을 선택해주세요"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/wish/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, photoUrl, wishText, sendDate }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "제출에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12">
      <div className="max-w-[390px] mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <MonoLabel caps className="block mb-3">성산일출봉 · 소원</MonoLabel>
          <h1 className="text-headline-lg text-[var(--ink)]">소원 빌기</h1>
          <p className="text-body-sm text-[var(--muted)] mt-2">
            봉이가 소원을 듣고, 귀국 후 편지로 전합니다.
          </p>
        </div>

        {/* 스텝 안내 */}
        {step === "intro" && (
          <div>
            <div className="border-b border-[var(--line)]">
              <StepRow step={1} title="본인 확인" description="이름과 전화번호로 인증합니다." />
              <StepRow step={2} title="사진 + 소원" description="제주에서 찍은 사진과 소원을 남겨요." handNote="마음속 소원을" />
              <StepRow step={3} title="발송일 선택" description="소원을 받고 싶은 날짜를 고릅니다." />
            </div>
            <div className="mt-8">
              <Button arrow onClick={() => setStep("auth")}>시작하기</Button>
            </div>
          </div>
        )}

        {/* 인증 */}
        {step === "auth" && (
          <div>
            <h2 className="text-headline-sm text-[var(--ink)] mb-6">STEP 01 — 본인 확인</h2>
            <PhoneAuth
              onVerified={(n, p) => {
                setName(n);
                setPhone(p);
                setStep("wish");
              }}
            />
          </div>
        )}

        {/* 사진 + 소원 */}
        {step === "wish" && (
          <div>
            <h2 className="text-headline-sm text-[var(--ink)] mb-6">STEP 02 — 사진 + 소원</h2>
            <div className="flex flex-col gap-5">
              <PhotoUpload onUploaded={setPhotoUrl} />
              <textarea
                placeholder="지금 이 순간, 가장 간절한 소원을 적어주세요."
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-serif text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] resize-none"
              />
              <Button arrow onClick={() => { if (!wishText.trim()) { setError("소원을 입력해주세요"); return; } setError(""); setStep("date"); }}>
                다음
              </Button>
              {error && <p className="text-body-sm text-red-500">{error}</p>}
            </div>
          </div>
        )}

        {/* 발송일 선택 */}
        {step === "date" && (
          <div>
            <h2 className="text-headline-sm text-[var(--ink)] mb-6">STEP 03 — 발송일 선택</h2>
            <p className="text-body-sm text-[var(--muted)] mb-4">
              귀국일 또는 소원을 받고 싶은 날짜를 선택하세요.
            </p>
            <input
              type="date"
              min={today}
              value={sendDate}
              onChange={(e) => setSendDate(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-md text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />

            <div className="mt-6 flex flex-col gap-3">
              <Button arrow onClick={handleSubmit} disabled={loading}>
                {loading ? "봉이가 편지를 쓰고 있어요..." : "소원 남기기"}
              </Button>
              <Button variant="secondary" onClick={() => setStep("wish")}>이전으로</Button>
            </div>
            {error && <p className="mt-2 text-body-sm text-red-500">{error}</p>}
          </div>
        )}

        {/* 완료 */}
        {step === "done" && (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto rounded-full border border-dashed border-[var(--accent)] flex items-center justify-center mb-6">
              <span className="text-caption-mono text-[var(--accent)]">완료</span>
            </div>
            <h2 className="text-headline-sm text-[var(--ink)] mb-4">소원을 실었습니다</h2>
            <p className="text-body-serif text-[var(--muted)]">
              봉이가 소원을 간직하고 있습니다.<br/>
              {sendDate && (
                <>
                  {new Date(sendDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}에<br/>
                </>
              )}
              문자로 편지를 전해드릴게요.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
