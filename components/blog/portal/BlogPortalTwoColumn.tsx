// components/blog/portal/BlogPortalTwoColumn.tsx
import BlogPortalSection from "./BlogPortalSection";
import { Post } from "@/app/adminTioBen/types";

export default function BlogPortalTwoColumn({
  left,
  right,
}: {
  left: { title: string; categoryName: string; categorySlug: string; posts: Post[] };
  right: { title: string; categoryName: string; categorySlug: string; posts: Post[] };
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BlogPortalSection
        title={left.title}
        categoryName={left.categoryName}
        categorySlug={left.categorySlug}
        posts={left.posts}
        variant="pilar"
      />
      <BlogPortalSection
        title={right.title}
        categoryName={right.categoryName}
        categorySlug={right.categorySlug}
        posts={right.posts}
        variant="pilar"
      />
    </section>
  );
}
