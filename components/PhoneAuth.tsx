"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface PhoneAuthProps {
  onVerified: (name: string, phone: string) => void;
  showName?: boolean;
}

export default function PhoneAuth({ onVerified, showName = true }: PhoneAuthProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp() {
    if (showName && !name.trim()) { setError("이름을 입력해주세요"); return; }
    if (!phone.trim()) { setError("전화번호를 입력해주세요"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep("verify");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "인증번호 발송에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!code.trim()) { setError("인증번호를 입력해주세요"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      if (!res.ok) throw new Error(await res.text());
      onVerified(name, phone);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "인증에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {step === "input" && (
        <>
          {showName && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-md text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
            />
          )}
          <input
            type="tel"
            placeholder="전화번호 (01012345678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-md text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]"
          />
          <Button onClick={handleSendOtp} disabled={loading} arrow>
            {loading ? "발송 중..." : "인증번호 받기"}
          </Button>
        </>
      )}

      {step === "verify" && (
        <>
          <p className="text-body-sm text-[var(--muted)]">
            {phone}으로 인증번호를 발송했습니다.
          </p>
          <input
            type="text"
            placeholder="인증번호 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-3 rounded-[14px] bg-[var(--paper)] border border-[var(--line)] text-body-md text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] tracking-widest"
          />
          <Button onClick={handleVerify} disabled={loading} arrow>
            {loading ? "확인 중..." : "확인"}
          </Button>
          <button
            className="text-body-sm text-[var(--muted)] underline"
            onClick={() => setStep("input")}
          >
            번호 다시 입력
          </button>
        </>
      )}

      {error && (
        <p className="text-body-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
