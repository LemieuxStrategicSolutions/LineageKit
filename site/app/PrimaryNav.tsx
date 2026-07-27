"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", className: "nav-home" },
  { href: "/timeline", label: "Timeline", className: "nav-timeline" },
  { href: "/branches", label: "Family lines" },
  { href: "/stories", label: "Stories" },
  { href: "/library", label: "Research library" },
  { href: "/contribute", label: "Contribute", className: "nav-contribute" },
];

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={["nav-link", item.className, active ? "is-active" : ""].filter(Boolean).join(" ")}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
