// components/blog/portal/BlogPortalHeroV2.tsx
import { Post } from "@/app/adminTioBen/types";
import PortalCard from "./PortalCard";

export default function BlogPortalHeroV2({
  featured,
  secondary,
  siteUrl,
}: {
  featured: Post | null;
  secondary: Post[];
  siteUrl: string;
}) {
  if (!featured) return null;

  // Tema neutro pro topo (você pode “puxar” do category depois)
  const heroTheme = {
    label: "Destaque",
    accentText: "text-gray-900",
    accentBg: "bg-gray-50",
    accentBorder: "border-gray-200",
    ogTint: "slate",
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
      <div className="min-w-0">
        <PortalCard post={featured} siteUrl={siteUrl} theme={heroTheme} size="lg" />
        {/* barra de links (como globo) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {secondary.slice(0, 3).map((p) => (
            <a
              key={(p as any).id ?? p.slug}
              href={`/blog/${p.slug}`}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:shadow-sm transition"
            >
              {p.title}
            </a>
          ))}
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {secondary.slice(3, 6).map((p) => (
          <div key={(p as any).id ?? p.slug} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-gray-500">Em alta</div>
            <a href={`/blog/${p.slug}`} className="mt-2 block text-base font-extrabold text-gray-900 leading-snug hover:underline">
              {p.title}
            </a>
            {p.metaDescription ? (
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{p.metaDescription}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
