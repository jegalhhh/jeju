import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendSms } from "@/lib/solapi";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "전화번호가 필요합니다" }, { status: 400 });

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5분

  const supabase = createServerClient();
  const { error } = await supabase.from("otp_codes").insert({
    phone,
    code,
    expires_at: expiresAt.toISOString(),
  });

  if (error) return NextResponse.json({ error: "DB 오류" }, { status: 500 });

  try {
    await sendSms(phone, `[느린 소식] 인증번호: ${code} (5분 이내 입력)`);
  } catch {
    return NextResponse.json({ error: "SMS 발송 실패" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
