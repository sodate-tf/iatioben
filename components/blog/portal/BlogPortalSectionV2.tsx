// components/blog/portal/BlogPortalSectionV2.tsx
import Link from "next/link";
import { Post } from "@/app/adminTioBen/types";
import PortalCard from "./PortalCard";

type Theme = {
  label: string;
  name: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentUnderline: string;
  ogTint: string;
};

export default function BlogPortalSectionV2({
  theme,
  categorySlug,
  posts,
  siteUrl,
}: {
  theme: Theme;
  categorySlug: string;
  posts: Post[];
  siteUrl: string;
}) {
  const top = posts[0];
  const grid = posts.slice(1, 7);

  return (
    <section
      className={`rounded-[28px] border ${theme.accentBorder} ${theme.accentBg} p-6`}
      aria-labelledby={`section-${categorySlug}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* ✅ Heading de seção */}
          <h2
            id={`section-${categorySlug}`}
            className={`text-xl md:text-2xl font-extrabold ${theme.accentText}`}
          >
            {theme.label}
          </h2>
          <div className={`h-1 w-16 rounded-full ${theme.accentUnderline} mt-2`} />
        </div>

        <Link
          href={`/blog/categoria/${categorySlug}`}
          aria-label={`Ver todos os posts de ${theme.label}`}
          className={`rounded-full bg-white px-4 py-2 text-sm font-semibold border ${theme.accentBorder} ${theme.accentText} hover:shadow-sm`}
        >
          Ver todos
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
        <div className="min-w-0">
          {top ? (
            <PortalCard post={top} siteUrl={siteUrl} theme={theme} size="lg" />
          ) : (
            <div className="rounded-3xl border border-white/60 bg-white/60 p-6 text-gray-700">
              Sem posts ainda.
            </div>
          )}
        </div>

        {/* ✅ Lista semântica */}
        <ul className="min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
          {grid.map((p) => (
            <li key={(p as any).id ?? p.slug}>
              <PortalCard post={p} siteUrl={siteUrl} theme={theme} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
