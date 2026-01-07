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
    70 // menos para evitar quebra feia
  );

  const description = clamp(
    searchParams.get("description") ??
      "Liturgia diária, evangelho e leituras para viver a fé todos os dias.",
    140
  );

  const imageRes = await fetch(`${origin}/og/base.png`);
  const bg = imageRes.ok
    ? `data:image/png;base64,${arrayBufferToBase64(
        await imageRes.arrayBuffer()
      )}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#FFF6E8",
          fontFamily:
            "Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        {/* background */}
        {bg && (
          <img
            src={bg}
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

        {/* bloco de texto */}
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 80,
            maxWidth: 620,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* TÍTULO */}
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#465572",
              letterSpacing: -0.8,
              marginBottom: 22,
              maxHeight: 130, // impede invasão
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* DESCRIÇÃO */}
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.45,
              fontWeight: 400,
              color: "#465572",
              maxHeight: 110,
              overflow: "hidden",
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
