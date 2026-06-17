import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 60, textAlign: "center" }}>
      <h1 style={{ fontSize: 32 }}>Not found</h1>
      <p style={{ color: "var(--muted)" }}>That page doesn&apos;t exist.</p>
      <Link href="/" className="btn">Back to home</Link>
    </div>
  );
}
