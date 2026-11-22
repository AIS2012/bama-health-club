export function LineLoginButton({ href, demo }: { href: string; demo: boolean }) {
  return (
    <div className="grid gap-3">
      {demo ? (
        <p className="rounded-2xl bg-[#fff3bf] px-4 py-3 text-lg font-medium text-[#1a1200]">
          示範：還沒有設定 LINE 頻道。按下後是模擬登入，不是真正的 LINE。
        </p>
      ) : null}
      <a
        href={href}
        className="inline-flex min-h-16 items-center justify-center gap-3 rounded-lg bg-[#06C755] px-6 text-xl font-bold text-white hover:bg-[#05b34c]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-8 shrink-0">
          <path
            fill="currentColor"
            d="M12 3.2c-5.1 0-9.2 3.3-9.2 7.4 0 3.7 3.3 6.8 7.7 7.3.3.1.7.2.8.5.1.3 0 .7 0 1l-.1.8c0 .2.2.4.4.3.6-.4 3.4-2 4.7-3.4 2-1.3 3.3-3.2 3.3-5.5 0-4.1-4.1-7.4-9.2-7.4z"
          />
        </svg>
        用 LINE 加入
      </a>
    </div>
  );
}
