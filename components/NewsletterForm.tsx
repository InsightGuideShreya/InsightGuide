"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMsg(data?.error || "Couldn't subscribe — try again later.");
        return;
      }
      setStatus("ok");
      setMsg("You're in. Expect one email the next time a review goes live.");
      setEmail("");
    } catch {
      setStatus("err");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <form className="newsletter" onSubmit={onSubmit}>
      <p>
        <strong>Get the next review in your inbox.</strong>
        <br />
        Issues are rare on purpose. You&apos;ll get one email when a new review
        goes live — never anything else.
      </p>
      <div className="field">
        <label className="label" htmlFor="footer-news-email">Email address</label>
        <input
          id="footer-news-email"
          className="input"
          type="email"
          inputMode="email"
          required
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="btn" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {msg ? (
        <div
          className={`notice ${status === "ok" ? "success" : status === "err" ? "error" : ""}`}
          style={{ marginTop: 12, marginBottom: 0 }}
        >
          {msg}
        </div>
      ) : null}
    </form>
  );
}
