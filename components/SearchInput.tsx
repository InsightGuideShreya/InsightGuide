"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params?.get("q") ?? "");

  useEffect(() => {
    setQ(params?.get("q") ?? "");
  }, [params]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) {
      router.push("/");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={onSubmit} className="search-bar" role="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        placeholder="Search reviews…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search reviews"
      />
      <kbd className="kbd" aria-hidden>/</kbd>
    </form>
  );
}
