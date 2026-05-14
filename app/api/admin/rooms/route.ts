import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("*, room_members(id, name, matched_to_id)")
    .order("created_at", { ascending: false });

  if (roomsError) return NextResponse.json({ error: roomsError.message }, { status: 500 });

  const { data: letters, error: lettersError } = await supabase
    .from("letters")
    .select("id, room_id, sender_id, content, photo_url, status");

  if (lettersError) return NextResponse.json({ error: lettersError.message }, { status: 500 });

  // room_members에 letters 붙이기
  const result = (rooms ?? []).map((room) => ({
    ...room,
    room_members: (room.room_members ?? []).map((member: { id: string; name: string; matched_to_id: string | null }) => ({
      ...member,
      letters: (letters ?? []).filter((l) => l.sender_id === member.id),
    })),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, sendDate, sendTime } = await req.json();
  if (!name || !sendDate) return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rooms")
    .insert({ name, send_date: sendDate, send_time: sendTime ?? "09:00" })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
