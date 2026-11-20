"use client";

import { useEffect, useState } from "react";
import { FRAUD_WARNING } from "@/lib/constants";

const STORAGE_KEY = "bama-notice-dismissed";

export function SiteNotice({ demo }: { demo: boolean }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setHidden(true);
  }

  return (
    <div className="fraud-banner" role="note">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-1 sm:px-6 md:py-2">
        <p className="min-w-0 flex-1 truncate text-base font-medium md:overflow-visible md:whitespace-normal md:text-clip">
          <span className="md:hidden">{demo ? "示範 · " : ""}防詐：不會要求轉帳或密碼</span>
          <span className="hidden md:inline">
            {FRAUD_WARNING}
            {demo ? " 目前是本機示範模式，尚未連接 Supabase。資料只存在這台電腦。" : ""}
          </span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none font-bold text-[#1a1200] hover:bg-[#1a1200]/10"
          aria-label="關閉提醒"
        >
          ×
        </button>
      </div>
    </div>
  );
}
