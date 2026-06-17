import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SITE_NAME } from "@/lib/config";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    // Not signed in — render children without the shell (login page handles its own UI)
    return <div style={{ minHeight: "100vh" }}>{children}</div>;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}

async function signOut() {
  "use server";
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function AdminShell({
  user,
  children,
}: {
  user: { email: string };
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/" className="brand" style={{ color: "var(--text)" }}>
          <span className="mark">IG</span>
          <span>{SITE_NAME}</span>
        </Link>

        <div className="group">
          <h6>Content</h6>
          <Link href="/admin/posts">Posts</Link>
          <Link href="/admin/posts/new">+ New post</Link>
        </div>

        <div className="group">
          <h6>Newsletter</h6>
          <Link href="/admin/subscribers">Subscribers</Link>
        </div>

        <div className="group">
          <h6>System</h6>
          <Link href="/">View site ↗</Link>
        </div>

        {/* Desktop-only who block */}
        <div className="who">
          <span className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em" }}>
            Signed in as
          </span>
          <span className="email">{user.email}</span>
          <form action={signOut}>
            <button type="submit" className="btn quiet" style={{ marginTop: 8, width: "100%" }}>
              Sign out
            </button>
          </form>
        </div>

        {/* Mobile-only flat who-bar */}
        <div className="who-mobile">
          <span>Signed in as {user.email}</span>
          <form action={signOut}>
            <button type="submit" className="btn quiet">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
