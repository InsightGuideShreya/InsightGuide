import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/config";
import { redirect } from "next/navigation";

export type CurrentUser = {
  id: string;
  email: string;
};

export async function requireAdmin(): Promise<CurrentUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin/login");
  }
  return { id: user.id, email: user.email! };
}
