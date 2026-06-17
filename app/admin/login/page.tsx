"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = "/admin/posts";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(60% 80% at 80% 20%, rgba(255,91,58,0.15), transparent 60%), var(--bg)",
      }}
    >
      <div className="panel-card" style={{ maxWidth: 420, width: "100%", padding: 28 }}>
        <div className="brand" style={{ marginBottom: 18 }}>
          <span className="mark">IG</span>
          <span>{SITE_NAME}</span>
        </div>
        <h1 className="display h3" style={{ margin: "0 0 6px" }}>Sign in to admin</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 22 }}>
          Use the email listed in <span className="kbd">ADMIN_EMAILS</span>.
        </p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error ? <div className="notice error">{error}</div> : null}
          <button className="btn lg" disabled={busy} type="submit" style={{ width: "100%" }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <Link
            href="/"
            className="btn ghost"
            style={{ marginTop: 10, width: "100%" }}
          >
            Back to site
          </Link>
        </form>
      </div>
    </div>
  );
}
