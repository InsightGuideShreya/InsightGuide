import { createClient } from "@/lib/supabase/server";
import PostEditor from "../PostEditor";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PostEditor mode="create" authorId={user?.id ?? null} />;
}

export const dynamic = "force-dynamic";
