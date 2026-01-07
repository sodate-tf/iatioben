// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const title = clamp(
    searchParams.get("title") ?? "IA Tio Ben",
    90
  );

  const description = clamp(
    searchParams.get("description") ??
      "Liturgia diária, evangelho e leituras para viver a fé todos os dias.",
    160
  );

  // 🔹 busca a imagem em /public/og/base.png
  const imageResponse = await fetch(`${origin}/og/base.png`);

  let backgroundImage: string | null = null;

  if (imageResponse.ok) {
    const buffer = await imageResponse.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          backgroundColor: "#FFF6E8",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
        }}
      >
        {/* background */}
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

        {/* texto */}
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 80,
            maxWidth: 620,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#465572",
              letterSpacing: -0.5,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#465572",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    size
  );
}
