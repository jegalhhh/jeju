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

  const { data: wish, error } = await supabase
    .from("wishes")
    .select("id, phone, name, status")
    .eq("id", id)
    .single();

  if (error || !wish) return NextResponse.json({ error: "소원을 찾을 수 없습니다" }, { status: 404 });
  if (wish.status === "sent") return NextResponse.json({ error: "이미 발송된 소원입니다" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  try {
    await sendSms(wish.phone, `[느린 소식] ${wish.name}님의 소원이 도착했습니다.\n${baseUrl}/wish/${wish.id}`);
    await supabase.from("wishes").update({ status: "sent" }).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    await supabase.from("wishes").update({ status: "failed" }).eq("id", id);
    return NextResponse.json({ error: e instanceof Error ? e.message : "발송 실패" }, { status: 500 });
  }
}
