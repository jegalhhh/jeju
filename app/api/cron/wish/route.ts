import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendSms } from "@/lib/solapi";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // KST = UTC+9, 매일 00:00 UTC(=09:00 KST)에 실행
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = kstNow.toISOString().split("T")[0];

  const supabase = createServerClient();

  const { data: wishes } = await supabase
    .from("wishes")
    .select("id, phone, name")
    .eq("send_date", today)
    .eq("status", "pending");

  if (!wishes || wishes.length === 0) return NextResponse.json({ sent: 0 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  let sent = 0;

  for (const wish of wishes) {
    try {
      await sendSms(wish.phone, `[느린 소식] ${wish.name}님의 소원이 도착했습니다.\n${baseUrl}/wish/${wish.id}`);
      await supabase.from("wishes").update({ status: "sent" }).eq("id", wish.id);
      sent++;
    } catch {
      await supabase.from("wishes").update({ status: "failed" }).eq("id", wish.id);
    }
  }

  return NextResponse.json({ sent });
}
