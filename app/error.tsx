"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl font-bold">頁面暫時打不開</h1>
      <p>請再試一次。如果一直出現，稍後再回來即可。</p>
      <button type="button" onClick={() => reset()} className="h-12 rounded-lg bg-[#12382c] px-4 text-white">
        再試一次
      </button>
    </div>
  );
}
