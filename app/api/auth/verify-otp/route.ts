import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("otp_codes")
    .select("id, code, expires_at, used")
    .eq("phone", phone)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return NextResponse.json({ error: "인증번호를 찾을 수 없습니다" }, { status: 400 });
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ error: "인증번호가 만료되었습니다" }, { status: 400 });
  if (data.code !== code) return NextResponse.json({ error: "인증번호가 일치하지 않습니다" }, { status: 400 });

  await supabase.from("otp_codes").update({ used: true }).eq("id", data.id);

  return NextResponse.json({ verified: true });
}
