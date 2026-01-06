// components/aside/AsideLatestPosts.tsx
import Link from "next/link";

export default function AsideLatestPosts({
  posts,
}: {
  posts: {
    slug: string;
    title: string;
    description: string;
  }[];
}) {
  return (
    <aside className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
        Últimos conteúdos
      </h3>

      <ul className="space-y-3">
        {posts.slice(0, 5).map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block hover:underline"
            >
              <p className="text-sm font-semibold text-gray-900">
                {post.title}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
