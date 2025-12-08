import { getPostsAction } from "@/app/adminTioBen/actions/postAction";
import type { Post } from "@/app/adminTioBen/types";

export async function fetchPosts(): Promise<Post[]> {
  return getPostsAction();
}