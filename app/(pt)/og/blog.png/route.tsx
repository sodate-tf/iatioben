import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET() {
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
        <div style={{ fontSize: 76, fontWeight: 900, color: "#465572", lineHeight: 1.05 }}>
          Blog Tio Ben
        </div>
        <div style={{ marginTop: 18, fontSize: 34, fontWeight: 600, color: "#465572" }}>
          Santos, liturgia e reflexões católicas para fortalecer sua fé.
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
