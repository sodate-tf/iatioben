// components/blog/portal/PortalCard.tsx
import Link from "next/link";
import { Post } from "@/app/adminTioBen/types";
import { getPostCoverUrl } from "./cover";

function formatDatePtBr(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("pt-BR");
}

function dateTimeIso(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toISOString();
}

function postHref(p: Post) {
  return `/blog/${p.slug}`;
}

export default function PortalCard({
  post,
  siteUrl,
  theme,
  size = "md",
  hideCover = false, // ✅ novo
}: {
  post: Post;
  siteUrl: string;
  theme: {
    label: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    ogTint: string;
  };
  size?: "sm" | "md" | "lg";
  hideCover?: boolean;
}) {
  const cover = getPostCoverUrl({ siteUrl, post, tint: theme.ogTint });

  const titleClass =
    size === "lg"
      ? "text-2xl md:text-3xl"
      : size === "md"
      ? "text-base md:text-lg"
      : "text-sm";

  return (
    <article
      className={`rounded-3xl border ${theme.accentBorder} bg-white overflow-hidden shadow-sm hover:shadow-md transition`}
    >
      {/* Card inteiro clicável */}
      <Link
        href={postHref(post)}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 rounded-3xl"
        aria-label={post.title}
      >
        {/* =====================
            CAPA (opcional)
        ===================== */}
        {!hideCover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={cover}
              alt={post.title}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />

            {/* Chip categoria */}
            <div className="absolute left-3 top-3">
              <span
                className={`inline-flex items-center ${theme.accentBg} ${theme.accentText} text-xs font-extrabold px-3 py-1 rounded-full border ${theme.accentBorder}`}
              >
                {theme.label}
              </span>
            </div>
          </div>
        )}

        {/* =====================
            CONTEÚDO
        ===================== */}
        <div className={`p-4 ${hideCover ? "pt-3" : ""}`}>
          {/* Data */}
          <time
            className="text-xs text-gray-500"
            dateTime={dateTimeIso(post.publishDate)}
          >
            {formatDatePtBr(post.publishDate)}
          </time>

          {/* Título + ícone sutil quando sem imagem */}
          <div className="mt-2 flex items-start gap-2">
            {hideCover && (
              <></>
            )}

            <h3
              className={`font-extrabold text-gray-900 leading-snug ${titleClass}`}
            >
              {post.title}
            </h3>
          </div>

          {post.metaDescription && !hideCover ? (
            <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-3">
              {post.metaDescription}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
