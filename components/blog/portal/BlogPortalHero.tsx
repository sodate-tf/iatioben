// components/blog/portal/BlogPortalHero.tsx
import Link from "next/link";
import { Post } from "@/app/adminTioBen/types";

function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("pt-BR");
}

function postHref(p: Post) {
  // Ajuste se seu slug/rota for diferente
  return `/blog/${p.slug}`;
}

export default function BlogPortalHero({
  featured,
  secondary,
}: {
  featured: Post | null;
  secondary: Post[];
}) {
  if (!featured) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
      <article className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-amber-900">{featured.categoryName}</span>
          <span>•</span>
          <span>{formatDate(featured.publishDate)}</span>
        </div>

        <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
          <Link href={postHref(featured)} className="hover:underline">
            {featured.title}
          </Link>
        </h2>

        {featured.metaDescription && (
          <p className="mt-3 text-gray-700 leading-relaxed">
            {featured.metaDescription}
          </p>
        )}

        <div className="mt-5">
          <Link
            href={postHref(featured)}
            className="inline-flex items-center rounded-xl bg-amber-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-95"
          >
            Ler agora
          </Link>
        </div>
      </article>

      <div className="space-y-3">
        {secondary.slice(0, 3).map((p) => (
          <article key={p.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-amber-900">{p.categoryName}</span>
              <span>•</span>
              <span>{formatDate(p.publishDate)}</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-gray-900 leading-snug">
              <Link href={postHref(p)} className="hover:underline">
                {p.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
