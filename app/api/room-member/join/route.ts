import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { roomId, name, phone } = await req.json();
  if (!roomId || !name) return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });

  const supabase = createServerClient();

  // 방 상태 확인
  const { data: room } = await supabase.from("rooms").select("status").eq("id", roomId).single();
  if (!room) return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  if (room.status !== "open") return NextResponse.json({ error: "이미 시작된 방입니다" }, { status: 400 });

  const { data, error } = await supabase
    .from("room_members")
    .insert({ room_id: roomId, name, phone })
    .select("id, name, matched_to_id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ member: data });
}
