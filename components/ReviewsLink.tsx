"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReviewsLink() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!onHome) return; // let normal navigation happen from other pages
    const el = document.getElementById("reviews");
    if (!el) return;
    e.preventDefault();
    // header is sticky; offset for it
    const header = document.querySelector(".site-header") as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 0) + 8;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", "/#reviews");
  }

  return (
    <Link href="/#reviews" onClick={onClick}>
      Reviews
    </Link>
  );
}
