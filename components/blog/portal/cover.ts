// components/blog/portal/cover.ts
import { Post } from "@/app/adminTioBen/types";

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

// Gera 1..6 baseado no post (sem repetir tanto)
export function getMockIndex(post: Post) {
  const key = String((post as any).id ?? post.slug ?? post.title ?? "post");
  const h = hashString(key);
  return (h % 6) + 1;
}

/**
 * Usa sua rota /og para criar "cover" automático com mockup + título.
 * Você vai implementar no /og:
 * - m=1..6 (escolhe mock)
 * - tint=amber|rose|emerald|...
 * - title=... (texto sobreposto)
 */
export function getPostCoverUrl(opts: {
  siteUrl: string;
  post: Post;
  tint: string;
}) {
  const { siteUrl, post, tint } = opts;
  const m = getMockIndex(post);

  // Use metaDescription se quiser, ou mantenha só título
  const title = encodeURIComponent(post.title || "Post");
  return `${siteUrl}/og?type=post&m=${m}&tint=${encodeURIComponent(
    tint
  )}&title=${title}&v=post-${m}`;
}
