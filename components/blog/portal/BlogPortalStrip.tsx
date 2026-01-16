// components/blog/portal/BlogPortalStrip.tsx
import Link from "next/link";
import { Post } from "@/app/adminTioBen/types";

type Theme = {
  label: string;
  accentText: string;
  accentUnderline: string;
};

export default function BlogPortalStrip({
  theme,
  categorySlug,
  posts,
}: {
  theme: Theme;
  categorySlug: string;
  posts: Post[];
}) {
  const items = posts.slice(0, 8);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className={`text-xl font-extrabold ${theme.accentText}`}>{theme.label}</div>
          <div className={`h-1 w-16 rounded-full ${theme.accentUnderline} mt-2`} />
        </div>

        <Link
          href={`/blog/categoria/${categorySlug}`}
          className={`text-sm font-semibold ${theme.accentText} hover:underline`}
        >
          Ver todas
        </Link>
      </div>

      <div className="mt-4 rounded-3xl border border-gray-200 bg-white overflow-hidden">
        {items.length ? (
          <div className="divide-y">
            {items.map((p) => (
              <a
                key={(p as any).id ?? p.slug}
                href={`/blog/${p.slug}`}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="text-sm font-extrabold text-gray-900 hover:underline line-clamp-2">
                  {p.title}
                </div>
                {p.metaDescription ? (
                  <div className="mt-1 text-sm text-gray-700 line-clamp-2">
                    {p.metaDescription}
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        ) : (
          <div className="p-4 text-gray-600">Sem posts ainda.</div>
        )}
      </div>
    </section>
  );
}
