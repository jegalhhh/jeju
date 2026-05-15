import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendSms } from "@/lib/solapi";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // KST = UTC+9
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const today = kstNow.toISOString().split("T")[0];
  const kstHour = kstNow.getUTCHours();

  const supabase = createServerClient();

  const { data: letters } = await supabase
    .from("letters")
    .select("id, receiver_id, room_members!receiver_id(phone, name), rooms!room_id(send_date, send_time)")
    .eq("status", "approved");

  if (!letters || letters.length === 0) return NextResponse.json({ sent: 0 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  let sent = 0;

  for (const letter of letters) {
    const room = Array.isArray(letter.rooms) ? letter.rooms[0] : letter.rooms;
    if (!room || room.send_date !== today) continue;
    if (parseInt((room.send_time ?? "09:00").split(":")[0], 10) !== kstHour) continue;

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
