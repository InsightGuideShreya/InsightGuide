import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/config";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin" };

export default async function AdminIndex() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAdminEmail(user.email)) {
    redirect("/admin/posts");
  }
  redirect("/admin/login");
}
