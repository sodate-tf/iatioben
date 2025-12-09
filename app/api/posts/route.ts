import { NextResponse } from "next/server";
import { getPostsAction } from "@/app/adminTioBen/actions/postAction";

export async function GET() {
  try {
    const posts = await getPostsAction();

    // ✅ Retorna somente os posts ativos e publicados
    const now = new Date();

    const activePosts = posts.filter((post) => {
      const publishDate = new Date(post.publishDate);
      const expiryDate = post.expiryDate ? new Date(post.expiryDate) : null;

      return (
        post.isActive &&
        publishDate <= now &&
        (!expiryDate || expiryDate > now)
      );
    });

    return NextResponse.json(activePosts);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
  }
}
