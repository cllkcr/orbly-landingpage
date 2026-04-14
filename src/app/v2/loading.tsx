export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-teal)]/20 border-t-[var(--color-teal)] animate-spin" />
    </div>
  );
}
