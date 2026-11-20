"use client";

import { useEffect, useState } from "react";

const scales = [
  ["md", "標準"],
  ["lg", "較大"],
  ["xl", "特大"],
] as const;

type Scale = (typeof scales)[number][0];

export function FontToggle() {
  const [current, setCurrent] = useState<Scale>("md");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const value = document.documentElement.dataset.font;
    if (value === "lg" || value === "xl") setCurrent(value);
    setReady(true);
  }, []);

  function apply(scale: Scale) {
    document.cookie = `font-scale=${scale}; path=/; max-age=31536000; samesite=lax`;
    if (scale === "md") delete document.documentElement.dataset.font;
    else document.documentElement.dataset.font = scale;
    setCurrent(scale);
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="文字大小">
      <span className="text-base font-medium text-[#0e3328]">文字</span>
      {scales.map(([scale, label]) => {
        const active = ready && current === scale;
        return (
          <button
            key={scale}
            type="button"
            onClick={() => apply(scale)}
            aria-pressed={ready ? active : undefined}
            className={`min-h-12 rounded-full border px-3 text-base font-medium ${
              active ? "border-[#14603a] bg-[#14603a] text-white" : "border-[#14603a]/30 bg-white text-[#0e3328] hover:bg-[#e3f3e6]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
