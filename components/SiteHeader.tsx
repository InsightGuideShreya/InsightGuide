import Link from "next/link";
import { Suspense } from "react";
import SearchInput from "./SearchInput";
import { SITE_NAME, YOUTUBE_URL } from "@/lib/config";
import ReviewsLink from "./ReviewsLink";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container-wide row" style={{ height: 76 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/" className="brand" aria-label={SITE_NAME}>
            <span className="mark">IG</span>
            <span>{SITE_NAME}</span>
          </Link>
          <nav className="nav-pill" aria-label="Primary">
            <ReviewsLink />
            <Link href="/about">About</Link>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </nav>
        </div>
        <div className="actions">
          <Suspense fallback={<div className="search-bar" aria-hidden />}>
            <SearchInput />
          </Suspense>
          <Link href="/admin" className="btn ghost header-admin-link">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
