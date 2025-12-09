import { NextResponse } from "next/server";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar post" }, { status: 500 });
  }
}
