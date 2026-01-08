import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const raw = String(params.slug || "").trim();
  const slug = raw.replace(/\.png$/i, "");

  let title = "Blog Tio Ben";
  let description = "Leia este post e aprofunde sua fé com conteúdo católico.";

  try {
    const post = await getPostBySlug(slug);

    if (post?.slug === slug) {
      title = post.title || title;
      description = (post.metaDescription || post.title || description).trim();
    }
  } catch {
    // mantém fallback
  }

  title = clamp(title, 80);
  description = clamp(description, 180);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#FFF6E8",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ fontSize: 74, fontWeight: 900, color: "#465572", lineHeight: 1.06 }}>
          {title}
        </div>
        <div style={{ marginTop: 18, fontSize: 32, fontWeight: 600, color: "#465572" }}>
          {description}
        </div>

        <div style={{ marginTop: 32, display: "flex" }}>
          <div
            style={{
              backgroundColor: "#2FBF71",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            BLOG
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
