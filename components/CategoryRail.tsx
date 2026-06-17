import Link from "next/link";
import { CATEGORIES } from "@/lib/config";

export default function CategoryRail({ active }: { active?: string }) {
  return (
    <div className="cat-rail" role="navigation" aria-label="Categories">
      {CATEGORIES.map((c) => {
        const isActive = active === c || (!active && c === "All");
        const href = c === "All" ? "/" : `/?category=${encodeURIComponent(c)}`;
        return (
          <Link
            key={c}
            href={href}
            className={`chip ${isActive ? "active" : ""}`}
          >
            {c}
          </Link>
        );
      })}
    </div>
  );
}
