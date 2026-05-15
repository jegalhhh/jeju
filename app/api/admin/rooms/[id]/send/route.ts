import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendSms } from "@/lib/solapi";

function checkAdmin(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerClient();

  // 해당 방의 approved 편지 전체 조회
  const { data: letters, error } = await supabase
    .from("letters")
    .select("id, receiver_id, room_members!receiver_id(phone, name)")
    .eq("room_id", id)
    .eq("status", "approved");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!letters || letters.length === 0) return NextResponse.json({ error: "승인된 편지가 없습니다" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  let sent = 0;

  for (const letter of letters) {
    const receiver = Array.isArray(letter.room_members) ? letter.room_members[0] : letter.room_members;
    if (!receiver?.phone) continue;

    try {
      await sendSms(
        receiver.phone,
        `[느린 소식] ${receiver.name}님께 배편으로 편지가 도착했습니다.\n${baseUrl}/letter/${letter.id}`,
      );
      await supabase.from("letters").update({ status: "sent" }).eq("id", letter.id);
      sent++;
    } catch {
      await supabase.from("letters").update({ status: "failed" }).eq("id", letter.id);
    }
  }

  return NextResponse.json({ sent });
}
