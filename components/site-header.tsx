"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { FontToggle } from "@/components/font-toggle";
import { SiteNav } from "@/components/site-nav";
import { signOutAction } from "@/lib/actions";
import type { Role } from "@/lib/types";

export function SiteHeader({ user }: { user: { nickname: string; role: Role } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const staff = user?.role === "admin" || user?.role === "branch_manager";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    function onChange() {
      if (media.matches) setOpen(false);
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !menuRef.current) return;
    const items = [...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter((item) => !item.hasAttribute("disabled"));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-[#14603a]/10 bg-[#f4f7f1]/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-2 px-3 md:hidden">
        <Link href="/" className="inline-flex min-h-11 min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span
            data-logo-slot="official"
            title="官方標誌位置，待公司核准後替換，請勿外連官網圖檔"
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[#14603a] font-serif text-lg leading-none text-white"
          >
            八
          </span>
          <span className="truncate font-serif text-lg leading-none text-[#0e3328]">八馬健康俱樂部</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          {user ? (
            <Link href="/profile" onClick={() => setOpen(false)} className="inline-flex h-10 max-w-24 items-center truncate rounded-full px-2 text-base font-medium text-[#0e3328]">
              {user.nickname}
            </Link>
          ) : (
            <Link href="/signup" className="inline-flex h-10 items-center rounded-full bg-[#14603a] px-3 text-base font-medium text-white">
              免費加入
            </Link>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-[#0e3328] hover:bg-[#e3f3e6]"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "關閉選單" : "開啟選單"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto hidden max-w-6xl gap-3 px-6 py-3 md:grid">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center gap-3">
            <span
              data-logo-slot="official"
              title="官方標誌位置，待公司核准後替換，請勿外連官網圖檔"
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-[#14603a] font-serif text-2xl leading-none text-white"
            >
              八
            </span>
            <span>
              <span className="block font-serif text-2xl leading-none text-[#0e3328]">八馬健康俱樂部</span>
              <span className="mt-1 block text-base text-[#3c5146]">Total Swiss 八馬國際事業</span>
            </span>
          </Link>
          <div className="flex flex-nowrap items-center gap-2">
            {staff ? (
              <Link href="/admin" className="inline-flex min-h-12 items-center rounded-full bg-[#e3f3e6] px-4 font-medium whitespace-nowrap text-[#0e3328]">
                {user?.role === "branch_manager" ? "據點活動" : "管理後台"}
              </Link>
            ) : null}
            {user ? (
              <>
                <Link href="/profile" className="inline-flex min-h-12 items-center rounded-full px-3 font-medium whitespace-nowrap text-[#0e3328] hover:bg-[#e3f3e6]">
                  {user.nickname}
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="inline-flex min-h-12 items-center rounded-full border border-[#14603a]/30 bg-white px-4 whitespace-nowrap text-[#0e3328]">
                    登出
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex min-h-12 items-center rounded-full px-3 font-medium whitespace-nowrap text-[#0e3328] hover:bg-[#e3f3e6]">
                  登入
                </Link>
                <Link href="/signup" className="inline-flex min-h-12 items-center rounded-full bg-[#14603a] px-4 font-medium whitespace-nowrap text-white hover:bg-[#0f5132]">
                  免費加入
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-nowrap items-center justify-between gap-3 overflow-x-auto">
          <SiteNav />
          <FontToggle />
        </div>
      </div>

    </header>
      {open ? (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="主選單"
          className="menu-panel fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-[#f4f7f1] px-4 py-5 md:hidden"
          onKeyDown={trapFocus}
        >
          <SiteNav layout="menu" onNavigate={close} />
          <div className="mt-3 grid gap-2 border-t border-[#14603a]/15 pt-3">
            {staff ? (
              <Link href="/admin" onClick={close} className="flex min-h-14 items-center rounded-2xl px-4 text-xl font-medium text-[#0e3328] hover:bg-[#e3f3e6]">
                {user?.role === "branch_manager" ? "據點活動" : "管理後台"}
              </Link>
            ) : null}
            {user ? (
              <>
                <Link href="/profile" onClick={close} className="flex min-h-14 items-center rounded-2xl px-4 text-xl font-medium text-[#0e3328] hover:bg-[#e3f3e6]">
                  {user.nickname}
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="flex min-h-14 w-full items-center rounded-2xl px-4 text-left text-xl font-medium text-[#0e3328] hover:bg-[#e3f3e6]">
                    登出
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" onClick={close} className="flex min-h-14 items-center rounded-2xl px-4 text-xl font-medium text-[#0e3328] hover:bg-[#e3f3e6]">
                登入
              </Link>
            )}
          </div>
          <div className="mt-4 grid gap-3 border-t border-[#14603a]/15 pt-4">
            <p className="px-1 text-base font-medium text-[#3c5146]">文字大小</p>
            <FontToggle showLabel={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
