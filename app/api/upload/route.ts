import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${uuidv4()}.${ext}`;

  const supabase = createServerClient();
  const { error } = await supabase.storage
    .from("photos")
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
