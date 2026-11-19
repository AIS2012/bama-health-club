"use client";

const scales = [
  ["md", "標準"],
  ["lg", "較大"],
  ["xl", "特大"],
] as const;

export function FontToggle() {
  function apply(scale: (typeof scales)[number][0]) {
    document.cookie = `font-scale=${scale}; path=/; max-age=31536000; samesite=lax`;
    if (scale === "md") delete document.documentElement.dataset.font;
    else document.documentElement.dataset.font = scale;
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="文字大小">
      <span className="text-base font-medium">文字</span>
      {scales.map(([scale, label]) => (
        <button
          key={scale}
          type="button"
          onClick={() => apply(scale)}
          className="min-h-12 rounded-lg border border-current px-3 text-base font-medium hover:bg-white/15"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
