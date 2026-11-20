"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首頁" },
  { href: "/activities", label: "活動" },
  { href: "/branches", label: "據點" },
  { href: "/groups", label: "社團" },
  { href: "/challenges", label: "挑戰" },
];

export function SiteNav({ layout = "bar", onNavigate }: { layout?: "bar" | "menu"; onNavigate?: () => void }) {
  const pathname = usePathname();
  const menu = layout === "menu";
  return (
    <nav aria-label="主要" className={menu ? "grid gap-2" : "flex flex-nowrap gap-2"}>
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={
              menu
                ? `flex min-h-14 items-center rounded-2xl px-4 text-xl font-medium ${
                    active ? "bg-[#14603a] text-white" : "text-[#0e3328] hover:bg-[#e3f3e6]"
                  }`
                : `inline-flex min-h-12 shrink-0 items-center rounded-full px-4 text-base font-medium whitespace-nowrap ${
                    active ? "bg-[#14603a] text-white" : "text-[#0e3328] hover:bg-[#e3f3e6]"
                  }`
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
