import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import MonoLabel from "@/components/ui/MonoLabel";
import BackButton from "@/components/ui/BackButton";
import EnvelopeAnimation from "./EnvelopeAnimation";

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function LetterDeliveryPage({ params }: Props) {
  const { uuid } = await params;
  const supabase = createServerClient();

  const { data: letter } = await supabase
    .from("letters")
    .select(`
      id, content, photo_url, created_at,
      sender:room_members!sender_id(name),
      receiver:room_members!receiver_id(name),
      room:rooms!room_id(name, send_date)
    `)
    .eq("id", uuid)
    .single();

  if (!letter) notFound();

  const sender = Array.isArray(letter.sender) ? letter.sender[0] : letter.sender;
  const receiver = Array.isArray(letter.receiver) ? letter.receiver[0] : letter.receiver;
  const room = Array.isArray(letter.room) ? letter.room[0] : letter.room;

  const sendDateStr = room?.send_date
    ? new Date(room.send_date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12">
      <div className="max-w-[390px] mx-auto">
        <div className="mb-6"><BackButton /></div>
        {/* 바람이 헤더 */}
        <div className="text-center mb-10">
          <MonoLabel caps className="block mb-2">배편으로 도착한 편지</MonoLabel>
          <h1 className="text-headline-md text-[var(--ink)]">{receiver?.name}님께<br/>편지가 닿았습니다</h1>
          {sendDateStr && (
            <p className="text-body-sm text-[var(--muted)] mt-2">{sendDateStr}</p>
          )}
        </div>

        {/* 봉투 + 편지 카드 애니메이션 */}
        <EnvelopeAnimation
          senderName={sender?.name ?? ""}
          receiverName={receiver?.name ?? ""}
          content={letter.content}
          photoUrl={letter.photo_url}
          roomName={room?.name ?? ""}
        />

        {/* 하단 카피 */}
        <p className="text-body-serif text-[var(--muted)] text-center mt-10">
          바다를 건너온 마음이<br/>이제 당신 곁에 있습니다.
        </p>
        <div className="text-center mt-6">
          <MonoLabel>느린 소식 · 제주 · No.001</MonoLabel>
        </div>
      </div>
    </main>
  );
}
