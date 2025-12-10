import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ AGORA O NEXT 16 EXIGE ISSO
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug não informado" },
        { status: 400 }
      );
    }

    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar post" },
      { status: 500 }
    );
  }
}
