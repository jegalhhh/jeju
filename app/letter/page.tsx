import { createServerClient } from "@/lib/supabase-server";
import LetterPageClient from "./LetterPageClient";

export const revalidate = 0;

export default async function LetterListPage() {
  const supabase = createServerClient();
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, send_date, status, created_at")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  return <LetterPageClient rooms={rooms ?? []} />;
}
