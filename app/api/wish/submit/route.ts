import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generateWishLetter } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { name, phone, photoUrl, wishText, sendDate, sendTime } = await req.json();

  if (!name || !phone || !wishText || !sendDate) {
    return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
  }

  // 봉이 편지 즉시 생성
  let letterText = "";
  try {
    letterText = await generateWishLetter(photoUrl ?? null, wishText);
  } catch {
    return NextResponse.json({ error: "편지 생성 실패" }, { status: 500 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("wishes")
    .insert({ name, phone, photo_url: photoUrl ?? null, wish_text: wishText, letter_text: letterText, send_date: sendDate, send_time: sendTime ?? "09:00" })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ uuid: data.id });
}
