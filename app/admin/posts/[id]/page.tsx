import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostEditor from "../PostEditor";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!post) return notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, image_path, affiliate_url, rating, position")
    .eq("post_id", id)
    .order("position", { ascending: true });

  return <PostEditor mode="edit" post={post} products={products ?? []} />;
}

export const dynamic = "force-dynamic";
