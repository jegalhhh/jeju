import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

function checkAdmin(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerClient();

  // 방 상태 확인
  const { data: room } = await supabase.from("rooms").select("status").eq("id", id).single();
  if (!room) return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  if (room.status !== "open") return NextResponse.json({ error: "이미 시작된 방입니다" }, { status: 400 });

  // 참여자 조회
  const { data: members } = await supabase.from("room_members").select("id").eq("room_id", id);
  if (!members || members.length < 2) return NextResponse.json({ error: "참여자가 2명 이상 필요합니다" }, { status: 400 });

  // 순환 매칭
  const shuffled = shuffle(members);
  const updates = shuffled.map((m, i) => ({
    id: m.id,
    matched_to_id: shuffled[(i + 1) % shuffled.length].id,
  }));

  for (const u of updates) {
    await supabase.from("room_members").update({ matched_to_id: u.matched_to_id }).eq("id", u.id);
  }

  await supabase.from("rooms").update({ status: "started" }).eq("id", id);

  return NextResponse.json({ ok: true, matched: updates.length });
}
