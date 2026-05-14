import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendSms } from "@/lib/solapi";

function checkAdmin(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerClient();

  // 발신자 전화번호 조회
  const { data: letter } = await supabase
    .from("letters")
    .select("sender_id, room_members!sender_id(phone, name)")
    .eq("id", id)
    .single();

  if (!letter) return NextResponse.json({ error: "편지를 찾을 수 없습니다" }, { status: 404 });

  await supabase.from("letters").update({ status: "rejected" }).eq("id", id);

  // 재작성 요청 SMS
  const member = Array.isArray(letter.room_members)
    ? letter.room_members[0]
    : letter.room_members;

  if (member?.phone) {
    try {
      await sendSms(
        member.phone,
        `[느린 소식] ${member.name}님, 편지 검토 중 반려되었습니다. 다시 작성해주세요.`,
      );
    } catch {
      // SMS 실패해도 반려 처리는 완료
    }
  }

  return NextResponse.json({ ok: true });
}
