import Link from "next/link";
import Image from "next/image";
import PaletteToggle from "@/components/PaletteToggle";
import MonoLabel from "@/components/ui/MonoLabel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-start px-7 pt-10 pb-8">
      {/* 헤더 */}
      <div className="w-full max-w-[390px] mb-6 text-center">
        <MonoLabel caps className="block mb-4">
          제주 · No.001
        </MonoLabel>
        <h1 className="text-display text-[var(--ink)]">느린 소식</h1>
        <p className="text-body-sm text-[var(--muted)] mt-2">제주의 추억을 내륙에서 받아 보세요</p>
      </div>

      {/* 기능 카드 */}
      <div className="w-full max-w-[390px] flex flex-col gap-4">
        {/* 봉이 버튼 */}
        <Link href="/wish" className="block animate-btn-pulse active:scale-[0.96] transition-transform duration-150">
          <Image src="/BT1.png" alt="성산일출봉 소원 빌기" width={390} height={200} className="w-full" style={{ height: "auto" }} loading="eager" />
        </Link>

        {/* 바람이 버튼 */}
        <Link href="/letter" className="block animate-btn-pulse-delayed active:scale-[0.96] transition-transform duration-150">
          <Image src="/BT2.png" alt="배편 서신 편지 쓰기" width={390} height={200} className="w-full" style={{ height: "auto" }} />
        </Link>
      </div>

      {/* 하단 카피 */}
      <p className="text-body-serif text-[var(--muted)] text-center mt-6 max-w-[280px]">
        너무 빠른 이 세계,<br/>우리에게 필요한건 느린 미학
      </p>

      <PaletteToggle />
    </main>
  );
}
