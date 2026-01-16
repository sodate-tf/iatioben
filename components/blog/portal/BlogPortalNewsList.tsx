// components/blog/portal/BlogPortalNewsList.tsx
import Link from "next/link";
import { Post } from "@/app/adminTioBen/types";

function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("pt-BR");
}
function postHref(p: Post) {
  return `/blog/${p.slug}`;
}

export default function BlogPortalNewsList({
  title,
  categoryName,
  categorySlug,
  posts,
}: {
  title: string;
  categoryName: string;
  categorySlug: string;
  posts: Post[];
}) {
  const items = posts.slice(0, 6);

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
          {title}
        </h2>
        <Link
          href={`/blog/categoria/${categorySlug}`}
          className="text-sm font-semibold text-amber-900 hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border bg-white shadow-sm divide-y">
        {items.length ? (
          items.map((p) => (
            <article key={p.id} className="p-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-amber-900">{categoryName}</span>
                <span>•</span>
                <span>{formatDate(p.publishDate)}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-gray-900 leading-snug">
                <Link href={postHref(p)} className="hover:underline">
                  {p.title}
                </Link>
              </h3>
            </article>
          ))
        ) : (
          <div className="p-4 text-gray-600">Sem notícias publicadas ainda.</div>
        )}
      </div>
    </section>
  );
}
