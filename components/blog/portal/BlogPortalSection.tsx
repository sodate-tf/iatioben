// components/blog/portal/BlogPortalSection.tsx
import Link from "next/link";
import { Post } from "@/app/adminTioBen/types";

function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("pt-BR");
}

function postHref(p: Post) {
  return `/blog/${p.slug}`;
}

type Variant = "pilar" | "grid";

export default function BlogPortalSection({
  title,
  subtitle,
  categoryName,
  categorySlug,
  posts,
  variant = "grid",
}: {
  title: string;
  subtitle?: string;
  categoryName: string;
  categorySlug: string;
  posts: Post[];
  variant?: Variant;
}) {
  const top = posts[0];
  const rest = posts.slice(1, variant === "pilar" ? 5 : 4);

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <Link
          href={`/blog/categoria/${categorySlug}`}
          className="text-sm font-semibold text-amber-900 hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="mt-4">
        {variant === "pilar" ? (
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-6">
            {/* Principal */}
            {top ? (
              <article className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-amber-900">{categoryName}</span>
                  <span>•</span>
                  <span>{formatDate(top.publishDate)}</span>
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
                  <Link href={postHref(top)} className="hover:underline">
                    {top.title}
                  </Link>
                </h3>
                {top.metaDescription && (
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {top.metaDescription}
                  </p>
                )}
              </article>
            ) : (
              <div className="rounded-2xl border bg-white p-6 text-gray-600">
                Nenhum post em {categoryName} ainda.
              </div>
            )}

            {/* Lista */}
            <div className="space-y-3">
              {rest.map((p) => (
                <article key={p.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(p.publishDate)}</span>
                  </div>
                  <h4 className="mt-1 text-base font-bold text-gray-900 leading-snug">
                    <Link href={postHref(p)} className="hover:underline">
                      {p.title}
                    </Link>
                  </h4>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.slice(0, 6).map((p) => (
              <article key={p.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-amber-900">{categoryName}</span>
                  <span>•</span>
                  <span>{formatDate(p.publishDate)}</span>
                </div>
                <h3 className="mt-2 text-base font-extrabold text-gray-900 leading-snug">
                  <Link href={postHref(p)} className="hover:underline">
                    {p.title}
                  </Link>
                </h3>
                {p.metaDescription && (
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {p.metaDescription}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
