import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage() {
  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = subs ?? [];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Newsletter subscribers</h1>
          <div className="desc">Emails captured from the public site.</div>
        </div>
        <div className="stat-card" style={{ minWidth: 160 }}>
          <div className="lbl">Total</div>
          <div className="val">{rows.length}</div>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="panel-card" style={{ padding: 6 }}>
          <table className="admin">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Email">{r.email}</td>
                  <td data-label="Subscribed" className="muted">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p style={{ margin: 0 }}>
            No subscribers yet. The signup form lives in the site footer and About page.
          </p>
        </div>
      )}
    </div>
  );
}
