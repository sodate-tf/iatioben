// app/og/blog/[slug]/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getPostBySlug } from "@/app/adminTioBen/actions/postAction";

export const runtime = "edge";
export const contentType = "image/png";

const size = { width: 1200, height: 630 };

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function GET(request: NextRequest, context: any) {
  const { origin, searchParams } = new URL(request.url);

  // ✅ Next 16: params pode vir como Promise; não tipar.
  const params = (await context?.params) as Record<string, string>;
  const slug = String(params?.slug || "").trim();

  // Se quiser permitir override via query:
  // /og/blog/slug?title=...&description=...
  let title = (searchParams.get("title") || "").trim();
  let description = (searchParams.get("description") || "").trim();

  // Se não veio por query, busca do DB por slug
  if (!title || !description) {
    try {
      const post = await getPostBySlug(slug);
      if (post) {
        title = title || String(post.title || "Blog Tio Ben").trim();
        description =
          description || String(post.metaDescription || post.title || "Leia no Blog Tio Ben.").trim();
      }
    } catch {
      // mantém fallback
    }
  }

  // Fallback definitivo
  title = title || "Blog Tio Ben";
  description = description || "Acesse o Blog Tio Ben e aprenda mais sobre a fé católica.";

  // ✅ embute seu mockup (public/og/base.png)
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;

  if (baseRes.ok) {
    const buf = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buf)}`;
  }

  // limites para caber bem
  const t = clamp(title, 90);
  const d = clamp(description, 200);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          backgroundColor: "#FFF6E8",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 135,
            left: 80,
            width: 690,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 74,
              fontWeight: 900,
              lineHeight: 1.06,
              color: "#465572",
              letterSpacing: -0.6,
              wordBreak: "break-word",
            }}
          >
            {t}
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              lineHeight: 1.45,
              color: "#465572",
              wordBreak: "break-word",
            }}
          >
            {d}
          </div>

          <div style={{ display: "flex", marginTop: 10 }}>
            <div
              style={{
                backgroundColor: "#2EAF5D", // verde BLOG
                color: "#fff",
                padding: "10px 16px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              BLOG
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        // ⚠️ Para OG dinâmico por slug eu não recomendo immutable.
        // WhatsApp/Facebook podem cachear agressivo.
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
