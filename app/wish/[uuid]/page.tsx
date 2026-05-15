import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import MonoLabel from "@/components/ui/MonoLabel";
import PaletteToggle from "@/components/PaletteToggle";
import BackButton from "@/components/ui/BackButton";
import FadeImage from "@/components/ui/FadeImage";

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function WishDeliveryPage({ params }: Props) {
  const { uuid } = await params;
  const supabase = createServerClient();

  const { data: wish } = await supabase
    .from("wishes")
    .select("name, photo_url, wish_text, letter_text, send_date, created_at")
    .eq("id", uuid)
    .single();

  if (!wish) notFound();

  const sendDateStr = new Date(wish.send_date).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--bg)] px-7 py-12" data-palette="sunrise">
      <div className="max-w-[390px] mx-auto">
        <div className="mb-6"><BackButton /></div>
        {/* 봉이 헤더 */}
        <div className="text-center mb-10">
          <MonoLabel caps className="block mb-2">성산일출봉 · 소원</MonoLabel>
          <h1 className="text-headline-md text-[var(--ink)]">{wish.name}님의 소원이<br/>도착했습니다</h1>
          <p className="text-body-sm text-[var(--muted)] mt-2">{sendDateStr}</p>
        </div>

        {/* 사진 */}
        {wish.photo_url && (
          <div className="mb-8 rounded-[8px] overflow-hidden">
            <FadeImage
              src={wish.photo_url}
              alt="제주 사진"
              className="w-full aspect-[4/3] object-cover"
              wrapperClassName="aspect-[4/3]"
            />
          </div>
        )}

        {/* 소원 */}
        <div className="bg-[var(--paper)] rounded-[14px] p-6 mb-6 border border-[var(--line-soft)]">
          <MonoLabel caps className="block mb-3">소원</MonoLabel>
          <p className="text-body-serif text-[var(--ink)]">{wish.wish_text}</p>
        </div>

        {/* 봉이 편지 */}
        {wish.letter_text && (
          <div className="bg-[var(--paper)] rounded-[14px] p-6 mb-8 border border-[var(--line-soft)]">
            <MonoLabel caps className="block mb-3">봉이의 편지</MonoLabel>
            <p className="text-hand-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap">
              {wish.letter_text}
            </p>
            <div className="mt-6 pt-4 border-t border-dashed border-[var(--line)] text-right">
              <span className="text-hand-md">봉이</span>
            </div>
          </div>
        )}

        {/* 하단 카피 */}
        <p className="text-body-serif text-[var(--muted)] text-center">
          이 소원이 이루어지길 바랍니다.
        </p>

        <div className="text-center mt-8">
          <MonoLabel className="block">느린 소식 · 제주 · No.001</MonoLabel>
        </div>
      </div>

      <PaletteToggle />
    </main>
  );
}
