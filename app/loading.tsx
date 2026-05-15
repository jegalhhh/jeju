export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--line)] border-t-[var(--accent)] animate-spin" />
        <p className="text-body-sm text-[var(--muted)]">불러오는 중...</p>
      </div>
    </main>
  );
}
