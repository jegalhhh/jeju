import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { memberId, content, photoUrl } = await req.json();

  if (!memberId || !content) {
    return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
  }

  const supabase = createServerClient();

  // 발신자 정보 + 매칭 상대 조회
  const { data: member, error: memberErr } = await supabase
    .from("room_members")
    .select("id, room_id, matched_to_id")
    .eq("id", memberId)
    .single();

  if (memberErr || !member) return NextResponse.json({ error: "참여자를 찾을 수 없습니다" }, { status: 404 });
  if (!member.matched_to_id) return NextResponse.json({ error: "아직 매칭이 완료되지 않았습니다" }, { status: 400 });

  // 이미 제출한 편지가 있는지 확인
  const { data: existing } = await supabase
    .from("letters")
    .select("id")
    .eq("sender_id", memberId)
    .limit(1)
    .single();

  if (existing) return NextResponse.json({ error: "이미 편지를 제출했습니다" }, { status: 400 });

  const { data, error } = await supabase
    .from("letters")
    .insert({
      room_id: member.room_id,
      sender_id: memberId,
      receiver_id: member.matched_to_id,
      content,
      photo_url: photoUrl ?? null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ uuid: data.id });
}
