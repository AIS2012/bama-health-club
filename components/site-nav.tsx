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

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="主要" className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-12 items-center rounded-lg px-3 text-base font-medium ${
              active ? "bg-[#FAC423] text-[#222]" : "text-white hover:bg-white/15"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
