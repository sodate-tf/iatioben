// components/blog/portal/BlogPortalThreeCols.tsx
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

function Col({
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
  const top = posts[0];          // ✅ destaque com imagem
  const rest = posts.slice(1, 6); // ✅ cards sem imagem

  return (
    <section className="min-w-0" aria-labelledby={`col-${categorySlug}`}>
      {/* Cabeçalho da coluna */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            id={`col-${categorySlug}`}
            className={`text-lg font-extrabold ${theme.accentText}`}
          >
            {theme.label}
          </h2>
          <div
            className={`h-1 w-16 rounded-full ${theme.accentUnderline} mt-2`}
          />
        </div>

        <Link
          href={`/blog/categoria/${categorySlug}`}
          aria-label={`Ver todos os posts de ${theme.label}`}
          className={`text-sm font-semibold ${theme.accentText} hover:underline`}
        >
          Ver todos
        </Link>
      </div>

      {/* Conteúdo da coluna */}
      <div className="mt-4 space-y-4">
        {/* ✅ Post principal com cover */}
        {top ? (
          <PortalCard
            post={top}
            siteUrl={siteUrl}
            theme={theme}
            size="md"
          />
        ) : (
          <div
            className={`rounded-3xl border ${theme.accentBorder} ${theme.accentBg} p-6 text-gray-700`}
          >
            Sem posts ainda.
          </div>
        )}

        {/* ✅ Lista editorial (cards sem imagem + ícone sutil) */}
        <ul className="space-y-2" role="list">
          {rest.map((p) => (
            <li key={(p as any).id ?? p.slug}>
              <div className="flex items-start gap-2">
                {/* Ícone sutil */}
               

                <PortalCard
                  post={p}
                  siteUrl={siteUrl}
                  theme={theme}
                  size="sm"
                  hideCover
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function BlogPortalThreeCols({
  a,
  b,
  c,
  siteUrl,
}: {
  a: { theme: Theme; categorySlug: string; posts: Post[] };
  b: { theme: Theme; categorySlug: string; posts: Post[] };
  c: { theme: Theme; categorySlug: string; posts: Post[] };
  siteUrl: string;
}) {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      aria-label="Destaques por categoria"
    >
      <Col {...a} siteUrl={siteUrl} />
      <Col {...b} siteUrl={siteUrl} />
      <Col {...c} siteUrl={siteUrl} />
    </section>
  );
}
